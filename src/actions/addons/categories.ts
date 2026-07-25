'use server';

import {
  createAddonCategoryAction as createCat,
  updateAddonCategoryAction as updateCat,
  deleteAddonCategoryAction as deleteCat,
  toggleAddonCategoryActiveAction as toggleCat,
  reorderAddonCategoriesAction as reorderCats,
  getAddonCategoryAction as getCat,
  getAddonCategoriesAction as getCats,
} from '../addon-categories';

export async function createAddonCategoryAction(data: any) {
  return createCat(data);
}

export async function updateAddonCategoryAction(id: string, data: any) {
  return updateCat(id, data);
}

export async function deleteAddonCategoryAction(id: string) {
  return deleteCat(id);
}

export async function toggleAddonCategoryActiveAction(id: string, isActive: boolean) {
  return toggleCat(id, isActive);
}

export async function reorderAddonCategoriesAction(categoryIds: string[]) {
  return reorderCats(categoryIds);
}

export async function getAddonCategoryAction(id: string) {
  return getCat(id);
}

export async function getAddonCategoriesAction(onlyActive = false) {
  // Scoped to default service category for compatibility
  return getCats('sc-website', onlyActive);
}
