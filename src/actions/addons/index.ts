'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { addonFeatureSchema, type AddonFeatureFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse, AddonFeature } from '@/types';

/** Create a new addon feature */
export async function createAddonFeatureAction(
  data: AddonFeatureFormData
): Promise<ApiResponse<AddonFeature>> {
  try {
    // TODO(PRODUCTION): Enable Rate Limiting for this API endpoint
    // TODO(PRODUCTION): Add Firestore Security Rules for this collection
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = addonFeatureSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness within the same category
    const existingSnap = await adminDb
      .collection(COLLECTIONS.ADDON_FEATURES)
      .where('categoryId', '==', validated.data.categoryId)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return {
        success: false,
        error: 'A feature with this name already exists in this category.',
      };
    }

    const now = new Date();
    const newFeature: Omit<AddonFeature, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.ADDON_FEATURES).add(newFeature);
    
    revalidatePath('/admin/addons');
    
    return {
      success: true,
      data: {
        id: docRef.id,
        ...newFeature,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating feature:', error);
    return {
      success: false,
      error: 'Failed to create feature.',
    };
  }
}

/** Update an existing addon feature */
export async function updateAddonFeatureAction(
  id: string,
  data: AddonFeatureFormData
): Promise<ApiResponse<AddonFeature>> {
  try {
    // TODO(PRODUCTION): Enable Rate Limiting for this API endpoint
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = addonFeatureSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.ADDON_FEATURES)
      .where('categoryId', '==', validated.data.categoryId)
      .where('slug', '==', slug)
      .get();

    const otherDocs = existingSnap.docs.filter((doc) => doc.id !== id);
    if (otherDocs.length > 0) {
      return {
        success: false,
        error: 'A feature with this name already exists in this category.',
      };
    }

    const featureRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
    const docSnap = await featureRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Feature not found.',
      };
    }

    const now = new Date();
    const updatedFields = {
      ...validated.data,
      slug,
      updatedAt: now,
    };

    await featureRef.update(updatedFields);

    revalidatePath('/admin/addons');

    const currentDoc = await featureRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as AddonFeature,
    };
  } catch (error: unknown) {
    console.error('Error updating feature:', error);
    return {
      success: false,
      error: 'Failed to update feature.',
    };
  }
}

/** Delete an addon feature */
export async function deleteAddonFeatureAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const featureRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
    const docSnap = await featureRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Feature not found.',
      };
    }

    await featureRef.delete();
    
    revalidatePath('/admin/addons');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting feature:', error);
    return {
      success: false,
      error: 'Failed to delete feature.',
    };
  }
}

/** Toggle addon feature active state */
export async function toggleAddonFeatureActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const featureRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
    await featureRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/admin/addons');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling feature status:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}

/** Reorder addon features within a category */
export async function reorderAddonFeaturesAction(
  featureIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const batch = adminDb.batch();
    
    featureIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/admin/addons');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error reordering features:', error);
    return {
      success: false,
      error: 'Failed to reorder features.',
    };
  }
}
