import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { delCachePrefix } from '@/lib/server-cache';

/**
 * Delete a service category.
 *
 * NOTE:
 * Before deleting, make sure no Industries, Packages or Add-ons
 * reference this service category.
 */
export async function deleteServiceCategory(id: string): Promise<void> {
  const docRef = adminDb
    .collection(COLLECTIONS.SERVICE_CATEGORIES)
    .doc(id);

  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error('Service category not found.');
  }

  // Prevent deletion if this category is referenced by other entities
  const [packagesSnap, industriesSnap, addonCategoriesSnap, serviceTypesSnap, featureCategoriesSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.PACKAGES).where('serviceCategoryId', '==', id).limit(1).get(),
    adminDb.collection(COLLECTIONS.INDUSTRIES).where('serviceCategoryId', '==', id).limit(1).get(),
    adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).where('serviceCategoryId', '==', id).limit(1).get(),
    adminDb.collection(COLLECTIONS.SERVICE_TYPES).where('serviceCategoryId', '==', id).limit(1).get(),
    adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).where('serviceCategoryId', '==', id).limit(1).get(),
  ]);

  if (!packagesSnap.empty) {
    throw new Error('Cannot delete service category because it is in use by packages.');
  }
  if (!industriesSnap.empty) {
    throw new Error('Cannot delete service category because it is in use by industries.');
  }
  if (!addonCategoriesSnap.empty) {
    throw new Error('Cannot delete service category because it is in use by addon categories.');
  }
  if (!serviceTypesSnap.empty) {
    throw new Error('Cannot delete service category because it is in use by service types.');
  }
  if (!featureCategoriesSnap.empty) {
    throw new Error('Cannot delete service category because it is in use by package feature categories.');
  }

  await docRef.delete();

  delCachePrefix('service-categories');
}