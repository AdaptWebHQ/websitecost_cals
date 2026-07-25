'use server';

import { updateAddonFeature, getAddonById } from '@/lib/addons';
import { addonFeatureSchema, type AddonFeatureFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, AddonFeature } from '@/types';

export async function updateAddonFeatureAction(
  id: string,
  data: Omit<AddonFeatureFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<AddonFeature>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const existing = await getAddonById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = addonFeatureSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updateAddonFeature(id, validated.data);
    const updatedFeat = await getAddonById(id);

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    if (!updatedFeat) {
      return { success: false, error: 'Feature not found after update.' };
    }

    return {
      success: true,
      data: updatedFeat,
      message: 'Feature updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating addon feature:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update feature.',
    };
  }
}
