'use server';

import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse, PackageFeatureCategory, PackageFeature } from '@/types';

import {
  getPackageFeatureCategories,
  createPackageFeatureCategory,
  updatePackageFeatureCategory,
  deletePackageFeatureCategory,
  reorderPackageFeatureCategories,
  getPackageFeatures,
  createPackageFeature,
  updatePackageFeature,
  deletePackageFeature,
  reorderPackageFeatures,
} from '@/lib/packages/package-features-library';

// -------------------------------------------------------------
// Categories actions
// -------------------------------------------------------------

export async function getPackageFeatureCategoriesAction(
  onlyActive = false
): Promise<ApiResponse<PackageFeatureCategory[]>> {
  try {
    const categories = await getPackageFeatureCategories(onlyActive);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching categories action:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}

export async function createPackageFeatureCategoryAction(
  data: Omit<PackageFeatureCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    const id = await createPackageFeatureCategory(data);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, data: id, message: 'Category created successfully.' };
  } catch (error) {
    console.error('Error creating category action:', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function updatePackageFeatureCategoryAction(
  id: string,
  data: Partial<Omit<PackageFeatureCategory, 'id' | 'createdAt'>>
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await updatePackageFeatureCategory(id, data);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Category updated successfully.' };
  } catch (error) {
    console.error('Error updating category action:', error);
    return { success: false, error: 'Failed to update category.' };
  }
}

export async function deletePackageFeatureCategoryAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await deletePackageFeatureCategory(id);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Category deleted successfully.' };
  } catch (error) {
    console.error('Error deleting category action:', error);
    return { success: false, error: 'Failed to delete category.' };
  }
}

export async function reorderPackageFeatureCategoriesAction(
  orderedIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await reorderPackageFeatureCategories(orderedIds);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Categories reordered successfully.' };
  } catch (error) {
    console.error('Error reordering categories action:', error);
    return { success: false, error: 'Failed to reorder categories.' };
  }
}

// -------------------------------------------------------------
// Features actions
// -------------------------------------------------------------

export async function getPackageFeaturesAction(
  categoryId?: string,
  onlyActive = false
): Promise<ApiResponse<PackageFeature[]>> {
  try {
    const features = await getPackageFeatures(categoryId, onlyActive);
    return { success: true, data: features };
  } catch (error) {
    console.error('Error fetching features action:', error);
    return { success: false, error: 'Failed to fetch features.' };
  }
}

export async function createPackageFeatureAction(
  data: Omit<PackageFeature, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    const id = await createPackageFeature(data);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, data: id, message: 'Feature created successfully.' };
  } catch (error) {
    console.error('Error creating feature action:', error);
    return { success: false, error: 'Failed to create feature.' };
  }
}

export async function updatePackageFeatureAction(
  id: string,
  data: Partial<Omit<PackageFeature, 'id' | 'createdAt'>>
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await updatePackageFeature(id, data);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Feature updated successfully.' };
  } catch (error) {
    console.error('Error updating feature action:', error);
    return { success: false, error: 'Failed to update feature.' };
  }
}

export async function deletePackageFeatureAction(id: string): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await deletePackageFeature(id);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Feature deleted successfully.' };
  } catch (error) {
    console.error('Error deleting feature action:', error);
    return { success: false, error: 'Failed to delete feature.' };
  }
}

export async function reorderPackageFeaturesAction(orderedIds: string[]): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }
    await reorderPackageFeatures(orderedIds);
    revalidatePath('/admin/package-features');
    delCachePrefix('pkg_feature');
    return { success: true, message: 'Features reordered successfully.' };
  } catch (error) {
    console.error('Error reordering features action:', error);
    return { success: false, error: 'Failed to reorder features.' };
  }
}
