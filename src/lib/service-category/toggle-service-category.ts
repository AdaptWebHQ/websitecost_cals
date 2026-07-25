import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { delCachePrefix } from '@/lib/server-cache';
import type { ServiceCategory } from '@/types';

/**
 * Toggle a service category's active status.
 */
export async function toggleServiceCategory(
  id: string
): Promise<ServiceCategory> {
  const docRef = adminDb
    .collection(COLLECTIONS.SERVICE_CATEGORIES)
    .doc(id);

  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error('Service category not found.');
  }

  const data = docSnap.data()!;

  const updatedAt = Timestamp.now();
  const isActive = !data.isActive;

  await docRef.update({
    isActive,
    updatedAt,
  });

  delCachePrefix('service-categories');

  return {
    id: docSnap.id,
    ...(data as Omit<ServiceCategory, 'id' | 'updatedAt' | 'isActive'>),
    isActive,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: updatedAt.toDate(),
  };
}