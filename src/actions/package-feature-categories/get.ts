'use server';

import {
  getPackageFeatureCategoryById,
  getPackageFeatureCategoriesByServiceCategory,
} from '@/lib/packages/package-features-library';
import type { ApiResponse, PackageFeatureCategory } from '@/types';

/** Get a single category by ID */
export async function getPackageFeatureCategoryAction(id: string): Promise<ApiResponse<PackageFeatureCategory>> {
  try {
    const cat = await getPackageFeatureCategoryById(id);
    if (!cat) {
      return { success: false, error: 'Category not found.' };
    }
    return { success: true, data: cat };
  } catch (error: unknown) {
    console.error('Error fetching package feature category:', error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/** Get categories list under a service category */
export async function getPackageFeatureCategoriesAction(
  serviceCategoryId: string,
  onlyActive = false
): Promise<ApiResponse<PackageFeatureCategory[]>> {
  try {
    const list = await getPackageFeatureCategoriesByServiceCategory(serviceCategoryId, { onlyActive });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching package feature categories list:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}
