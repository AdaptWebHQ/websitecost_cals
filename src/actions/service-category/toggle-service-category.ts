'use server';

import { revalidatePath } from 'next/cache';

import { toggleServiceCategory } from '@/lib/service-category';

export async function toggleServiceCategoryAction(id: string) {
  try {
    const category = await toggleServiceCategory(id);

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