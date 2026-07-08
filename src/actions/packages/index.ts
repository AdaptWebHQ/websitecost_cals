'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { packageSchema, type PackageFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Package } from '@/types';

/** Create a new package */
export async function createPackageAction(
  data: PackageFormData
): Promise<ApiResponse<Package>> {
  try {
    const validated = packageSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return {
        success: false,
        error: 'A package with this name already exists.',
      };
    }

    const now = new Date();
    const newPackage: Omit<Package, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.PACKAGES).add(newPackage);
    
    revalidatePath('/dashboard/admin/packages');
    
    return {
      success: true,
      data: {
        id: docRef.id,
        ...newPackage,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating package:', error);
    return {
      success: false,
      error: 'Failed to create package. Please try again.',
    };
  }
}

/** Update an existing package */
export async function updatePackageAction(
  id: string,
  data: PackageFormData
): Promise<ApiResponse<Package>> {
  try {
    const validated = packageSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug is unique and doesn't belong to another package
    const existingSnap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
      .where('slug', '==', slug)
      .get();

    const otherPackages = existingSnap.docs.filter((doc) => doc.id !== id);
    if (otherPackages.length > 0) {
      return {
        success: false,
        error: 'A package with this name already exists.',
      };
    }

    const packageRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
    const docSnap = await packageRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Package not found.',
      };
    }

    const now = new Date();
    const updatedFields = {
      ...validated.data,
      slug,
      updatedAt: now,
    };

    await packageRef.update(updatedFields);

    revalidatePath('/dashboard/admin/packages');

    const currentDoc = await packageRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as Package,
    };
  } catch (error: unknown) {
    console.error('Error updating package:', error);
    return {
      success: false,
      error: 'Failed to update package. Please try again.',
    };
  }
}

/** Delete a package */
export async function deletePackageAction(id: string): Promise<ApiResponse<void>> {
  try {
    const packageRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
    const docSnap = await packageRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Package not found.',
      };
    }

    await packageRef.delete();
    
    revalidatePath('/dashboard/admin/packages');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting package:', error);
    return {
      success: false,
      error: 'Failed to delete package.',
    };
  }
}

/** Toggle a package's active status */
export async function togglePackageActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const packageRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
    await packageRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/dashboard/admin/packages');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling package active state:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}

/** Reorder sorting list orders in a batch query */
export async function reorderPackagesAction(
  packageIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const batch = adminDb.batch();
    
    packageIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/dashboard/admin/packages');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error reordering packages:', error);
    return {
      success: false,
      error: 'Failed to reorder packages.',
    };
  }
}
