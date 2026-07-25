'use server';

import { deletePackage } from '@/lib/packages';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function deletePackageAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await deletePackage(id);

    revalidatePath('/admin/packages');
    delCachePrefix('packages');
    delCachePrefix('pkg_');

    return { success: true, message: 'Package deleted successfully.' };
  } catch (error: unknown) {
    console.error('Error deleting package:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete package.',
    };
  }
}
