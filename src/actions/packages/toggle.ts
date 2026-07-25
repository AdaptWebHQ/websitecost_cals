'use server';

import { updatePackage } from '@/lib/packages';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ApiResponse } from '@/types';

export async function togglePackageActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updatePackage(id, { isActive });

    revalidatePath('/admin/packages');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    return { success: true, message: 'Package status updated successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling package status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

/** Reorder sorting list orders in a batch query */
export async function reorderPackagesAction(
  packageIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const batch = adminDb.batch();
    
    packageIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/admin/packages');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    return { success: true, message: 'Packages reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering packages:', error);
    return {
      success: false,
      error: 'Failed to reorder packages.',
    };
  }
}
