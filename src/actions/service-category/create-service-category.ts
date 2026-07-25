'use server';

import { revalidatePath } from 'next/cache';

import { createServiceCategory } from '@/lib/service-category';
import {
  serviceCategorySchema,
  type ServiceCategoryFormData,
} from '@/schemas';

export async function createServiceCategoryAction(
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
    const category = await createServiceCategory(parsed.data);

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
          : 'Failed to create service category.',
    };
  }
}