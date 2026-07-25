'use server';

import { createPackage, getPackageById } from '@/lib/packages';
import { packageSchema, type PackageFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, Package } from '@/types';

export async function createPackageAction(
  data: Omit<PackageFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<Package>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const payload = {
      serviceCategoryId: data.serviceCategoryId || 'sc-website',
      ...data,
    };

    const validated = packageSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createPackage(validated.data);
    const createdPkg = await getPackageById(id);

    revalidatePath('/admin/packages');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    if (!createdPkg) {
      return { success: false, error: 'Failed to retrieve package after creation.' };
    }

    return {
      success: true,
      data: createdPkg,
      message: 'Package created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating package:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create package. Please try again.',
    };
  }
}
