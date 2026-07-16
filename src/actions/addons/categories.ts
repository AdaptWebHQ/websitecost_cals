'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { addonCategorySchema, type AddonCategoryFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, AddonCategory } from '@/types';

/** Create a new addon category */
export async function createAddonCategoryAction(
  data: AddonCategoryFormData
): Promise<ApiResponse<AddonCategory>> {
  try {
    const validated = addonCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.ADDON_CATEGORIES)
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
    const newCategory: Omit<AddonCategory, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).add(newCategory);
    
    revalidatePath('/admin/addons');
    
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

/** Update an existing addon category */
export async function updateAddonCategoryAction(
  id: string,
  data: AddonCategoryFormData
): Promise<ApiResponse<AddonCategory>> {
  try {
    const validated = addonCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.ADDON_CATEGORIES)
      .where('slug', '==', slug)
      .get();

    const otherDocs = existingSnap.docs.filter((doc) => doc.id !== id);
    if (otherDocs.length > 0) {
      return {
        success: false,
        error: 'A category with this name already exists.',
      };
    }

    const categoryRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
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

    revalidatePath('/admin/addons');

    const currentDoc = await categoryRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as AddonCategory,
    };
  } catch (error: unknown) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: 'Failed to update category.',
    };
  }
}

/** Delete an addon category */
export async function deleteAddonCategoryAction(id: string): Promise<ApiResponse<void>> {
  try {
    // Check if there are any features under this category
    const featuresSnap = await adminDb
      .collection(COLLECTIONS.ADDON_FEATURES)
      .where('categoryId', '==', id)
      .limit(1)
      .get();

    if (!featuresSnap.empty) {
      return {
        success: false,
        error: 'Cannot delete category containing active addon features. Please delete or re-assign addon features first.',
      };
    }

    const categoryRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
    const docSnap = await categoryRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Category not found.',
      };
    }

    await categoryRef.delete();
    
    revalidatePath('/admin/addons');
    
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
export async function toggleAddonCategoryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const categoryRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
    await categoryRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/admin/addons');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling category status:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}

/** Reorder addon categories */
export async function reorderAddonCategoriesAction(
  categoryIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const batch = adminDb.batch();
    
    categoryIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/admin/addons');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error reordering categories:', error);
    return {
      success: false,
      error: 'Failed to reorder categories.',
    };
  }
}
