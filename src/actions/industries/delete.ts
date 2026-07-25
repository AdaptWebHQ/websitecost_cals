'use server';

import { deleteIndustry } from '@/lib/industries';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function deleteIndustryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await deleteIndustry(id);

    revalidatePath('/admin/industries');
    delCachePrefix('industries');

    return { success: true, message: 'Industry deleted successfully.' };
  } catch (error: unknown) {
    console.error('Error deleting industry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete industry.',
    };
  }
}
