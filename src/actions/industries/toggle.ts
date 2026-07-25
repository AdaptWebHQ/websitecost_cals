'use server';

import { updateIndustry } from '@/lib/industries';
import { getServerUser } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { delCachePrefix } from '@/lib/server-cache';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ApiResponse } from '@/types';

export async function toggleIndustryActiveAction(
  id: string,
  isActive: boolean
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    await updateIndustry(id, { isActive });

    revalidatePath('/admin/industries');
    delCachePrefix('industries');

    return { success: true, message: 'Industry status toggled successfully.' };
  } catch (error: unknown) {
    console.error('Error toggling industry status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status.',
    };
  }
}

/** Reorder sorting list orders in a batch query */
export async function reorderIndustriesAction(
  industryIds: string[]
): Promise<ApiResponse<void>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized administrative operation.' };
    }

    const batch = adminDb.batch();
    
    industryIds.forEach((id, idx) => {
      const docRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
      batch.update(docRef, { 
        sortOrder: idx,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    revalidatePath('/admin/industries');
    delCachePrefix('industries');

    return { success: true, message: 'Industries reordered successfully.' };
  } catch (error: unknown) {
    console.error('Error reordering industries:', error);
    return {
      success: false,
      error: 'Failed to reorder industries.',
    };
  }
}
