import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import { getCache, setCache } from '@/lib/server-cache';
import type { ServiceType } from '@/types';
import { slugify } from '@/lib/utils';

const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

export const DEFAULT_SERVICE_TYPES: ServiceType[] = [
  {
    id: 'st-informational',
    serviceCategoryId: 'sc-website', // default fallback category
    name: 'Informational Website',
    slug: 'informational-website',
    description: 'Company profiles, landing pages, and content websites.',
    icon: 'Globe',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'st-ecommerce',
    serviceCategoryId: 'sc-website',
    name: 'E-Commerce Store',
    slug: 'e-commerce-store',
    description: 'Online store with shopping cart and payment gateway integrations.',
    icon: 'ShoppingCart',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Check if service type name is a duplicate within the service category */
async function checkDuplicateName(serviceCategoryId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const slug = slugify(name);
  const snap = await adminDb
    .collection(COLLECTIONS.SERVICE_TYPES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('slug', '==', slug)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

/** Check if service type is referenced by any calculations */
async function isReferenced(id: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const calculationsSnap = await adminDb
    .collection(COLLECTIONS.CALCULATIONS)
    .where('serviceTypeId', '==', id)
    .limit(1)
    .get();

  return !calculationsSnap.empty;
}

/** Create a new Service Type */
export async function createServiceType(
  data: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateName(data.serviceCategoryId, data.name);
  if (isDuplicate) {
    throw new Error('A service type with this name already exists in this category.');
  }

  const slug = slugify(data.name);
  const docRef = adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc();
  
  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

/** Update an existing Service Type */
export async function updateServiceType(
  id: string,
  data: Partial<Omit<ServiceType, 'id' | 'createdAt' | 'slug'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Service type not found.');
  }

  const currentData = docSnap.data() as ServiceType;
  const newName = data.name ?? currentData.name;
  const serviceCategoryId = data.serviceCategoryId ?? currentData.serviceCategoryId;

  // If name or category changed, check for duplicate name in the target category
  if (newName !== currentData.name || serviceCategoryId !== currentData.serviceCategoryId) {
    const isDuplicate = await checkDuplicateName(serviceCategoryId, newName, id);
    if (isDuplicate) {
      throw new Error('A service type with this name already exists in this category.');
    }
  }

  const slug = slugify(newName);

  await docRef.update({
    ...data,
    slug,
    updatedAt: new Date(),
  });
}

/** Delete a Service Type */
export async function deleteServiceType(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Service type not found.');
  }

  // Check if packages are assigned to this service type
  const packagesSnap = await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .where('serviceTypeId', '==', id)
    .get();

  if (!packagesSnap.empty) {
    throw new Error(`Cannot delete Service Type. Reason: ${packagesSnap.size} Packages are assigned.`);
  }

  const hasRefs = await isReferenced(id);
  if (hasRefs) {
    throw new Error('Cannot delete service type because it is referenced in calculations.');
  }

  await docRef.delete();
}

/** Fetch a single Service Type by ID */
export async function getServiceTypeById(id: string): Promise<ServiceType | null> {
  if (!hasCredentials) {
    return DEFAULT_SERVICE_TYPES.find((st) => st.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc(id).get();
    if (!docSnap.exists) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as ServiceType;
  } catch (error) {
    console.error(`Error fetching service type by ID (${id}):`, error);
    return null;
  }
}

/** Fetch Service Types by Service Category */
export async function getServiceTypesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean } = { onlyActive: true }
): Promise<ServiceType[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) {
    let list = DEFAULT_SERVICE_TYPES.filter((st) => st.serviceCategoryId === serviceCategoryId);
    if (onlyActive) {
      list = list.filter((st) => st.isActive);
    }
    return list;
  }

  const cacheKey = `service_types:category:${serviceCategoryId}:onlyActive:${onlyActive}`;
  const cached = getCache<ServiceType[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.SERVICE_TYPES)
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
    })) as ServiceType[];

    const sorted = list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error) {
    console.error(`Error fetching service types for category (${serviceCategoryId}):`, error);
    return [];
  }
}

/** Paginated fetch for admin dashboard list */
export async function getServiceTypesPage(
  options: { limit?: number; cursor?: string; serviceCategoryId?: string; onlyActive?: boolean; filters?: PaginationFilters } = {}
) {
  if (!hasCredentials) {
    const items = await getServiceTypesByServiceCategory(options.serviceCategoryId || '', { onlyActive: options.onlyActive });
    return { items, nextCursor: undefined, hasMore: false };
  }

  try {
    const collectionRef = adminDb.collection(COLLECTIONS.SERVICE_TYPES);
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
    const page = formatPageResult<ServiceType>(snap.docs, options.limit ?? 25, 'sortOrder');

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as ServiceType[],
    };
  } catch (error) {
    console.error('Error fetching service types page:', error);
    return { items: [], hasMore: false };
  }
}
