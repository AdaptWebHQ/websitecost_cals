'use server';

import { createPackageFeatureCategory } from '@/lib/packages/package-features-library';
import { packageFeatureCategorySchema, type PackageFeatureCategoryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function createPackageFeatureCategoryAction(
  data: Omit<PackageFeatureCategoryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const payload = {
      serviceCategoryId: data.serviceCategoryId || 'sc-website',
      ...data,
    };

    const validated = packageFeatureCategorySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createPackageFeatureCategory(validated.data);

    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');

    return {
      success: true,
      data: id,
      message: 'Category created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating package feature category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category.',
    };
  }
}
