'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

// Helper to escape CSV cell values containing commas, quotes or newlines
function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val).replace(/"/g, '""'); // Escape double quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

/** Export all calculator calculations logs as a CSV data string. Admin only. */
export async function exportCalculationsCsvAction(): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return {
        success: false,
        error: 'Unauthorized. Admin credentials required.',
      };
    }

        // Fetch calculations directly from Firestore order by date descending
    const snapshot = await adminDb
      .collection(COLLECTIONS.CALCULATIONS)
      .orderBy('createdAt', 'desc')
      .get();

    const headers = [
      'Quotation ID',
      'Business Name',
      'Client Email',
      'Client Phone',
      'Industry Vertical',
      'Website Architectural Type',
      'Predefined Package',
      'Configure Pages',
      'Base Price',
      'Features Subtotal',
      'Rush Markup Charge',
      'Integrated GST Amount',
      'Estimated Total Cost',
      'Date Generated',
    ];

    const rows = [headers.join(',')];

    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate 
        ? data.createdAt.toDate().toISOString() 
        : (data.createdAt || '');

      const row = [
        escapeCsvCell(doc.id),
        escapeCsvCell(data.businessName),
        escapeCsvCell(data.businessEmail),
        escapeCsvCell(data.businessPhone),
        escapeCsvCell(data.industryName),
        escapeCsvCell(data.websiteType),
        escapeCsvCell(data.packageName),
        escapeCsvCell(data.pages),
        escapeCsvCell(data.basePrice),
        escapeCsvCell(data.featuresPrice),
        escapeCsvCell(data.rushMarkup),
        escapeCsvCell(data.gstAmount),
        escapeCsvCell(data.total),
        escapeCsvCell(createdAt),
      ];

      rows.push(row.join(','));
    });

    return {
      success: true,
      data: rows.join('\n'),
    };
  } catch (error) {
    console.error('Error compiling calculations CSV:', error);
    return {
      success: false,
      error: 'Failed to compile calculations CSV export.',
    };
  }
}

/** Export all CRM inquiries logs as a CSV data string. Admin only. */
export async function exportInquiriesCsvAction(): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return {
        success: false,
        error: 'Unauthorized. Admin credentials required.',
      };
    }

    const snapshot = await adminDb
      .collection(COLLECTIONS.INQUIRIES)
      .orderBy('createdAt', 'desc')
      .get();

    // Extract all unique non-null calculation IDs from inquiries
    const inquiryDocs = snapshot.docs;
    const calcIds = Array.from(
      new Set(
        inquiryDocs
          .map((doc) => doc.data().calculationId)
          .filter((id): id is string => !!id)
      )
    );

    const calculationsMap = new Map<string, any>();
    if (calcIds.length > 0) {
      // Chunk queries by 10 to satisfy Firestore limits for 'in' operator
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < calcIds.length; i += chunkSize) {
        chunks.push(calcIds.slice(i, i + chunkSize));
      }
      const queryPromises = chunks.map((chunk) =>
        adminDb
          .collection(COLLECTIONS.CALCULATIONS)
          .where('__name__', 'in', chunk)
          .get()
      );
      const querySnapshots = await Promise.all(queryPromises);
      querySnapshots.forEach((snap) => {
        snap.forEach((doc) => {
          calculationsMap.set(doc.id, doc.data());
        });
      });
    }

    const headers = [
      'Inquiry ID',
      'Client Name',
      'Company Name',
      'Email Address',
      'Phone Number',
      'Project Budget Range',
      'Requirements / Notes',
      'Pipeline Status',
      'Calculation Ref ID',
      'Date Submitted',
      // Enriched calculation details
      'Website Type',
      'Selected Package',
      'Configure Pages',
      'Selected Feature Modules',
      'Base Price',
      'Features Cost',
      'Subtotal',
      'GST Tax Amount',
      'Project Cost Total',
      'Timeline (Days)',
    ];

    const rows = [headers.join(',')];

    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate 
        ? data.createdAt.toDate().toISOString() 
        : (data.createdAt || '');

      const calcData = data.calculationId ? calculationsMap.get(data.calculationId) : null;
      
      const featuresStr = calcData?.selectedFeatures
        ? calcData.selectedFeatures.map((f: any) => f.featureName).join('; ')
        : '';

      const row = [
        escapeCsvCell(doc.id),
        escapeCsvCell(data.name),
        escapeCsvCell(data.company),
        escapeCsvCell(data.email),
        escapeCsvCell(data.phone),
        escapeCsvCell(data.budget),
        escapeCsvCell(data.message),
        escapeCsvCell(data.status),
        escapeCsvCell(data.calculationId),
        escapeCsvCell(createdAt),
        // Enriched calculation details
        escapeCsvCell(calcData?.websiteType || ''),
        escapeCsvCell(calcData?.packageName || ''),
        escapeCsvCell(calcData?.pages ? String(calcData.pages) : ''),
        escapeCsvCell(featuresStr),
        escapeCsvCell(calcData?.basePrice ? String(calcData.basePrice) : ''),
        escapeCsvCell(calcData?.featuresPrice ? String(calcData.featuresPrice) : ''),
        escapeCsvCell(calcData?.subtotal ? String(calcData.subtotal) : ''),
        escapeCsvCell(calcData?.gstAmount ? String(calcData.gstAmount) : ''),
        escapeCsvCell(calcData?.total ? String(calcData.total) : ''),
        escapeCsvCell(calcData?.estimatedDays ? String(calcData.estimatedDays) : ''),
      ];

      rows.push(row.join(','));
    });

    return {
      success: true,
      data: rows.join('\n'),
    };
  } catch (error) {
    console.error('Error compiling inquiries CSV:', error);
    return {
      success: false,
      error: 'Failed to compile inquiries CSV export.',
    };
  }
}
