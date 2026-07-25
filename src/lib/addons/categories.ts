import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getCache, setCache } from '@/lib/server-cache';
import type { AddonCategory } from '@/types';
import { slugify } from '@/lib/utils';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback categories returned when Firebase credentials are empty
export const DEFAULT_ADDON_CATEGORIES: AddonCategory[] = [
  {
    id: 'cat-design',
    serviceCategoryId: 'sc-website',
    name: 'Design & Content',
    slug: 'design-content',
    description: 'Custom branding, logo design, page layout, copywriting, and design assets.',
    icon: 'Palette',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-features',
    serviceCategoryId: 'sc-website',
    name: 'Features & Modules',
    slug: 'features-modules',
    description: 'Advanced dynamic modules like CMS, blogs, booking engines, gateways, and login systems.',
    icon: 'Cpu',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Check if category name is a duplicate within the service category */
async function checkDuplicateName(serviceCategoryId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!hasCredentials) return false;

  const slug = slugify(name);
  const snap = await adminDb
    .collection(COLLECTIONS.ADDON_CATEGORIES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('slug', '==', slug)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

/** Check if category contains any addon features */
async function hasFeatures(id: string): Promise<boolean> {
  if (!hasCredentials) return false;

  const featuresSnap = await adminDb
    .collection(COLLECTIONS.ADDON_FEATURES)
    .where('categoryId', '==', id)
    .limit(1)
    .get();

  return !featuresSnap.empty;
}

/** Create a new Addon Category */
export async function createAddonCategory(
  data: Omit<AddonCategory, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateName(data.serviceCategoryId, data.name);
  if (isDuplicate) {
    throw new Error('A category with this name already exists in this service category.');
  }

  const slug = slugify(data.name);
  const docRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc();
  
  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

/** Update an existing Addon Category */
export async function updateAddonCategory(
  id: string,
  data: Partial<Omit<AddonCategory, 'id' | 'createdAt' | 'slug'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Category not found.');
  }

  const currentData = docSnap.data() as AddonCategory;
  const name = data.name ?? currentData.name;
  const serviceCategoryId = data.serviceCategoryId ?? currentData.serviceCategoryId;

  if (name !== currentData.name || serviceCategoryId !== currentData.serviceCategoryId) {
    const isDuplicate = await checkDuplicateName(serviceCategoryId, name, id);
    if (isDuplicate) {
      throw new Error('A category with this name already exists in this service category.');
    }
  }

  const slug = slugify(name);

  await docRef.update({
    ...data,
    slug,
    updatedAt: new Date(),
  });
}

/** Delete an Addon Category */
export async function deleteAddonCategory(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Category not found.');
  }

  const hasF = await hasFeatures(id);
  if (hasF) {
    throw new Error('Cannot delete category containing addon features. Please delete or re-assign addon features first.');
  }

  await docRef.delete();
}

/** Fetch a single addon category by ID */
export async function getAddonCategoryById(id: string): Promise<AddonCategory | null> {
  if (!hasCredentials) {
    return DEFAULT_ADDON_CATEGORIES.find((c) => c.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as AddonCategory;
  } catch (error) {
    console.error(`Error fetching category by ID (${id}):`, error);
    return null;
  }
}

/** Fetch Addon Categories by Service Category */
export async function getAddonCategoriesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean } = { onlyActive: true }
): Promise<AddonCategory[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) {
    let list = DEFAULT_ADDON_CATEGORIES.filter((c) => c.serviceCategoryId === serviceCategoryId);
    if (onlyActive) {
      list = list.filter((c) => c.isActive);
    }
    return list;
  }

  const cacheKey = `addon_categories:category:${serviceCategoryId}:onlyActive:${onlyActive}`;
  const cached = getCache<AddonCategory[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.ADDON_CATEGORIES)
      .where('serviceCategoryId', '==', serviceCategoryId);
    
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }
    
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AddonCategory[];

    const sorted = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error: unknown) {
    console.error(`Error fetching addon categories for category ${serviceCategoryId}:`, error);
    return [];
  }
}

// ----------------------------------------------------------------------------
// Backward Compatibility / Deprecated wrappers
// ----------------------------------------------------------------------------

/** @deprecated Use getAddonCategoriesByServiceCategory instead */
export async function getAddonCategories(onlyActive = false): Promise<AddonCategory[]> {
  if (!hasCredentials) {
    return onlyActive ? DEFAULT_ADDON_CATEGORIES.filter((c) => c.isActive) : DEFAULT_ADDON_CATEGORIES;
  }
  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES);
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AddonCategory[];
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch {
    return onlyActive ? DEFAULT_ADDON_CATEGORIES.filter((c) => c.isActive) : DEFAULT_ADDON_CATEGORIES;
  }
}
