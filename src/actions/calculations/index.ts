'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { calculatorSubmissionSchema, type CalculatorSubmissionData } from '@/schemas';
import { getPackageById } from '@/lib/packages';
import { getIndustryById } from '@/lib/industries';
import { getPriceConfig } from '@/lib/price-config';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { getServerUser } from '@/actions/auth';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Calculation, AddonFeature } from '@/types';

/** Recalculate quotation quote values server-side and save to Firestore calculations collection */
export async function createCalculationAction(
  data: CalculatorSubmissionData
): Promise<ApiResponse<Calculation>> {
  try {
    // Rate limit: max 5 calculations per user/email per 10 minutes
    const user = await getServerUser();
    const rateLimitKey = getRateLimitKey('calc', user?.id || data.businessEmail);
    const rateCheck = checkRateLimit(rateLimitKey, { limit: 5, windowSeconds: 600 });
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Too many requests. Please wait ${rateCheck.retryAfter ?? 60} seconds before generating another quotation.`,
      };
    }

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
      customFeatures,
    } = validated.data;

    // Fetch related records in parallel on the server
    const [selectedPackage, industry, priceConfig] = await Promise.all([
      getPackageById(packageId),
      getIndustryById(industryId),
      getPriceConfig(),
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
    let selectedFeatures: AddonFeature[] = [];
    if (selectedFeatureIds.length > 0) {
      // Chunk selectedFeatureIds into groups of 10 to prevent Firestore 'in' operator limitations
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < selectedFeatureIds.length; i += chunkSize) {
        chunks.push(selectedFeatureIds.slice(i, i + chunkSize));
      }

      const queryPromises = chunks.map((chunk) =>
        adminDb
          .collection(COLLECTIONS.ADDON_FEATURES)
          .where('__name__', 'in', chunk)
          .get()
      );

      const snapshots = await Promise.all(queryPromises);
      for (const snap of snapshots) {
        snap.docs.forEach((doc) => {
          selectedFeatures.push({
            id: doc.id,
            ...doc.data(),
          } as AddonFeature);
        });
      }
    }

    // Run server-side pricing engine recalculation
    const quotation = calculateQuotation(
      selectedPackage,
      selectedFeatures,
      pages,
      rushDelivery,
      priceConfig,
      customFeatures
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

    revalidatePath('/admin/calculations');
    if (user) {
      revalidatePath('/public/estimates');
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
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const calcRef = adminDb.collection(COLLECTIONS.CALCULATIONS).doc(id);
    const docSnap = await calcRef.get();
    if (!docSnap.exists) {
      return {
        success: false,
        error: 'Calculation not found.',
      };
    }

    await calcRef.delete();
    revalidatePath('/admin/calculations');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting calculation:', error);
    return {
      success: false,
      error: 'Failed to delete calculation.',
    };
  }
}
