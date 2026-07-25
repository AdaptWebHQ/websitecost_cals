'use server';

import { updatePackageFeatureCategory, getPackageFeatureCategoryById } from '@/lib/packages/package-features-library';
import { packageFeatureCategorySchema, type PackageFeatureCategoryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, PackageFeatureCategory } from '@/types';

export async function updatePackageFeatureCategoryAction(
  id: string,
  data: Omit<PackageFeatureCategoryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<PackageFeatureCategory>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const existing = await getPackageFeatureCategoryById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = packageFeatureCategorySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updatePackageFeatureCategory(id, validated.data);
    const updatedCat = await getPackageFeatureCategoryById(id);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    if (!updatedCat) {
      return { success: false, error: 'Category not found after update.' };
    }

    return {
      success: true,
      data: updatedCat,
      message: 'Category updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating package feature category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category.',
    };
  }
}
