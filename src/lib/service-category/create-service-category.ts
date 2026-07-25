import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { delCachePrefix } from '@/lib/server-cache';
import type { ServiceCategory } from '@/types';

interface CreateServiceCategoryInput {
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
 * Create a new service category.
 */
export async function createServiceCategory(
  input: CreateServiceCategoryInput
): Promise<ServiceCategory> {
  const slug = generateSlug(input.name);

  // Prevent duplicate slug
  const existing = await adminDb
    .collection(COLLECTIONS.SERVICE_CATEGORIES)
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (!existing.empty) {
    throw new Error('A service category with this name already exists.');
  }

  const now = Timestamp.now();

  const docRef = adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES).doc();

  await docRef.set({
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    icon: input.icon,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  });

  delCachePrefix('service-categories');

  return {
    id: docRef.id,
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    icon: input.icon,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };
}