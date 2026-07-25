'use server';

import { createAddonFeature, getAddonById } from '@/lib/addons';
import { addonFeatureSchema, type AddonFeatureFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, AddonFeature } from '@/types';

export async function createAddonFeatureAction(
  data: Omit<AddonFeatureFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<AddonFeature>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const payload = {
      serviceCategoryId: data.serviceCategoryId || 'sc-website',
      ...data,
    };

    const validated = addonFeatureSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createAddonFeature(validated.data);
    const createdFeat = await getAddonById(id);

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    if (!createdFeat) {
      return { success: false, error: 'Failed to retrieve addon feature after creation.' };
    }

    return {
      success: true,
      data: createdFeat,
      message: 'Feature created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating addon feature:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create feature.',
    };
  }
}
