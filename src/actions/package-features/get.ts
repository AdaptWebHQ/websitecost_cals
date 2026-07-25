'use server';

import {
  getPackageFeatureById,
  getPackageFeaturesByServiceCategory,
} from '@/lib/packages/package-features-library';
import type { ApiResponse, PackageFeature } from '@/types';

/** Get a single feature by ID */
export async function getPackageFeatureAction(id: string): Promise<ApiResponse<PackageFeature>> {
  try {
    const feat = await getPackageFeatureById(id);
    if (!feat) {
      return { success: false, error: 'Feature not found.' };
    }
    return { success: true, data: feat };
  } catch (error: unknown) {
    console.error('Error fetching package feature:', error);
    return { success: false, error: 'Failed to fetch feature.' };
  }
}

/** Get package features under a service category, optionally filtered by categoryId or packageId */
export async function getPackageFeaturesAction(
  serviceCategoryId: string,
  onlyActive = false,
  categoryId?: string,
  packageId?: string
): Promise<ApiResponse<PackageFeature[]>> {
  try {
    const list = await getPackageFeaturesByServiceCategory(serviceCategoryId, {
      onlyActive,
      categoryId,
      packageId,
    });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching package features list:', error);
    return { success: false, error: 'Failed to fetch features.' };
  }
}
