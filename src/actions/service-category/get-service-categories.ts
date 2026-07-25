'use server';

import { getServiceCategories } from '@/lib/service-category';

export async function getServiceCategoriesAction(
  onlyActive = false
) {
  try {
    const data = await getServiceCategories(onlyActive);

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
          : 'Failed to fetch service categories.',
    };
  }
}