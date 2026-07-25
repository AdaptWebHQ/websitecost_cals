'use server';

import { updateAddonCategory } from '@/lib/addons/categories';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ApiResponse } from '@/types';

export async function toggleAddonCategoryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updateAddonCategory(id, { isActive });

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    return { success: true, message: 'Category status updated successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling category status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

export async function reorderAddonCategoriesAction(
  categoryIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const batch = adminDb.batch();
    categoryIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    return { success: true, message: 'Categories reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering categories:', error);
    return {
      success: false,
      error: 'Failed to reorder categories.',
    };
  }
}
