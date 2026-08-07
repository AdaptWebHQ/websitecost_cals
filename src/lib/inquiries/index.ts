import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, executePagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import type { Inquiry, InquiryActivity } from '@/types';

/** Fetch all CRM inquiries, sorted by newest first */
export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.INQUIRIES).orderBy('createdAt', 'desc').limit(100).get();
    
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    }) as Inquiry[];
  } catch (error: unknown) {
    // Quiet fallback
    return [];
  }
}

/** Fetch a single inquiry by ID */
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const docSnap = await adminDb.collection(COLLECTIONS.INQUIRIES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Inquiry;
  } catch (error: unknown) {
    // Quiet fallback
    return null;
  }
}

export async function getInquiriesPage(
  options: { limit?: number; cursor?: string; filters?: PaginationFilters } = {}
): Promise<import('@/types').CursorPageResult<Inquiry>> {
  try {
    const collectionRef = adminDb.collection(COLLECTIONS.INQUIRIES);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;

    const page = await executePagedQuery<Inquiry>(
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
      })) as Inquiry[],
    };
  } catch (error: unknown) {
    console.error('Error fetching inquiries page:', error);
    return { items: [], hasMore: false };
  }
}

export async function getInquiryActivities(inquiryId: string): Promise<InquiryActivity[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.INQUIRY_ACTIVITIES)
      .where('inquiryId', '==', inquiryId)
      .get();

    const list = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      };
    }) as InquiryActivity[];

    // Sort in-memory to bypass composite index requirements
    return list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error: unknown) {
    // Quiet fallback
    return [];
  }
}
