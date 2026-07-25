'use server';

import {
  getServiceTypeById,
  getServiceTypesByServiceCategory,
} from '@/lib/service-types';
import type { ApiResponse, ServiceType } from '@/types';

/** Get a single service type by ID */
export async function getServiceTypeAction(id: string): Promise<ApiResponse<ServiceType>> {
  try {
    const serviceType = await getServiceTypeById(id);
    if (!serviceType) {
      return { success: false, error: 'Service type not found.' };
    }
    return { success: true, data: serviceType };
  } catch (error: unknown) {
    console.error('Error fetching service type:', error);
    return { success: false, error: 'Failed to fetch service type.' };
  }
}

/** Get service types under a service category */
export async function getServiceTypesAction(
  serviceCategoryId: string,
  onlyActive = false
): Promise<ApiResponse<ServiceType[]>> {
  try {
    const list = await getServiceTypesByServiceCategory(serviceCategoryId, { onlyActive });
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching service types list:', error);
    return { success: false, error: 'Failed to fetch service types.' };
  }
}

/** Get active service types under a service category */
export async function getActiveServiceTypesAction(
  serviceCategoryId: string
): Promise<ApiResponse<ServiceType[]>> {
  return getServiceTypesAction(serviceCategoryId, true);
}
