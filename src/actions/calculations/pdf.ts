'use server';

import { getCalculationById } from '@/lib/calculations';
import { getPriceConfig } from '@/lib/price-config';
import { generateQuotationPdf } from '@/lib/pdf';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

/** Server Action generating Quotation PDF on demand. Keeps calculations server-authoritative. */
export async function getCalculationPdfAction(
  calculationId: string
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized. Please sign in.',
      };
    }

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

    // Verify ownership: Admin/Super Admin can see all estimates, public user can only see their own
    if (user.role === 'public' && calculation.userId !== user.id) {
      return {
        success: false,
        error: 'Forbidden. You do not own this quotation.',
      };
    }

    // Compile quotation PDF
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
