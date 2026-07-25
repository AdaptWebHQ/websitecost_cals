'use server';

import { updateAddonFeature } from '@/lib/addons';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ApiResponse } from '@/types';

export async function toggleAddonFeatureActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updateAddonFeature(id, { isActive });

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    return { success: true, message: 'Feature status updated successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling feature status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

export async function reorderAddonFeaturesAction(
  featureIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const batch = adminDb.batch();
    featureIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    return { success: true, message: 'Features reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering features:', error);
    return {
      success: false,
      error: 'Failed to reorder features.',
    };
  }
}
