'use server';

import { createAddonCategory, getAddonCategoryById } from '@/lib/addons/categories';
import { addonCategorySchema, type AddonCategoryFormData } from '@/schemas';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import type { ApiResponse, AddonCategory } from '@/types';

export async function createAddonCategoryAction(
  data: Omit<AddonCategoryFormData, 'serviceCategoryId'> & { serviceCategoryId?: string }
): Promise<ApiResponse<AddonCategory>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const payload = {
      serviceCategoryId: data.serviceCategoryId || 'sc-website',
      ...data,
    };

    const validated = addonCategorySchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const id = await createAddonCategory(validated.data);
    const createdCat = await getAddonCategoryById(id);

    revalidatePath('/admin/addons');
    delCachePrefix('addons');
    delCachePrefix('addon_categories');

    if (!createdCat) {
      return { success: false, error: 'Failed to retrieve category after creation.' };
    }

    return {
      success: true,
      data: createdCat,
      message: 'Category created successfully.',
    };
  } catch (error: unknown) {
    console.error('Error creating addon category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category.',
    };
  }
}
