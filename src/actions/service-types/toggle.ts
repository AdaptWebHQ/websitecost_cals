'use server';

import { updateServiceType } from '@/lib/service-types';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function toggleServiceTypeStatusAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updateServiceType(id, { isActive });

    revalidatePath('/admin/service-types');
    delCachePrefix('service_types');

    return {
      success: true,
      message: 'Status updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error toggling service type status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}
