'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { featureSchema, type FeatureFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Feature } from '@/types';

/** Create a new feature */
export async function createFeatureAction(
  data: FeatureFormData
): Promise<ApiResponse<Feature>> {
  try {
    const validated = featureSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness within the same category
    const existingSnap = await adminDb
      .collection(COLLECTIONS.FEATURES)
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
    const newFeature: Omit<Feature, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.FEATURES).add(newFeature);
    
    revalidatePath('/dashboard/admin/features');
    
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

/** Update an existing feature */
export async function updateFeatureAction(
  id: string,
  data: FeatureFormData
): Promise<ApiResponse<Feature>> {
  try {
    const validated = featureSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.FEATURES)
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

    const featureRef = adminDb.collection(COLLECTIONS.FEATURES).doc(id);
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

    revalidatePath('/dashboard/admin/features');

    const currentDoc = await featureRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as Feature,
    };
  } catch (error: unknown) {
    console.error('Error updating feature:', error);
    return {
      success: false,
      error: 'Failed to update feature.',
    };
  }
}

/** Delete a feature */
export async function deleteFeatureAction(id: string): Promise<ApiResponse<void>> {
  try {
    const featureRef = adminDb.collection(COLLECTIONS.FEATURES).doc(id);
    const docSnap = await featureRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Feature not found.',
      };
    }

    await featureRef.delete();
    
    revalidatePath('/dashboard/admin/features');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting feature:', error);
    return {
      success: false,
      error: 'Failed to delete feature.',
    };
  }
}

/** Toggle feature active state */
export async function toggleFeatureActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const featureRef = adminDb.collection(COLLECTIONS.FEATURES).doc(id);
    await featureRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/dashboard/admin/features');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling feature status:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}

/** Reorder features within a category */
export async function reorderFeaturesAction(
  featureIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const batch = adminDb.batch();
    
    featureIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.FEATURES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/dashboard/admin/features');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error reordering features:', error);
    return {
      success: false,
      error: 'Failed to reorder features.',
    };
  }
}
