import admin from 'firebase-admin';
import type { PaginationParams } from '@/types';

export interface PaginationFilters {
  [key: string]: unknown;
}

export interface PaginationOptions extends PaginationParams {
  cursor?: string;
  filters?: PaginationFilters;
}

export interface PageResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export function encodeCursor(raw: { id: string; value: unknown }): string {
  return Buffer.from(JSON.stringify(raw), 'utf8').toString('base64url');
}

export function decodeCursor(cursor?: string): { id: string; value: unknown } | undefined {
  if (!cursor) return undefined;
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as {
      id: string;
      value: unknown;
    };
  } catch {
    return undefined;
  }
}

export function normalizeCursorValue(value: unknown): admin.firestore.Timestamp | unknown {
  if (!value) return value;
  if (value instanceof admin.firestore.Timestamp) return value;
  if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
    return new admin.firestore.Timestamp(
      Number((value as any).seconds) || 0,
      Number((value as any).nanoseconds) || 0
    );
  }
  return value;
}

export function buildPagedQuery(
  collectionRef: admin.firestore.CollectionReference,
  options: PaginationOptions,
  orderByField = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc'
): admin.firestore.Query {
  const limit = Math.min(options.limit || 25, 100);
  let query: admin.firestore.Query = collectionRef;

  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        query = query.where(key, 'in', value as unknown[]);
      } else {
        query = query.where(key, '==', value);
      }
    });
  }

  query = query.orderBy(orderByField, orderDirection).orderBy(admin.firestore.FieldPath.documentId());

  const decodedCursor = decodeCursor(options.cursor);
  if (decodedCursor) {
    const cursorValue = normalizeCursorValue(decodedCursor.value);
    query = query.startAfter([cursorValue, decodedCursor.id]);
  }

  return query.limit(limit + 1);
}

export function formatPageResult<T>(
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[],
  limit: number,
  orderByField = 'createdAt'
): PageResult<T> {
  const items = docs.slice(0, limit).map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
  const hasMore = docs.length > limit;
  const lastDoc = docs[limit - 1] ?? docs[docs.length - 1];

  const nextCursor = lastDoc
    ? encodeCursor({
        id: lastDoc.id,
        value: normalizeCursorValue(lastDoc.data()[orderByField] ?? lastDoc.data().createdAt),
      })
    : undefined;

  return {
    items,
    hasMore,
    nextCursor: hasMore ? nextCursor : undefined,
  };
}
