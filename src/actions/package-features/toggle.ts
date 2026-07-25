'use server';

import { updatePackageFeature, reorderPackageFeatures } from '@/lib/packages/package-features-library';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function togglePackageFeatureActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updatePackageFeature(id, { isActive });

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    return { success: true, message: 'Feature status updated successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling feature status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

export async function reorderPackageFeaturesAction(
  orderedIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await reorderPackageFeatures(orderedIds);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    return { success: true, message: 'Features reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering features:', error);
    return {
      success: false,
      error: 'Failed to reorder features.',
    };
  }
}
