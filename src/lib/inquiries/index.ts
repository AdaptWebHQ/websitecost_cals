import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Inquiry, InquiryActivity } from '@/types';

/** Fetch all CRM inquiries, sorted by newest first */
export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.INQUIRIES).orderBy('createdAt', 'desc').get();
    
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
