'use server';

import { updatePackageFeature, getPackageFeatureById } from '@/lib/packages/package-features-library';
import { packageFeatureSchema, type PackageFeatureFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, PackageFeature } from '@/types';

export async function updatePackageFeatureAction(
  id: string,
  data: Omit<PackageFeatureFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<PackageFeature>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const existing = await getPackageFeatureById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = packageFeatureSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updatePackageFeature(id, validated.data);
    const updatedFeat = await getPackageFeatureById(id);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    if (!updatedFeat) {
      return { success: false, error: 'Feature not found after update.' };
    }

    return {
      success: true,
      data: updatedFeat,
      message: 'Feature updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating package feature:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update feature.',
    };
  }
}
