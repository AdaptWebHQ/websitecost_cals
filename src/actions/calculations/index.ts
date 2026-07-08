'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { calculatorSubmissionSchema, type CalculatorSubmissionData } from '@/schemas';
import { getPackageById } from '@/lib/packages';
import { getIndustryById } from '@/lib/industries';
import { getPriceConfig } from '@/lib/price-config';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Calculation, Feature } from '@/types';

/** Recalculate quotation quote values server-side and save to Firestore calculations collection */
export async function createCalculationAction(
  data: CalculatorSubmissionData
): Promise<ApiResponse<Calculation>> {
  try {
    const validated = calculatorSubmissionSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const {
      packageId,
      selectedFeatureIds,
      pages,
      rushDelivery,
      industryId,
      websiteType,
      businessName,
      businessEmail,
      businessPhone,
    } = validated.data;

    // Fetch related records in parallel on the server
    const [selectedPackage, industry, priceConfig, user] = await Promise.all([
      getPackageById(packageId),
      getIndustryById(industryId),
      getPriceConfig(),
      getServerUser(),
    ]);

    if (!selectedPackage) {
      return {
        success: false,
        error: 'Selected package was not found.',
      };
    }

    if (!industry) {
      return {
        success: false,
        error: 'Selected industry sector was not found.',
      };
    }

    // Fetch selected features from database
    let selectedFeatures: Feature[] = [];
    if (selectedFeatureIds.length > 0) {
      const featuresSnap = await adminDb
        .collection(COLLECTIONS.FEATURES)
        .where('__name__', 'in', selectedFeatureIds)
        .get();
        
      selectedFeatures = featuresSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Feature[];
    }

    // Run server-side pricing engine recalculation
    const quotation = calculateQuotation(
      selectedPackage,
      selectedFeatures,
      pages,
      rushDelivery,
      priceConfig
    );

    const now = new Date();
    
    // Save generated calculation record in database
    const newCalculation: Omit<Calculation, 'id'> = {
      userId: user?.id || null, // null if anonymous run before login
      businessName,
      businessEmail,
      businessPhone,
      industryId,
      industryName: industry.name,
      websiteType,
      packageId,
      packageName: selectedPackage.name,
      pages,
      selectedFeatures: quotation.selectedFeatures,
      isRushDelivery: rushDelivery,
      basePrice: quotation.basePrice,
      featuresPrice: quotation.featuresPrice,
      rushMarkup: quotation.rushMarkup,
      subtotal: quotation.subtotal,
      netTotal: quotation.netTotal,
      gstAmount: quotation.gstAmount,
      total: quotation.total,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection(COLLECTIONS.CALCULATIONS).add(newCalculation);

    revalidatePath('/dashboard/admin/calculations');
    if (user) {
      revalidatePath('/dashboard/public/estimates');
    }

    return {
      success: true,
      data: {
        id: docRef.id,
        ...newCalculation,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating quote calculation:', error);
    return {
      success: false,
      error: 'Failed to generate quotation estimate. Please try again.',
    };
  }
}

/** Delete a calculation */
export async function deleteCalculationAction(id: string): Promise<ApiResponse<void>> {
  try {
    const calcRef = adminDb.collection(COLLECTIONS.CALCULATIONS).doc(id);
    const docSnap = await calcRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Calculation not found.',
      };
    }

    await calcRef.delete();
    revalidatePath('/dashboard/admin/calculations');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting calculation:', error);
    return {
      success: false,
      error: 'Failed to delete calculation.',
    };
  }
}
