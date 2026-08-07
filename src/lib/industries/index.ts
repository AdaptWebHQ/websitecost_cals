// @/lib/industries.ts
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import { getCache, setCache } from '@/lib/server-cache';
import type { Industry } from '@/types';
import { slugify } from '@/lib/utils';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback industries returned when Firebase credentials are empty
export const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: 'ind-tech',
    serviceCategoryId: 'sc-website',
    name: 'Technology & SaaS Enterprises',
    slug: 'tech-saas',
    description: 'Bespoke web solutions optimized for scalable software-as-a-service platforms and fast-growing tech startups.', 
    basePrice: 0,
    recommendedPackageId: 'pkg-enterprise',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ind-retail',
    serviceCategoryId: 'sc-website',
    name: 'Retail, E-commerce, & Logistics',
    slug: 'retail-ecommerce',
    description: 'Conversion-focused digital storefronts and integrated systems to streamline online retail operations and supply chain visibility.',
    basePrice: 0,
    recommendedPackageId: 'pkg-starter',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Check if industry name is a duplicate within the service category */
async function checkDuplicateName(serviceCategoryId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const slug = slugify(name);
  const snap = await adminDb
    .collection(COLLECTIONS.INDUSTRIES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('slug', '==', slug)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

/** Check if industry is referenced by any calculations */
async function isReferenced(id: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const calculationsSnap = await adminDb
    .collection(COLLECTIONS.CALCULATIONS)
    .where('industryId', '==', id)
    .limit(1)
    .get();

  return !calculationsSnap.empty;
}

/** Create a new Industry */
export async function createIndustry(
  data: Omit<Industry, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateName(data.serviceCategoryId, data.name);
  if (isDuplicate) {
    throw new Error('An industry with this name already exists in this category.');
  }

  const slug = slugify(data.name);
  const docRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc();
  
  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

/** Update an existing Industry */
export async function updateIndustry(
  id: string,
  data: Partial<Omit<Industry, 'id' | 'createdAt' | 'slug'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Industry not found.');
  }

  const currentData = docSnap.data() as Industry;
  const newName = data.name ?? currentData.name;
  const serviceCategoryId = data.serviceCategoryId ?? currentData.serviceCategoryId;

  if (newName !== currentData.name || serviceCategoryId !== currentData.serviceCategoryId) {
    const isDuplicate = await checkDuplicateName(serviceCategoryId, newName, id);
    if (isDuplicate) {
      throw new Error('An industry with this name already exists in this category.');
    }
  }

  const slug = slugify(newName);

  await docRef.update({
    ...data,
    slug,
    updatedAt: new Date(),
  });
}

/** Delete an Industry */
export async function deleteIndustry(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Industry not found.');
  }

  const hasRefs = await isReferenced(id);
  if (hasRefs) {
    throw new Error('Cannot delete industry because it is referenced in calculations.');
  }

  await docRef.delete();
}

/** Fetch a single Industry by ID */
export async function getIndustryById(id: string): Promise<Industry | null> {
  if (!hasCredentials) {
    return DEFAULT_INDUSTRIES.find((i) => i.id === id) || null;
  }

  const cacheKey = `industry:id:${id}`;
  const cached = getCache<Industry | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id).get();
    if (!docSnap.exists) {
      setCache(cacheKey, null, 3600);
      return null;
    }
    
    const data = docSnap.data();
    const ind = {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Industry;

    setCache(cacheKey, ind, 3600);
    return ind;
  } catch (error) {
    console.error(`Error fetching industry by ID (${id}):`, error);
    return null;
  }
}

/** Fetch Industries by Service Category */
export async function getIndustriesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean } = { onlyActive: true }
): Promise<Industry[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) {
    let list = DEFAULT_INDUSTRIES.filter((i) => i.serviceCategoryId === serviceCategoryId);
    if (onlyActive) {
      list = list.filter((i) => i.isActive);
    }
    return list;
  }

  const cacheKey = `industries:category:${serviceCategoryId}:onlyActive:${onlyActive}`;
  const cached = getCache<Industry[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.INDUSTRIES)
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
    })) as Industry[];

    const sorted = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error: unknown) {
    console.error(`Error fetching industries for category ${serviceCategoryId}:`, error);
    return DEFAULT_INDUSTRIES.filter((i) => i.serviceCategoryId === serviceCategoryId);
  }
}

/** Paginated industries list fetch */
export async function getIndustriesPage(
  options: { limit?: number; cursor?: string; serviceCategoryId?: string; onlyActive?: boolean; filters?: PaginationFilters } = {}
) {
  if (!hasCredentials) {
    const items = await getIndustriesByServiceCategory(options.serviceCategoryId || '', { onlyActive: options.onlyActive });
    return { items, nextCursor: undefined, hasMore: false };
  }

  try {
    const collectionRef = adminDb.collection(COLLECTIONS.INDUSTRIES);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;
    if (options.serviceCategoryId) combinedFilters.serviceCategoryId = options.serviceCategoryId;
    if (options.onlyActive) combinedFilters.isActive = true;

    const query = buildPagedQuery(
      collectionRef,
      { page: 1, limit: options.limit ?? 25, cursor: options.cursor, filters: combinedFilters },
      'sortOrder',
      'asc'
    );

    const snap = await query.get();
    const page = formatPageResult<Industry>(snap.docs, options.limit ?? 25, 'sortOrder');

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as Industry[],
    };
  } catch (error: unknown) {
    console.error('Error fetching industries page:', error);
    return { items: [], hasMore: false };
  }
}

// ----------------------------------------------------------------------------
// Backward Compatibility / Deprecated wrappers
// ----------------------------------------------------------------------------

/** @deprecated Use getIndustriesByServiceCategory instead */
export async function getIndustries(onlyActive = false): Promise<Industry[]> {
  if (!hasCredentials) return onlyActive ? DEFAULT_INDUSTRIES.filter((i) => i.isActive) : DEFAULT_INDUSTRIES;
  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.INDUSTRIES);
    if (onlyActive) query = query.where('isActive', '==', true);
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Industry[];
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch {
    return onlyActive ? DEFAULT_INDUSTRIES.filter((i) => i.isActive) : DEFAULT_INDUSTRIES;
  }
}