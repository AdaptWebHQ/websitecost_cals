'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

export interface CategoryDependencies {
  packages: number;
  serviceTypes: number;
  industries: number;
  featureCategories: number;
  features: number;
  addonCategories: number;
  addonFeatures: number;
  calculations: number;
  inquiries: number;
}

export async function getCategoryDependentCountsAction(
  categoryId: string
): Promise<ApiResponse<CategoryDependencies>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const [
      packagesSnap,
      serviceTypesSnap,
      industriesSnap,
      featureCategoriesSnap,
      featuresSnap,
      addonCategoriesSnap,
      addonFeaturesSnap,
      calculationsSnap,
    ] = await Promise.all([
      adminDb.collection(COLLECTIONS.PACKAGES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.SERVICE_TYPES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.INDUSTRIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.ADDON_FEATURES).where('serviceCategoryId', '==', categoryId).get(),
      adminDb.collection(COLLECTIONS.CALCULATIONS).where('serviceCategoryId', '==', categoryId).get(),
    ]);

    let inquiriesCount = 0;
    const calcIds = calculationsSnap.docs.map(doc => doc.id);
    if (calcIds.length > 0) {
      // Chunk calculation IDs since Firestore 'in' queries are capped at 30
      const chunkSize = 30;
      const chunks = [];
      for (let i = 0; i < calcIds.length; i += chunkSize) {
        chunks.push(calcIds.slice(i, i + chunkSize));
      }
      
      const inquirySnaps = await Promise.all(
        chunks.map(chunk => 
          adminDb.collection(COLLECTIONS.INQUIRIES).where('calculationId', 'in', chunk).get()
        )
      );
      
      inquirySnaps.forEach(snap => {
        inquiriesCount += snap.size;
      });
    }

    return {
      success: true,
      data: {
        packages: packagesSnap.size,
        serviceTypes: serviceTypesSnap.size,
        industries: industriesSnap.size,
        featureCategories: featureCategoriesSnap.size,
        features: featuresSnap.size,
        addonCategories: addonCategoriesSnap.size,
        addonFeatures: addonFeaturesSnap.size,
        calculations: calculationsSnap.size,
        inquiries: inquiriesCount,
      },
    };
  } catch (error: unknown) {
    console.error('Error fetching category dependencies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch category dependencies.',
    };
  }
}
