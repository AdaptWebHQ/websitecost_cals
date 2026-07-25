'use server';

import { updateAddonCategory, getAddonCategoryById } from '@/lib/addons/categories';
import { addonCategorySchema, type AddonCategoryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, AddonCategory } from '@/types';

export async function updateAddonCategoryAction(
  id: string,
  data: Omit<AddonCategoryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<AddonCategory>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const existing = await getAddonCategoryById(id);
    const serviceCategoryId = data.serviceCategoryId || existing?.serviceCategoryId || 'sc-website';

    const payload = {
      serviceCategoryId,
      ...data,
    };

    const validated = addonCategorySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    await updateAddonCategory(id, validated.data);
    const updatedCat = await getAddonCategoryById(id);

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    if (!updatedCat) {
      return { success: false, error: 'Category not found after update.' };
    }

    return {
      success: true,
      data: updatedCat,
      message: 'Category updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error updating addon category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category.',
    };
  }
}
