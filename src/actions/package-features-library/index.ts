'use server';

import {
  getPackageFeatureCategoriesAction as getCats,
  createPackageFeatureCategoryAction as createCat,
  updatePackageFeatureCategoryAction as updateCat,
  deletePackageFeatureCategoryAction as deleteCat,
  reorderPackageFeatureCategoriesAction as reorderCats,
} from '../package-feature-categories';

import {
  getPackageFeaturesAction as getFeats,
  createPackageFeatureAction as createFeat,
  updatePackageFeatureAction as updateFeat,
  deletePackageFeatureAction as deleteFeat,
  reorderPackageFeaturesAction as reorderFeats,
} from '../package-features';

export async function getPackageFeatureCategoriesAction(onlyActive = false) {
  // Note: Old UI has no serviceCategoryId parameter. We can find a default or query all.
  // The new getPackageFeatureCategoriesAction expects serviceCategoryId. 
  // For backwards compatibility, if not provided, we can fetch categories from the default service category.
  // Let's pass a default or assume it's 'sc-website'.
  return getCats('sc-website', onlyActive);
}

export async function createPackageFeatureCategoryAction(data: any) {
  return createCat(data);
}

export async function updatePackageFeatureCategoryAction(id: string, data: any) {
  return updateCat(id, data);
}

export async function deletePackageFeatureCategoryAction(id: string) {
  return deleteCat(id);
}

export async function reorderPackageFeatureCategoriesAction(orderedIds: string[]) {
  return reorderCats(orderedIds);
}

export async function getPackageFeaturesAction(categoryId?: string, onlyActive = false) {
  return getFeats('sc-website', onlyActive, categoryId);
}

export async function createPackageFeatureAction(data: any) {
  return createFeat(data);
}

export async function updatePackageFeatureAction(id: string, data: any) {
  return updateFeat(id, data);
}

export async function deletePackageFeatureAction(id: string) {
  return deleteFeat(id);
}

export async function reorderPackageFeaturesAction(orderedIds: string[]) {
  return reorderFeats(orderedIds);
}
