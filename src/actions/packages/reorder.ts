'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

export async function reorderPackagesAction(
  orderedIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized.' };
    }

    const batch = adminDb.batch();
    orderedIds.forEach((id, index) => {
      const ref = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
      batch.update(ref, { sortOrder: index + 1, updatedAt: new Date() });
    });

    await batch.commit();
    return { success: true, message: 'Packages reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering packages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder packages.',
    };
  }
}
