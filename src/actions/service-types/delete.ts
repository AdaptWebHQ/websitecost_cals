'use server';

import { deleteServiceType } from '@/lib/service-types';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function deleteServiceTypeAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await deleteServiceType(id);

    revalidatePath('/admin/service-types');
    delCachePrefix('service_types');

    return {
      success: true,
      message: 'Service type deleted successfully.',
    };
  } catch (error: unknown) {
    console.error('Error deleting service type:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete service type.',
    };
  }
}
