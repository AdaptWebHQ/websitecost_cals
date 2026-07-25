'use server';

import {
  createAddonFeatureAction as createFeat,
  updateAddonFeatureAction as updateFeat,
  deleteAddonFeatureAction as deleteFeat,
  toggleAddonFeatureActiveAction as toggleFeat,
  reorderAddonFeaturesAction as reorderFeats,
  getAddonFeatureAction as getFeat,
  getAddonFeaturesAction as getFeats,
} from '../addon-features';

export async function createAddonFeatureAction(data: any) {
  return createFeat(data);
}

export async function updateAddonFeatureAction(id: string, data: any) {
  return updateFeat(id, data);
}

export async function deleteAddonFeatureAction(id: string) {
  return deleteFeat(id);
}

export async function toggleAddonFeatureActiveAction(id: string, isActive: boolean) {
  return toggleFeat(id, isActive);
}

export async function reorderAddonFeaturesAction(featureIds: string[]) {
  return reorderFeats(featureIds);
}

export async function getAddonFeatureAction(id: string) {
  return getFeat(id);
}

export async function getAddonFeaturesAction(onlyActive = false, categoryId?: string) {
  // Scoped to default service category for compatibility
  return getFeats('sc-website', onlyActive, categoryId);
}
