'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

interface ExportDataFormat {
  version: string;
  category: any;
  serviceTypes: any[];
  industries: any[];
  packages: any[];
  featureCategories: any[];
  features: any[];
  addonCategories: any[];
  addonFeatures: any[];
}

export async function exportServiceCategoryAction(
  categoryId: string
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized.' };
    }

    const categoryDoc = await adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES).doc(categoryId).get();
    if (!categoryDoc.exists) {
      return { success: false, error: 'Category not found.' };
    }

    const [
      serviceTypesSnap,
      industriesSnap,
      packagesSnap,
      featureCategoriesSnap,
      featuresSnap,
      addonCategoriesSnap,
      addonFeaturesSnap,
    ] = await Promise.all([
      adminDb.collection(COLLECTIONS.SERVICE_TYPES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.INDUSTRIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.PACKAGES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.ADDON_FEATURES).where('serviceCategoryId', '==', categoryId).get(),
    ]);

    const exportPayload: ExportDataFormat = {
      version: '1.0.0',
      category: categoryDoc.data(),
      serviceTypes: serviceTypesSnap.docs.map(d => d.data()),
      industries: industriesSnap.docs.map(d => d.data()),
      packages: packagesSnap.docs.map(d => d.data()),
      featureCategories: featureCategoriesSnap.docs.map(d => d.data()),
      features: featuresSnap.docs.map(d => d.data()),
      addonCategories: addonCategoriesSnap.docs.map(d => d.data()),
      addonFeatures: addonFeaturesSnap.docs.map(d => d.data()),
    };

    return {
      success: true,
      data: JSON.stringify(exportPayload, null, 2),
      message: 'Export generated successfully.',
    };
  } catch (error: unknown) {
    console.error('Error exporting category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export service category.',
    };
  }
}

export async function importServiceCategoryAction(
  jsonString: string
): Promise<ApiResponse<{
  message: string;
  summary: string;
}>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized.' };
    }

    const payload: ExportDataFormat = JSON.parse(jsonString);
    if (!payload.category || !payload.category.slug || !payload.category.name) {
      return { success: false, error: 'Invalid file format. Missing category metadata.' };
    }

    // Check duplicate category slug
    const slugSnap = await adminDb
      .collection(COLLECTIONS.SERVICE_CATEGORIES)
      .where('slug', '==', payload.category.slug)
      .limit(1)
      .get();
    if (!slugSnap.empty) {
      return { success: false, error: `Import failed: A Service Category with slug "${payload.category.slug}" already exists.` };
    }

    const newCategoryRef = adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES).doc();
    const newCategoryId = newCategoryRef.id;

    // Relational mapping structures
    const idMap: Record<string, string> = {}; // oldId -> newId

    const mapNewIds = (items: any[], pathName: string) => {
      (items || []).forEach(item => {
        if (item.id) {
          idMap[item.id] = adminDb.collection(pathName).doc().id;
        }
      });
    };

    mapNewIds(payload.serviceTypes, COLLECTIONS.SERVICE_TYPES);
    mapNewIds(payload.industries, COLLECTIONS.INDUSTRIES);
    mapNewIds(payload.packages, COLLECTIONS.PACKAGES);
    mapNewIds(payload.featureCategories, COLLECTIONS.PACKAGE_FEATURE_CATEGORIES);
    mapNewIds(payload.features, COLLECTIONS.PACKAGE_FEATURES);
    mapNewIds(payload.addonCategories, COLLECTIONS.ADDON_CATEGORIES);
    mapNewIds(payload.addonFeatures, COLLECTIONS.ADDON_FEATURES);

    const now = new Date();
    const batch = adminDb.batch();

    // 1. Create Category
    batch.set(newCategoryRef, {
      ...payload.category,
      id: newCategoryId,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Service Types
    (payload.serviceTypes || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 3. Feature Categories
    (payload.featureCategories || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 4. Features
    (payload.features || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        categoryId: idMap[item.categoryId] || item.categoryId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 5. Addon Categories
    (payload.addonCategories || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 6. Addon Features
    (payload.addonFeatures || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        categoryId: idMap[item.categoryId] || item.categoryId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 7. Packages
    (payload.packages || []).forEach(item => {
      const newId = idMap[item.id];
      const oldFeatureIds = item.includedFeatureIds || [];
      const newFeatureIds = oldFeatureIds.map((fid: string) => idMap[fid] || fid);
      batch.set(adminDb.collection(COLLECTIONS.PACKAGES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        includedFeatureIds: newFeatureIds,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 8. Industries
    (payload.industries || []).forEach(item => {
      const newId = idMap[item.id];
      batch.set(adminDb.collection(COLLECTIONS.INDUSTRIES).doc(newId), {
        ...item,
        id: newId,
        serviceCategoryId: newCategoryId,
        recommendedPackageId: idMap[item.recommendedPackageId] || item.recommendedPackageId,
        createdAt: now,
        updatedAt: now,
      });
    });

    // Commit transaction batch
    await batch.commit();

    const summaryStr = `Imported Successfully:\n1 Service Category\n${payload.serviceTypes?.length || 0} Service Types\n${payload.industries?.length || 0} Industries\n${payload.packages?.length || 0} Packages\n${payload.featureCategories?.length || 0} Feature Categories\n${payload.features?.length || 0} Features\n${payload.addonCategories?.length || 0} Add-on Categories\n${payload.addonFeatures?.length || 0} Add-ons`;

    return {
      success: true,
      data: {
        message: 'Ecosystem imported successfully.',
        summary: summaryStr,
      },
    };
  } catch (error: unknown) {
    console.error('Error importing category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Import failed.',
    };
  }
}
