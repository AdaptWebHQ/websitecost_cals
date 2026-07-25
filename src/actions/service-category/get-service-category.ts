'use server';

import {
  getServiceCategoryById,
  getServiceCategoryBySlug,
} from '@/lib/service-category';

export async function getServiceCategoryByIdAction(id: string) {
  try {
    const data = await getServiceCategoryById(id);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch service category.',
    };
  }
}

export async function getServiceCategoryBySlugAction(slug: string) {
  try {
    const data = await getServiceCategoryBySlug(slug);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch service category.',
    };
  }
}