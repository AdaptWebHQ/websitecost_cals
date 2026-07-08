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
    ];

    const rows = [headers.join(',')];

    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate 
        ? data.createdAt.toDate().toISOString() 
        : (data.createdAt || '');

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
