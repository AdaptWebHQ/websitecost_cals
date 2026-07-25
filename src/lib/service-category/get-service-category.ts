import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { ServiceCategory } from '@/types';
import { DEFAULT_SERVICE_CATEGORIES } from './get-service-categories';

// Check if Firebase credentials are available
const hasCredentials =
  !!process.env.FIREBASE_PROJECT_ID &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!process.env.FIREBASE_PRIVATE_KEY;

/**
 * Fetch a single service category by ID.
 */
export async function getServiceCategoryById(
  id: string
): Promise<ServiceCategory | null> {
  if (!hasCredentials) {
    return DEFAULT_SERVICE_CATEGORIES.find((c) => c.id === id) ?? null;
  }

  try {
    const docSnap = await adminDb
      .collection(COLLECTIONS.SERVICE_CATEGORIES)
      .doc(id)
      .get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...(data as Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: data?.createdAt?.toDate() ?? new Date(),
      updatedAt: data?.updatedAt?.toDate() ?? new Date(),
    };
  } catch (error) {
    console.error(`Error fetching service category by ID (${id}):`, error);

    return DEFAULT_SERVICE_CATEGORIES.find((c) => c.id === id) ?? null;
  }
}

/**
 * Fetch a single service category by slug.
 */
export async function getServiceCategoryBySlug(
  slug: string
): Promise<ServiceCategory | null> {
  if (!hasCredentials) {
    return DEFAULT_SERVICE_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.SERVICE_CATEGORIES)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...(data as Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: data?.createdAt?.toDate() ?? new Date(),
      updatedAt: data?.updatedAt?.toDate() ?? new Date(),
    };
  } catch (error) {
    console.error(`Error fetching service category by slug (${slug}):`, error);

    return DEFAULT_SERVICE_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}