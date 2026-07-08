'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { featureCategorySchema, type FeatureCategoryFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, FeatureCategory } from '@/types';

/** Create a new feature category */
export async function createCategoryAction(
  data: FeatureCategoryFormData
): Promise<ApiResponse<FeatureCategory>> {
  try {
    const validated = featureCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.FEATURE_CATEGORIES)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return {
        success: false,
        error: 'A category with this name already exists.',
      };
    }

    const now = new Date();
    const newCategory: Omit<FeatureCategory, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).add(newCategory);
    
    revalidatePath('/dashboard/admin/feature-categories');
    
    return {
      success: true,
      data: {
        id: docRef.id,
        ...newCategory,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error: 'Failed to create category.',
    };
  }
}

/** Update an existing category */
export async function updateCategoryAction(
  id: string,
  data: FeatureCategoryFormData
): Promise<ApiResponse<FeatureCategory>> {
  try {
    const validated = featureCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.FEATURE_CATEGORIES)
      .where('slug', '==', slug)
      .get();

    const otherDocs = existingSnap.docs.filter((doc) => doc.id !== id);
    if (otherDocs.length > 0) {
      return {
        success: false,
        error: 'A category with this name already exists.',
      };
    }

    const categoryRef = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(id);
    const docSnap = await categoryRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Category not found.',
      };
    }

    const now = new Date();
    const updatedFields = {
      ...validated.data,
      slug,
      updatedAt: now,
    };

    await categoryRef.update(updatedFields);

    revalidatePath('/dashboard/admin/feature-categories');

    const currentDoc = await categoryRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as FeatureCategory,
    };
  } catch (error: unknown) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: 'Failed to update category.',
    };
  }
}

/** Delete a category */
export async function deleteCategoryAction(id: string): Promise<ApiResponse<void>> {
  try {
    // Check if there are any features under this category
    const featuresSnap = await adminDb
      .collection(COLLECTIONS.FEATURES)
      .where('categoryId', '==', id)
      .limit(1)
      .get();

    if (!featuresSnap.empty) {
      return {
        success: false,
        error: 'Cannot delete category containing active features. Please delete or re-assign features first.',
      };
    }

    const categoryRef = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(id);
    const docSnap = await categoryRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Category not found.',
      };
    }

    await categoryRef.delete();
    
    revalidatePath('/dashboard/admin/feature-categories');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: 'Failed to delete category.',
    };
  }
}

/** Toggle category active flag */
export async function toggleCategoryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const categoryRef = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(id);
    await categoryRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/dashboard/admin/feature-categories');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling category status:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}

/** Reorder feature categories */
export async function reorderCategoriesAction(
  categoryIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const batch = adminDb.batch();
    
    categoryIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/dashboard/admin/feature-categories');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error reordering categories:', error);
    return {
      success: false,
      error: 'Failed to reorder categories.',
    };
  }
}
