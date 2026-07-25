'use server';

import { deletePackageFeatureCategory } from '@/lib/packages/package-features-library';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function deletePackageFeatureCategoryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await deletePackageFeatureCategory(id);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    return { success: true, message: 'Category deleted successfully.' };
  } catch (error: unknown) {
    console.error('Error deleting package feature category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category.',
    };
  }
}
