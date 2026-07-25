'use server';

import {
  getAddonCategoryById,
  getAddonCategoriesByServiceCategory,
} from '@/lib/addons/categories';
import type { ApiResponse, AddonCategory } from '@/types';

/** Get a single category by ID */
export async function getAddonCategoryAction(id: string): Promise<ApiResponse<AddonCategory>> {
  try {
    const cat = await getAddonCategoryById(id);
    if (!cat) {
      return { success: false, error: 'Category not found.' };
    }
    return { success: true, data: cat };
  } catch (error: unknown) {
    console.error('Error fetching addon category:', error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/** Get addon categories list under a service category */
export async function getAddonCategoriesAction(
  serviceCategoryId: string,
  onlyActive = false
): Promise<ApiResponse<AddonCategory[]>> {
  try {
    const list = await getAddonCategoriesByServiceCategory(serviceCategoryId, { onlyActive });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching addon categories list:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}
