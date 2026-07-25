'use server';

import { revalidatePath } from 'next/cache';

import { deleteServiceCategory } from '@/lib/service-category';

export async function deleteServiceCategoryAction(id: string) {
  try {
    await deleteServiceCategory(id);

    revalidatePath('/admin/service-categories');

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete service category.',
    };
  }
}