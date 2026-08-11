'use server';

import { getCalculationById } from '@/lib/calculations';
import { getPriceConfig } from '@/lib/price-config';
import { generateQuotationPdf } from '@/lib/pdf';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

/** Server Action generating Quotation PDF on demand. Keeps calculations server-authoritative. */
export async function getCalculationPdfAction(
  calculationId: string,
  clientDetails?: {
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
  }
): Promise<ApiResponse<string>> {
  try {
    const [calculation, priceConfig] = await Promise.all([
      getCalculationById(calculationId),
      getPriceConfig(),
    ]);

    if (!calculation) {
      return {
        success: false,
        error: 'Calculation estimate was not found.',
      };
    }

    // Merge live clientDetails if passed from the active form state
    if (clientDetails) {
      console.log('[DEBUG] PDF Action - Merging live form clientDetails:', clientDetails);
      if (clientDetails.businessName) calculation.businessName = clientDetails.businessName;
      if (clientDetails.businessEmail) calculation.businessEmail = clientDetails.businessEmail;
      if (clientDetails.businessPhone) calculation.businessPhone = clientDetails.businessPhone;
    }

    console.log('[DEBUG] PDF Action - Final data passed to PDF generator:', {
      id: calculation.id,
      businessName: calculation.businessName,
      businessEmail: calculation.businessEmail,
      businessPhone: calculation.businessPhone,
    });

    // Compile quotation PDF with client details
    const base64Pdf = await generateQuotationPdf(calculation, priceConfig);

    return {
      success: true,
      data: base64Pdf,
    };
  } catch (error) {
    console.error('Error generating calculation PDF Action:', error);
    return {
      success: false,
      error: 'Failed to compile quotation PDF.',
    };
  }
}
