'use server';

import { updatePackage, getPackageById } from '@/lib/packages';
import { packageSchema, type PackageFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, Package } from '@/types';

export async function updatePackageAction(
  id: string,
  data: Omit<PackageFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<Package>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const existing = await getPackageById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = packageSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updatePackage(id, validated.data);
    const updatedPkg = await getPackageById(id);

    revalidatePath('/admin/packages');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    if (!updatedPkg) {
      return { success: false, error: 'Package not found after update.' };
    }

    return {
      success: true,
      data: updatedPkg,
      message: 'Package updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating package:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update package. Please try again.',
    };
  }
}
