'use server';

import { updateIndustry, getIndustryById } from '@/lib/industries';
import { industrySchema, type IndustryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, Industry } from '@/types';

export async function updateIndustryAction(
  id: string,
  data: Omit<IndustryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<Industry>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    // Retrieve current industry to keep its serviceCategoryId if not provided
    const existing = await getIndustryById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = industrySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updateIndustry(id, validated.data);
    const updatedInd = await getIndustryById(id);

    revalidatePath('/admin/industries');
    delCachePrefix('industries');

    if (!updatedInd) {
      return { success: false, error: 'Industry not found after update.' };
    }

    return {
      success: true,
      data: updatedInd,
      message: 'Industry updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating industry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update industry. Please try again.',
    };
  }
}
