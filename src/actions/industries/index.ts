'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { industrySchema, type IndustryFormData } from '@/schemas';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse, Industry } from '@/types';

/** Create a new industry */
export async function createIndustryAction(
  data: IndustryFormData
): Promise<ApiResponse<Industry>> {
  try {
    // TODO(PRODUCTION): Enable Rate Limiting for this API endpoint
    // TODO(PRODUCTION): Add Firestore Security Rules for this collection
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = industrySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.INDUSTRIES)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return {
        success: false,
        error: 'An industry with this name already exists.',
      };
    }

    const now = new Date();
    const newIndustry: Omit<Industry, 'id'> = {
      ...validated.data,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.INDUSTRIES).add(newIndustry);
    
    revalidatePath('/admin/industries');
    
    return {
      success: true,
      data: {
        id: docRef.id,
        ...newIndustry,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating industry:', error);
    return {
      success: false,
      error: 'Failed to create industry.',
    };
  }
}

/** Update an existing industry */
export async function updateIndustryAction(
  id: string,
  data: IndustryFormData
): Promise<ApiResponse<Industry>> {
  try {
    // TODO(PRODUCTION): Enable Rate Limiting for this API endpoint
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = industrySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const slug = slugify(validated.data.name);

    // Verify slug uniqueness
    const existingSnap = await adminDb
      .collection(COLLECTIONS.INDUSTRIES)
      .where('slug', '==', slug)
      .get();

    const otherDocs = existingSnap.docs.filter((doc) => doc.id !== id);
    if (otherDocs.length > 0) {
      return {
        success: false,
        error: 'An industry with this name already exists.',
      };
    }

    const industryRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
    const docSnap = await industryRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Industry not found.',
      };
    }

    const now = new Date();
    const updatedFields = {
      ...validated.data,
      slug,
      updatedAt: now,
    };

    await industryRef.update(updatedFields);

    revalidatePath('/admin/industries');

    const currentDoc = await industryRef.get();
    const currentData = currentDoc.data();

    return {
      success: true,
      data: {
        id,
        ...currentData,
        createdAt: currentData?.createdAt?.toDate(),
        updatedAt: currentData?.updatedAt?.toDate(),
      } as Industry,
    };
  } catch (error: unknown) {
    console.error('Error updating industry:', error);
    return {
      success: false,
      error: 'Failed to update industry.',
    };
  }
}

/** Delete an industry */
export async function deleteIndustryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const industryRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
    const docSnap = await industryRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Industry not found.',
      };
    }

    await industryRef.delete();
    
    revalidatePath('/admin/industries');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting industry:', error);
    return {
      success: false,
      error: 'Failed to delete industry.',
    };
  }
}

/** Toggle industry active state */
export async function toggleIndustryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const industryRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
    await industryRef.update({
      isActive,
      updatedAt: new Date(),
    });
    
    revalidatePath('/admin/industries');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error toggling industry status:', error);
    return {
      success: false,
      error: 'Failed to update status.',
    };
  }
}
