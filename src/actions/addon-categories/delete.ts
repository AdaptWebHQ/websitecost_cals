'use server';

import { deleteAddonCategory } from '@/lib/addons/categories';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function deleteAddonCategoryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await deleteAddonCategory(id);

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    return { success: true, message: 'Category deleted successfully.' };
  } catch (error: unknown) {
    console.error('Error deleting addon category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category.',
    };
  }
}
