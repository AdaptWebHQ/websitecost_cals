'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { priceConfigSchema, type PriceConfigFormData } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse, PriceConfig } from '@/types';

/** Update the global price configuration settings */
export async function updatePriceConfigAction(
  data: PriceConfigFormData
): Promise<ApiResponse<PriceConfig>> {
  try {
    // TODO(PRODUCTION): Enable Rate Limiting for this API endpoint
    // TODO(PRODUCTION): Add Firestore Security Rules for this collection
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const validated = priceConfigSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const docRef = adminDb.collection(COLLECTIONS.PRICE_CONFIG).doc('global');
    const now = new Date();
    
    const updatedFields = {
      ...validated.data,
      updatedAt: now,
    };

    await docRef.set(updatedFields, { merge: true });

    revalidatePath('/admin/price-config');

    return {
      success: true,
      data: {
        id: 'global',
        ...updatedFields,
      } as PriceConfig,
    };
  } catch (error: unknown) {
    console.error('Error updating pricing config:', error);
    return {
      success: false,
      error: 'Failed to update pricing settings.',
    };
  }
}
