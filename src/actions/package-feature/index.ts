'use server';

import { revalidatePath } from 'next/cache';
import type { ApiResponse, PackageFeature } from '@/types';

import {
  getPackageFeatures,
  getPackageFeatureById,
  createPackageFeature,
  updatePackageFeature,
  deletePackageFeature,
} from '@/lib/packages/package-features';

/**
 * Get all features for a package
 */
export async function getPackageFeaturesAction(
  packageId: string
): Promise<ApiResponse<PackageFeature[]>> {
  try {
    const features = await getPackageFeatures(packageId);

    return {
      success: true,
      data: features,
    };
  } catch (error) {
    console.error('Error loading package features:', error);

    return {
      success: false,
      error: 'Failed to load package features.',
    };
  }
}

/**
 * Get a single package feature
 */
export async function getPackageFeatureByIdAction(
  packageId: string,
  featureId: string
): Promise<ApiResponse<PackageFeature>> {
  try {
    const feature = await getPackageFeatureById(packageId, featureId);

    if (!feature) {
      return {
        success: false,
        error: 'Package feature not found.',
      };
    }

    return {
      success: true,
      data: feature,
    };
  } catch (error) {
    console.error('Error fetching package feature:', error);

    return {
      success: false,
      error: 'Failed to fetch package feature.',
    };
  }
}

/**
 * Create package feature
 */
export async function createPackageFeatureAction(
  packageId: string,
  data: Omit<PackageFeature, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<string>> {
  try {
    const id = await createPackageFeature(packageId, data);

    revalidatePath('/admin/packages');

    return {
      success: true,
      data: id,
      message: 'Feature created successfully.',
    };
  } catch (error) {
    console.error('Error creating package feature:', error);

    return {
      success: false,
      error: 'Failed to create feature.',
    };
  }
}

/**
 * Update package feature
 */
export async function updatePackageFeatureAction(
  packageId: string,
  featureId: string,
  data: Partial<Omit<PackageFeature, 'id' | 'createdAt'>>
): Promise<ApiResponse<void>> {
  try {
    await updatePackageFeature(packageId, featureId, data);

    revalidatePath('/admin/packages');

    return {
      success: true,
      message: 'Feature updated successfully.',
    };
  } catch (error) {
    console.error('Error updating package feature:', error);

    return {
      success: false,
      error: 'Failed to update feature.',
    };
  }
}

/**
 * Delete package feature
 */
export async function deletePackageFeatureAction(
  packageId: string,
  featureId: string
): Promise<ApiResponse<void>> {
  try {
    await deletePackageFeature(packageId, featureId);

    revalidatePath('/admin/packages');

    return {
      success: true,
      message: 'Feature deleted successfully.',
    };
  } catch (error) {
    console.error('Error deleting package feature:', error);

    return {
      success: false,
      error: 'Failed to delete feature.',
    };
  }
}