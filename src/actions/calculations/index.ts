'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { calculatorSubmissionSchema, type CalculatorSubmissionData } from '@/schemas';
import { getPackageById } from '@/lib/packages';
import { getIndustryById } from '@/lib/industries';
import { getServiceTypeById } from '@/lib/service-types';
import { getPriceConfig } from '@/lib/price-config';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { getServerUser } from '@/actions/auth';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';
import type { ApiResponse, Calculation, AddonFeature } from '@/types';

export interface LegacyCalculationInput {
  serviceCategoryId?: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  industryId: string;
  websiteType: string;
  packageId: string;
  pages: number;
  selectedFeatureIds?: string[];
  rushDelivery: boolean;
  customFeatures?: { id: string; name: string; price: number }[];
}

export type CalculationSubmissionInput = CalculatorSubmissionData | LegacyCalculationInput;

/** Recalculate quotation quote values server-side and save to Firestore calculations collection */
export async function createCalculationAction(
  data: CalculationSubmissionInput
): Promise<ApiResponse<Calculation>> {
  try {
    const user = await getServerUser();
    const isLegacy = 'businessName' in data;
    const email = isLegacy 
      ? (data as LegacyCalculationInput).businessEmail 
      : (data as CalculatorSubmissionData).businessDetails?.businessEmail;

    // Rate limit: max 5 calculations per user/email per 10 minutes
    const rateLimitKey = getRateLimitKey('calc', user?.id || email);
    const rateCheck = checkRateLimit(rateLimitKey, { limit: 5, windowSeconds: 600 });
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Too many requests. Please wait ${rateCheck.retryAfter ?? 60} seconds before generating another quotation.`,
      };
    }

    const normalizedData: CalculatorSubmissionData = isLegacy
      ? {
          serviceCategoryId: (data as LegacyCalculationInput).serviceCategoryId || 'sc-website',
          industryId: (data as LegacyCalculationInput).industryId,
          serviceTypeId: (data as LegacyCalculationInput).websiteType,
          packageId: (data as LegacyCalculationInput).packageId,
          selectedPackageFeatureIds: [],
          selectedAddonFeatureIds: (data as LegacyCalculationInput).selectedFeatureIds || [],
          pages: (data as LegacyCalculationInput).pages,
          rushDelivery: (data as LegacyCalculationInput).rushDelivery,
          businessDetails: {
            businessName: (data as LegacyCalculationInput).businessName,
            businessEmail: (data as LegacyCalculationInput).businessEmail,
            businessPhone: (data as LegacyCalculationInput).businessPhone || '',
          },
        }
      : (data as CalculatorSubmissionData);

    const validated = calculatorSubmissionSchema.safeParse(normalizedData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0].message,
      };
    }

    const {
      serviceCategoryId,
      industryId,
      serviceTypeId,
      packageId,
      selectedPackageFeatureIds,
      selectedAddonFeatureIds,
      pages,
      rushDelivery,
      businessDetails,
    } = validated.data;

    // Fetch related records in parallel on the server
    const [selectedPackage, industry, serviceType, priceConfig] = await Promise.all([
      getPackageById(packageId),
      getIndustryById(industryId),
      getServiceTypeById(serviceTypeId),
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

    if (!serviceType) {
      return {
        success: false,
        error: 'Selected service type was not found.',
      };
    }

    // Fetch selected features from database
    const selectedFeatures: AddonFeature[] = [];
    if (selectedAddonFeatureIds.length > 0) {
      // Chunk selectedAddonFeatureIds into groups of 10 to prevent Firestore 'in' operator limitations
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < selectedAddonFeatureIds.length; i += chunkSize) {
        chunks.push(selectedAddonFeatureIds.slice(i, i + chunkSize));
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
      []
    );

    const now = new Date();
    
    // Save generated calculation record in database with normalized client details at root and nested
    const newCalculation: Omit<Calculation, 'id'> = {
      userId: user?.id || null, // null if anonymous run before login
      serviceCategoryId,
      businessName: businessDetails.businessName,
      businessEmail: businessDetails.businessEmail,
      businessPhone: businessDetails.businessPhone || '',
      businessDetails: {
        businessName: businessDetails.businessName,
        businessEmail: businessDetails.businessEmail,
        businessPhone: businessDetails.businessPhone || '',
      },
      industryId,
      industryName: industry.name,
      serviceTypeId,
      websiteType: serviceType.name,
      packageId,
      packageName: selectedPackage.name,
      pages,
      selectedPackageFeatureIds,
      selectedAddonFeatureIds,
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
