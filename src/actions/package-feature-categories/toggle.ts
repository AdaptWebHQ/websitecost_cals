'use server';

import { updatePackageFeatureCategory, reorderPackageFeatureCategories } from '@/lib/packages/package-features-library';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function togglePackageFeatureCategoryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updatePackageFeatureCategory(id, { isActive });

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    return { success: true, message: 'Category status updated successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling category status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

export async function reorderPackageFeatureCategoriesAction(
  orderedIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await reorderPackageFeatureCategories(orderedIds);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    return { success: true, message: 'Categories reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering categories:', error);
    return {
      success: false,
      error: 'Failed to reorder categories.',
    };
  }
}
