import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { delCachePrefix } from '@/lib/server-cache';
import type { ServiceCategory } from '@/types';

interface UpdateServiceCategoryInput {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

/**
 * Convert a name into a URL-friendly slug.
 */
function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Update an existing service category.
 */
export async function updateServiceCategory(
  input: UpdateServiceCategoryInput
): Promise<ServiceCategory> {
  const docRef = adminDb
    .collection(COLLECTIONS.SERVICE_CATEGORIES)
    .doc(input.id);

  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error('Service category not found.');
  }

  const existingData = docSnap.data()!;

  const slug = generateSlug(input.name);

  // Prevent duplicate slug (ignore current document)
  const duplicate = await adminDb
    .collection(COLLECTIONS.SERVICE_CATEGORIES)
    .where('slug', '==', slug)
    .limit(2)
    .get();

  const duplicateExists = duplicate.docs.some(
    (doc) => doc.id !== input.id
  );

  if (duplicateExists) {
    throw new Error('A service category with this name already exists.');
  }

  const updatedAt = Timestamp.now();

  await docRef.update({
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    icon: input.icon,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    updatedAt,
  });

  delCachePrefix('service-categories');

  return {
    id: input.id,
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    icon: input.icon,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    createdAt: existingData.createdAt?.toDate() ?? new Date(),
    updatedAt: updatedAt.toDate(),
  };
}