'use server';

import { createServiceType } from '@/lib/service-types';
import { serviceTypeSchema, type ServiceTypeFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse } from '@/types';

export async function createServiceTypeAction(
  data: ServiceTypeFormData
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = serviceTypeSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createServiceType(validated.data);

    revalidatePath('/admin/service-types');
    delCachePrefix('service_types');

    return {
      success: true,
      data: id,
      message: 'Service type created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating service type:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create service type. Please try again.',
    };
  }
}
