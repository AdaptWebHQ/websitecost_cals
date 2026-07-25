'use server';

import { revalidatePath } from 'next/cache';

import { updateServiceCategory } from '@/lib/service-category';
import {
  serviceCategorySchema,
  type ServiceCategoryFormData,
} from '@/schemas';

export async function updateServiceCategoryAction(
  id: string,
  values: ServiceCategoryFormData
) {
  const parsed = serviceCategorySchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data.',
    };
  }

  try {
    const category = await updateServiceCategory({
      id,
      ...parsed.data,
    });

    revalidatePath('/admin/service-categories');

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update service category.',
    };
  }
}