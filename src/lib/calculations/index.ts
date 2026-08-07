import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, executePagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import type { Calculation } from '@/types';

export async function getCalculations(userId?: string): Promise<Calculation[]> {
  try {
    let queryRef: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.CALCULATIONS);
    
    if (userId) {
      queryRef = queryRef.where('userId', '==', userId);
    }
    
    let snap: FirebaseFirestore.QuerySnapshot;
    try {
      snap = await queryRef.orderBy('createdAt', 'desc').limit(100).get();
    } catch (err: any) {
      if (err?.code === 9 || err?.status === 9 || (typeof err?.message === 'string' && err.message.includes('index'))) {
        console.warn('⚠️ Firestore Composite Index Missing for getCalculations, falling back to un-ordered query.');
        snap = await queryRef.limit(100).get();
      } else {
        throw err;
      }
    }
    
    const list = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    }) as Calculation[];

    list.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  } catch (error: unknown) {
    console.error('Error fetching calculations:', error);
    return [];
  }
}

export async function getCalculationsPage(
  options: { limit?: number; cursor?: string; filters?: PaginationFilters; userId?: string } = {}
): Promise<import('@/types').CursorPageResult<Calculation>> {
  try {
    const collectionRef: FirebaseFirestore.CollectionReference = adminDb.collection(COLLECTIONS.CALCULATIONS);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;
    if (options.userId) combinedFilters.userId = options.userId;

    const page = await executePagedQuery<Calculation>(
      collectionRef,
      { page: 1, limit: options.limit ?? 25, cursor: options.cursor, filters: combinedFilters },
      'createdAt',
      'desc'
    );

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as Calculation[],
    };
  } catch (error: unknown) {
    console.error('Error fetching calculations page:', error);
    return { items: [], hasMore: false };
  }
}

/** Fetch a single calculation by ID */
export async function getCalculationById(id: string): Promise<Calculation | null> {
  try {
    const docSnap = await adminDb.collection(COLLECTIONS.CALCULATIONS).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Calculation;
  } catch (error: unknown) {
    // Quiet fallback
    return null;
  }
}
