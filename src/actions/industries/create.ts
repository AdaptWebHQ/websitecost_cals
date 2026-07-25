'use server';

import { createIndustry, getIndustryById } from '@/lib/industries';
import { industrySchema, type IndustryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, Industry } from '@/types';

export async function createIndustryAction(
  data: Omit<IndustryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<Industry>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const payload = {
      serviceCategoryId: data.serviceCategoryId || 'sc-website',
      ...data,
    };

    const validated = industrySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createIndustry(validated.data);
    const createdInd = await getIndustryById(id);

    revalidatePath('/admin/industries');
    delCachePrefix('industries');

    if (!createdInd) {
      return { success: false, error: 'Failed to retrieve industry after creation.' };
    }

    return {
      success: true,
      data: createdInd,
      message: 'Industry created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating industry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create industry. Please try again.',
    };
  }
}
