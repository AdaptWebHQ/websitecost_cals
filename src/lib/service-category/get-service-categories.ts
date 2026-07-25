import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getCache, setCache } from '@/lib/server-cache';
import type { ServiceCategory } from '@/types';

// Check if Firebase credentials are available
const hasCredentials =
  !!process.env.FIREBASE_PROJECT_ID &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!process.env.FIREBASE_PRIVATE_KEY;

/**
 * Default fallback service categories.
 * Used only when Firebase credentials are unavailable.
 */
export const DEFAULT_SERVICE_CATEGORIES: ServiceCategory[] = [];

/**
 * Fetch all service categories sorted by sortOrder.
 */
export async function getServiceCategories(
  onlyActive = false
): Promise<ServiceCategory[]> {
  if (!hasCredentials) {
    return onlyActive
      ? DEFAULT_SERVICE_CATEGORIES.filter((c) => c.isActive)
      : DEFAULT_SERVICE_CATEGORIES;
  }

  const cacheKey = `service-categories:onlyActive:${onlyActive}`;

  const cached = getCache<ServiceCategory[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query =
      adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES);

    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }

    const snapshot = await query.get();

    const categories: ServiceCategory[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...(data as Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>),
          createdAt: data.createdAt?.toDate() ?? new Date(),
          updatedAt: data.updatedAt?.toDate() ?? new Date(),
        };
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    setCache(cacheKey, categories, 3600);

    return categories;
  } catch (error) {
    console.error('Error fetching service categories:', error);

    return onlyActive
      ? DEFAULT_SERVICE_CATEGORIES.filter((c) => c.isActive)
      : DEFAULT_SERVICE_CATEGORIES;
  }
}