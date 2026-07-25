'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import { slugify } from '@/lib/utils';
import type { ApiResponse, ServiceCategory } from '@/types';

interface TargetCategoryInput {
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
}

export async function cloneServiceCategoryAction(
  sourceId: string,
  target: TargetCategoryInput
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    // 1. Verify target slug is not duplicate
    const slugSnap = await adminDb
      .collection(COLLECTIONS.SERVICE_CATEGORIES)
      .where('slug', '==', target.slug)
      .limit(1)
      .get();
    if (!slugSnap.empty) {
      return { success: false, error: 'A service category with this slug already exists.' };
    }

    // 2. Create target Service Category
    const newCategoryRef = adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES).doc();
    const newCategoryId = newCategoryRef.id;

    // Load source data
    const [
      serviceTypesSnap,
      industriesSnap,
      packagesSnap,
      featureCategoriesSnap,
      featuresSnap,
      addonCategoriesSnap,
      addonFeaturesSnap,
    ] = await Promise.all([
      adminDb.collection(COLLECTIONS.SERVICE_TYPES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.INDUSTRIES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.PACKAGES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).where('serviceCategoryId', '==', sourceId).get(),
      adminDb.collection(COLLECTIONS.ADDON_FEATURES).where('serviceCategoryId', '==', sourceId).get(),
    ]);

    // Relational mapping structures
    const idMap: Record<string, string> = {}; // oldId -> newId

    // Map new IDs for mapping updates
    const generateNewIds = (snap: FirebaseFirestore.QuerySnapshot, collectionName: string) => {
      snap.docs.forEach(doc => {
        idMap[doc.id] = adminDb.collection(collectionName).doc().id;
      });
    };

    generateNewIds(serviceTypesSnap, COLLECTIONS.SERVICE_TYPES);
    generateNewIds(industriesSnap, COLLECTIONS.INDUSTRIES);
    generateNewIds(packagesSnap, COLLECTIONS.PACKAGES);
    generateNewIds(featureCategoriesSnap, COLLECTIONS.PACKAGE_FEATURE_CATEGORIES);
    generateNewIds(featuresSnap, COLLECTIONS.PACKAGE_FEATURES);
    generateNewIds(addonCategoriesSnap, COLLECTIONS.ADDON_CATEGORIES);
    generateNewIds(addonFeaturesSnap, COLLECTIONS.ADDON_FEATURES);

    // Initialize Firestore Batch Writes
    const batch = adminDb.batch();

    // Write new Service Category document
    const now = new Date();
    batch.set(newCategoryRef, {
      id: newCategoryId,
      ...target,
      createdAt: now,
      updatedAt: now,
    });

    // Helper: copy collections with mapping updates
    const cloneCollection = (
      snap: FirebaseFirestore.QuerySnapshot,
      collectionName: string,
      transform: (data: any) => any
    ) => {
      snap.docs.forEach(doc => {
        const newId = idMap[doc.id];
        const data = doc.data();
        const cleanedData = {
          ...data,
          id: newId,
          serviceCategoryId: newCategoryId,
          createdAt: now,
          updatedAt: now,
        };
        batch.set(adminDb.collection(collectionName).doc(newId), transform(cleanedData));
      });
    };

    // 1. Service Types
    cloneCollection(serviceTypesSnap, COLLECTIONS.SERVICE_TYPES, (d) => ({
      ...d,
      slug: `${d.slug}-clone`,
    }));

    // 2. Feature Categories
    cloneCollection(featureCategoriesSnap, COLLECTIONS.PACKAGE_FEATURE_CATEGORIES, (d) => d);

    // 3. Features (needs categoryId mapping)
    cloneCollection(featuresSnap, COLLECTIONS.PACKAGE_FEATURES, (d) => ({
      ...d,
      categoryId: idMap[d.categoryId] || d.categoryId,
    }));

    // 4. Addon Categories
    cloneCollection(addonCategoriesSnap, COLLECTIONS.ADDON_CATEGORIES, (d) => ({
      ...d,
      slug: `${d.slug}-clone`,
    }));

    // 5. Addon Features (needs categoryId mapping)
    cloneCollection(addonFeaturesSnap, COLLECTIONS.ADDON_FEATURES, (d) => ({
      ...d,
      categoryId: idMap[d.categoryId] || d.categoryId,
      slug: `${d.slug}-clone`,
    }));

    // 6. Packages (needs includedFeatureIds mapping)
    cloneCollection(packagesSnap, COLLECTIONS.PACKAGES, (d) => {
      const oldFeatureIds = d.includedFeatureIds || [];
      const newFeatureIds = oldFeatureIds.map((fid: string) => idMap[fid] || fid);
      return {
        ...d,
        slug: `${d.slug}-clone`,
        includedFeatureIds: newFeatureIds,
      };
    });

    // 7. Industries (needs recommendedPackageId mapping)
    cloneCollection(industriesSnap, COLLECTIONS.INDUSTRIES, (d) => ({
      ...d,
      slug: `${d.slug}-clone`,
      recommendedPackageId: idMap[d.recommendedPackageId] || d.recommendedPackageId,
    }));

    // Commit batch
    await batch.commit();

    return {
      success: true,
      data: newCategoryId,
      message: 'Service category cloned successfully.',
    };
  } catch (error: unknown) {
    console.error('Error cloning category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clone service category.',
    };
  }
}
