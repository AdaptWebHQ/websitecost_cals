import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import { getCache, setCache } from '@/lib/server-cache';
import type { AddonFeature } from '@/types';
import { slugify } from '@/lib/utils';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback features returned when Firebase credentials are empty
export const DEFAULT_ADDON_FEATURES: AddonFeature[] = [
  {
    id: 'feat-extra-page',
    serviceCategoryId: 'sc-website',
    categoryId: 'cat-design',
    name: 'Extra Page',
    slug: 'extra-page',
    description: 'Additional custom designed pages beyond the package inclusion.',
    price: 2000,
    pricingType: 'per_page',
    defaultSelected: false,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Check if addon feature name is a duplicate within the service category and category */
async function checkDuplicateName(
  serviceCategoryId: string,
  categoryId: string,
  name: string,
  excludeId?: string
): Promise<boolean> {
  if (!hasCredentials) return false;

  const slug = slugify(name);
  const snap = await adminDb
    .collection(COLLECTIONS.ADDON_FEATURES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('categoryId', '==', categoryId)
    .where('slug', '==', slug)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

/** Check if addon feature is referenced in calculations */
async function isReferenced(id: string): Promise<boolean> {
  if (!hasCredentials) return false;

  const calculationsSnap = await adminDb
    .collection(COLLECTIONS.CALCULATIONS)
    .where('selectedAddonFeatureIds', 'array-contains', id)
    .limit(1)
    .get();

  return !calculationsSnap.empty;
}

/** Create a new Addon Feature */
export async function createAddonFeature(
  data: Omit<AddonFeature, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateName(data.serviceCategoryId, data.categoryId, data.name);
  if (isDuplicate) {
    throw new Error('A feature with this name already exists in this category.');
  }

  const slug = slugify(data.name);
  const docRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc();
  
  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

/** Update an existing Addon Feature */
export async function updateAddonFeature(
  id: string,
  data: Partial<Omit<AddonFeature, 'id' | 'createdAt' | 'slug'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Feature not found.');
  }

  const currentData = docSnap.data() as AddonFeature;
  const name = data.name ?? currentData.name;
  const categoryId = data.categoryId ?? currentData.categoryId;
  const serviceCategoryId = data.serviceCategoryId ?? currentData.serviceCategoryId;

  if (name !== currentData.name || categoryId !== currentData.categoryId || serviceCategoryId !== currentData.serviceCategoryId) {
    const isDuplicate = await checkDuplicateName(serviceCategoryId, categoryId, name, id);
    if (isDuplicate) {
      throw new Error('A feature with this name already exists in this category.');
    }
  }

  const slug = slugify(name);

  await docRef.update({
    ...data,
    slug,
    updatedAt: new Date(),
  });
}

/** Delete an Addon Feature */
export async function deleteAddonFeature(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Feature not found.');
  }

  const hasRefs = await isReferenced(id);
  if (hasRefs) {
    throw new Error('Cannot delete addon feature because it is referenced in calculations.');
  }

  await docRef.delete();
}

/** Fetch a single addon feature by ID */
export async function getAddonById(id: string): Promise<AddonFeature | null> {
  if (!hasCredentials) {
    return DEFAULT_ADDON_FEATURES.find((f) => f.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as AddonFeature;
  } catch (error) {
    console.error(`Error fetching addon by ID (${id}):`, error);
    return null;
  }
}

/** Fetch addon features for a service category, optionally filtered by categoryId */
export async function getAddonFeaturesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean; categoryId?: string } = { onlyActive: true }
): Promise<AddonFeature[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) {
    let list = DEFAULT_ADDON_FEATURES.filter((f) => f.serviceCategoryId === serviceCategoryId);
    if (options.categoryId) list = list.filter((f) => f.categoryId === options.categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }

  const cacheKey = `addons:category:${serviceCategoryId}:catId:${options.categoryId || 'all'}:onlyActive:${onlyActive}`;
  const cached = getCache<AddonFeature[]>(cacheKey);
  if (cached) return cached;

  try {
    let queryRef: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.ADDON_FEATURES)
      .where('serviceCategoryId', '==', serviceCategoryId);
    
    if (options.categoryId) {
      queryRef = queryRef.where('categoryId', '==', options.categoryId);
    }
    
    if (onlyActive) {
      queryRef = queryRef.where('isActive', '==', true);
    }
    
    const snap = await queryRef.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AddonFeature[];

    const sorted = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error: unknown) {
    console.error(`Error fetching addon features for category ${serviceCategoryId}:`, error);
    return [];
  }
}

/** Paginated addon features list fetch */
export async function getAddonsPage(
  options: { limit?: number; cursor?: string; serviceCategoryId?: string; categoryId?: string; onlyActive?: boolean; filters?: PaginationFilters } = {}
) {
  if (!hasCredentials) {
    const items = await getAddonFeaturesByServiceCategory(options.serviceCategoryId || '', {
      onlyActive: options.onlyActive,
      categoryId: options.categoryId,
    });
    return { items, nextCursor: undefined, hasMore: false };
  }

  try {
    const collectionRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;
    if (options.serviceCategoryId) combinedFilters.serviceCategoryId = options.serviceCategoryId;
    if (options.categoryId) combinedFilters.categoryId = options.categoryId;
    if (options.onlyActive) combinedFilters.isActive = true;

    const query = buildPagedQuery(
      collectionRef,
      { page: 1, limit: options.limit ?? 25, cursor: options.cursor, filters: combinedFilters },
      'sortOrder',
      'asc'
    );

    const snap = await query.get();
    const page = formatPageResult<AddonFeature>(snap.docs, options.limit ?? 25);

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as AddonFeature[],
    };
  } catch (error: unknown) {
    console.error('Error fetching addons page:', error);
    return { items: [], hasMore: false };
  }
}

// ----------------------------------------------------------------------------
// Backward Compatibility / Deprecated wrappers
// ----------------------------------------------------------------------------

/** @deprecated Use getAddonFeaturesByServiceCategory instead */
export async function getAddons(categoryId?: string, onlyActive = false): Promise<AddonFeature[]> {
  if (!hasCredentials) {
    let list = DEFAULT_ADDON_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }
  try {
    let queryRef: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.ADDON_FEATURES);
    if (categoryId) queryRef = queryRef.where('categoryId', '==', categoryId);
    if (onlyActive) queryRef = queryRef.where('isActive', '==', true);
    const snap = await queryRef.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as AddonFeature[];
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch {
    let list = DEFAULT_ADDON_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }
}
