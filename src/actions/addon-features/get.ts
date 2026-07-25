'use server';

import {
  getAddonById,
  getAddonFeaturesByServiceCategory,
} from '@/lib/addons';
import type { ApiResponse, AddonFeature } from '@/types';

/** Get a single feature by ID */
export async function getAddonFeatureAction(id: string): Promise<ApiResponse<AddonFeature>> {
  try {
    const feat = await getAddonById(id);
    if (!feat) {
      return { success: false, error: 'Feature not found.' };
    }
    return { success: true, data: feat };
  } catch (error: unknown) {
    console.error('Error fetching addon feature:', error);
    return { success: false, error: 'Failed to fetch feature.' };
  }
}

/** Get addon features under a service category, optionally filtered by categoryId */
export async function getAddonFeaturesAction(
  serviceCategoryId: string,
  onlyActive = false,
  categoryId?: string
): Promise<ApiResponse<AddonFeature[]>> {
  try {
    const list = await getAddonFeaturesByServiceCategory(serviceCategoryId, {
      onlyActive,
      categoryId,
    });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching addon features list:', error);
    return { success: false, error: 'Failed to fetch features.' };
  }
}
