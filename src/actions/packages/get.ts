'use server';

import {
  getPackageById,
  getPackagesWithInbuiltFeaturesByServiceType,
} from '@/lib/packages';
import { getServerUser } from '@/actions/auth';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ApiResponse, Package } from '@/types';

/** Get a single package by ID */
export async function getPackageAction(id: string): Promise<ApiResponse<Package>> {
  try {
    const pkg = await getPackageById(id);
    if (!pkg) {
      return { success: false, error: 'Package not found.' };
    }
    return { success: true, data: pkg };
  } catch (error: unknown) {
    console.error('Error fetching package:', error);
    return { success: false, error: 'Failed to fetch package.' };
  }
}

/** Get packages list under a service category and type with in-built features */
export async function getPackagesAction(
  serviceCategoryId: string,
  serviceTypeId?: string,
  onlyActive = false
): Promise<ApiResponse<Package[]>> {
  try {
    const list = await getPackagesWithInbuiltFeaturesByServiceType(serviceCategoryId, serviceTypeId, onlyActive);
    return { success: true, data: list };
  } catch (error: unknown) {
    console.error('Error fetching packages list:', error);
    return { success: false, error: 'Failed to fetch packages.' };
  }
}

/** Get active packages list under a service category and type */
export async function getActivePackagesAction(
  serviceCategoryId: string,
  serviceTypeId?: string
): Promise<ApiResponse<Package[]>> {
  return getPackagesAction(serviceCategoryId, serviceTypeId, true);
}

/** Get package count statistics per Service Type for a category */
export async function getPackageStatsAction(
  serviceCategoryId: string
): Promise<ApiResponse<Record<string, number>>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const serviceTypesSnap = await adminDb
      .collection(COLLECTIONS.SERVICE_TYPES)
      .where('serviceCategoryId', '==', serviceCategoryId)
      .get();

    const stats: Record<string, number> = {};

    await Promise.all(
      serviceTypesSnap.docs.map(async (doc) => {
        const countSnap = await adminDb
          .collection(COLLECTIONS.PACKAGES)
          .where('serviceTypeId', '==', doc.id)
          .count()
          .get();
        stats[doc.id] = countSnap.data().count;
      })
    );

    return { success: true, data: stats };
  } catch (error: unknown) {
    console.error('Error fetching package statistics:', error);
    return { success: false, error: 'Failed to fetch package statistics.' };
  }
}
