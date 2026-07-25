'use server';

import {
  getIndustryById,
  getIndustriesByServiceCategory,
} from '@/lib/industries';
import type { ApiResponse, Industry } from '@/types';

/** Get a single industry by ID */
export async function getIndustryAction(id: string): Promise<ApiResponse<Industry>> {
  try {
    const industry = await getIndustryById(id);
    if (!industry) {
      return { success: false, error: 'Industry not found.' };
    }
    return { success: true, data: industry };
  } catch (error: unknown) {
    console.error('Error fetching industry:', error);
    return { success: false, error: 'Failed to fetch industry.' };
  }
}

/** Get industries list under a service category */
export async function getIndustriesAction(
  serviceCategoryId: string,
  onlyActive = false
): Promise<ApiResponse<Industry[]>> {
  try {
    const list = await getIndustriesByServiceCategory(serviceCategoryId, { onlyActive });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching industries list:', error);
    return { success: false, error: 'Failed to fetch industries.' };
  }
}

/** Get active industries list under a service category */
export async function getActiveIndustriesAction(
  serviceCategoryId: string
): Promise<ApiResponse<Industry[]>> {
  return getIndustriesAction(serviceCategoryId, true);
}
