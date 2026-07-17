import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Calculation } from '@/types';

export async function getCalculations(userId?: string): Promise<Calculation[]> {
  try {
    let queryRef: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.CALCULATIONS);
    
    if (userId) {
      queryRef = queryRef.where('userId', '==', userId);
    }
    
    queryRef = queryRef.limit(100);
    
    const snap = await queryRef.get();
    
    const list = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    }) as Calculation[];

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
