import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import { getCache, setCache } from '@/lib/server-cache';
import type { Package, PackageFeature } from '@/types';
import { slugify } from '@/lib/utils';
import {
  getPackageFeatureCategoriesByServiceCategory,
  getPackageFeaturesByServiceCategory,
} from './package-features-library';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback packages returned when Firebase credentials are empty
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pkg-portfolio',
    serviceCategoryId: 'sc-website',
    serviceTypeId: 'st-landing-page',
    name: 'Single Page',
    slug: 'portfolio-single-page',
    description: 'Perfect for portfolios, freelancers, consultants, events, restaurants, salons, startups and landing pages.',
    basePrice: 4999,
    pagesIncluded: 1,
    deliveryDays: 4,
    revisions: 2,
    isPopular: false,
    isActive: true,
    sortOrder: 1,
    includedFeatureIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-starter',
    serviceCategoryId: 'sc-website',
    serviceTypeId: 'st-business-website',
    name: 'Starter',
    slug: 'starter',
    description: 'Professional website for small businesses.',
    basePrice: 19999,
    pagesIncluded: 5,
    deliveryDays: 7,
    revisions: 4,
    isPopular: false,
    isActive: true,
    sortOrder: 2,
    includedFeatureIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Check if package name is a duplicate within the service type */
async function checkDuplicateName(serviceCategoryId: string, serviceTypeId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const slug = slugify(name);
  const snap = await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('serviceTypeId', '==', serviceTypeId)
    .where('slug', '==', slug)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

/** Check if package is referenced in calculations or industries */
async function isReferenced(id: string): Promise<boolean> {
  if (!hasCredentials) return false;

  const [industriesSnap, calculationsSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.INDUSTRIES).where('recommendedPackageId', '==', id).limit(1).get(),
    adminDb.collection(COLLECTIONS.CALCULATIONS).where('packageId', '==', id).limit(1).get(),
  ]);

  return !industriesSnap.empty || !calculationsSnap.empty;
}

/** Create a new package with transactional bidirectional relationships */
export async function createPackage(
  data: Omit<Package, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateName(data.serviceCategoryId, data.serviceTypeId, data.name);
  if (isDuplicate) {
    throw new Error('A package with this name already exists in this service type.');
  }

  const slug = slugify(data.name);
  const docRef = adminDb.collection(COLLECTIONS.PACKAGES).doc();
  const now = new Date();

  await adminDb.runTransaction(async (transaction) => {
    const includedFeatureIds = data.includedFeatureIds || [];

    // 1. ALL READS FIRST
    const featItems: { ref: FirebaseFirestore.DocumentReference; data?: PackageFeature }[] = [];
    for (const featId of includedFeatureIds) {
      const featRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(featId);
      const featSnap = await transaction.get(featRef);
      if (featSnap.exists) {
        featItems.push({ ref: featRef, data: featSnap.data() as PackageFeature });
      }
    }

    // 2. ALL WRITES AFTER READS COMPLETE
    for (const item of featItems) {
      if (item.data) {
        const currentPackageIds = item.data.packageIds || [];
        if (!currentPackageIds.includes(docRef.id)) {
          transaction.update(item.ref, {
            packageIds: [...currentPackageIds, docRef.id],
            updatedAt: now,
          });
        }
      }
    }

    // Create the package document
    transaction.set(docRef, {
      ...data,
      slug,
      createdAt: now,
      updatedAt: now,
    });
  });

  return docRef.id;
}

/** Update an existing package with transactional bidirectional relationship syncing */
export async function updatePackage(
  id: string,
  data: Partial<Omit<Package, 'id' | 'createdAt' | 'slug'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
  const now = new Date();

  // Check duplicate name BEFORE transaction if needed
  const initialSnap = await docRef.get();
  if (!initialSnap.exists) {
    throw new Error('Package not found.');
  }

  const initialPackage = initialSnap.data() as Package;
  const newName = data.name ?? initialPackage.name;
  const serviceCategoryId = data.serviceCategoryId ?? initialPackage.serviceCategoryId;
  const serviceTypeId = data.serviceTypeId ?? initialPackage.serviceTypeId;

  if (newName !== initialPackage.name || serviceCategoryId !== initialPackage.serviceCategoryId || serviceTypeId !== initialPackage.serviceTypeId) {
    const isDuplicate = await checkDuplicateName(serviceCategoryId, serviceTypeId, newName, id);
    if (isDuplicate) {
      throw new Error('A package with this name already exists in this category.');
    }
  }

  await adminDb.runTransaction(async (transaction) => {
    // 1. READ package doc inside transaction
    const docSnap = await transaction.get(docRef);
    if (!docSnap.exists) {
      throw new Error('Package not found.');
    }

    const currentPackage = docSnap.data() as Package;
    const newFeatureIds = data.includedFeatureIds ?? currentPackage.includedFeatureIds ?? [];
    const oldFeatureIds = currentPackage.includedFeatureIds ?? [];

    const addedFeatureIds = newFeatureIds.filter((fid) => !oldFeatureIds.includes(fid));
    const removedFeatureIds = oldFeatureIds.filter((fid) => !newFeatureIds.includes(fid));

    // 2. ALL READS FOR ADDED FEATURES
    const addedItems: { ref: FirebaseFirestore.DocumentReference; data?: PackageFeature }[] = [];
    for (const featId of addedFeatureIds) {
      const featRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(featId);
      const featSnap = await transaction.get(featRef);
      if (featSnap.exists) {
        addedItems.push({ ref: featRef, data: featSnap.data() as PackageFeature });
      }
    }

    // 3. ALL READS FOR REMOVED FEATURES
    const removedItems: { ref: FirebaseFirestore.DocumentReference; data?: PackageFeature }[] = [];
    for (const featId of removedFeatureIds) {
      const featRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(featId);
      const featSnap = await transaction.get(featRef);
      if (featSnap.exists) {
        removedItems.push({ ref: featRef, data: featSnap.data() as PackageFeature });
      }
    }

    // 4. NOW EXECUTE ALL WRITES AFTER READS
    for (const item of addedItems) {
      if (item.data) {
        const currentPackageIds = item.data.packageIds || [];
        if (!currentPackageIds.includes(id)) {
          transaction.update(item.ref, {
            packageIds: [...currentPackageIds, id],
            updatedAt: now,
          });
        }
      }
    }

    for (const item of removedItems) {
      if (item.data) {
        const currentPackageIds = item.data.packageIds || [];
        transaction.update(item.ref, {
          packageIds: currentPackageIds.filter((pid) => pid !== id),
          updatedAt: now,
        });
      }
    }

    const slug = slugify(newName);
    transaction.update(docRef, {
      ...data,
      slug,
      updatedAt: now,
    });
  });
}

/** Delete a package and remove references from package features */
export async function deletePackage(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Package not found.');
  }

  const isInUse = await isReferenced(id);
  if (isInUse) {
    throw new Error('Cannot delete package because it is referenced in industries or calculations.');
  }

  // Query referencing features BEFORE transaction
  const featuresSnap = await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURES)
    .where('packageIds', 'array-contains', id)
    .get();

  await adminDb.runTransaction(async (transaction) => {
    // 1. ALL READS FIRST
    const items: { ref: FirebaseFirestore.DocumentReference; data?: PackageFeature }[] = [];
    for (const featDoc of featuresSnap.docs) {
      const featSnap = await transaction.get(featDoc.ref);
      if (featSnap.exists) {
        items.push({ ref: featDoc.ref, data: featSnap.data() as PackageFeature });
      }
    }

    // 2. ALL WRITES AFTER READS
    for (const item of items) {
      if (item.data) {
        const currentPackageIds = item.data.packageIds || [];
        transaction.update(item.ref, {
          packageIds: currentPackageIds.filter((pid) => pid !== id),
          updatedAt: new Date(),
        });
      }
    }

    // Delete the package
    transaction.delete(docRef);
  });
}

/** Fetch all packages in a service type sorted by sortOrder */
export async function getPackagesByServiceType(
  serviceCategoryId: string,
  serviceTypeId?: string,
  options: { onlyActive?: boolean } = { onlyActive: true }
): Promise<Package[]> {
  if (!serviceTypeId) return [];
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) {
    let list = DEFAULT_PACKAGES.filter((p) => p.serviceCategoryId === serviceCategoryId && p.serviceTypeId === serviceTypeId);
    if (onlyActive) {
      list = list.filter((p) => p.isActive);
    }
    return list;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.PACKAGES)
      .where('serviceCategoryId', '==', serviceCategoryId)
      .where('serviceTypeId', '==', serviceTypeId);
    
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }
    
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
    })) as Package[];

    const sorted = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return sorted;
  } catch (error: unknown) {
    console.error(`Error fetching packages for category ${serviceCategoryId} and type ${serviceTypeId}:`, error);
    return DEFAULT_PACKAGES.filter((p) => p.serviceCategoryId === serviceCategoryId && p.serviceTypeId === serviceTypeId);
  }
}

/** Fetch a single package by ID */
export async function getPackageById(id: string): Promise<Package | null> {
  if (!hasCredentials) {
    return DEFAULT_PACKAGES.find((p) => p.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.PACKAGES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Package;
  } catch (error) {
    console.error(`Error fetching package by ID (${id}):`, error);
    return null;
  }
}

/** Paginated packages list fetch */
export async function getPackagesPage(
  options: { limit?: number; cursor?: string; serviceCategoryId?: string; serviceTypeId?: string; onlyActive?: boolean; filters?: PaginationFilters } = {}
) {
  if (!hasCredentials) {
    const items = await getPackagesByServiceType(options.serviceCategoryId || '', options.serviceTypeId || '', { onlyActive: options.onlyActive });
    return { items, nextCursor: undefined, hasMore: false };
  }

  try {
    const collectionRef = adminDb.collection(COLLECTIONS.PACKAGES);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;
    if (options.serviceCategoryId) combinedFilters.serviceCategoryId = options.serviceCategoryId;
    if (options.serviceTypeId) combinedFilters.serviceTypeId = options.serviceTypeId;
    if (options.onlyActive) combinedFilters.isActive = true;

    const query = buildPagedQuery(
      collectionRef,
      { page: 1, limit: options.limit ?? 25, cursor: options.cursor, filters: combinedFilters },
      'sortOrder',
      'asc'
    );

    const snap = await query.get();
    const page = formatPageResult<Package>(snap.docs, options.limit ?? 25, 'sortOrder');

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as Package[],
    };
  } catch (error) {
    console.error('Error fetching packages page:', error);
    return { items: [], hasMore: false };
  }
}

/** Fetch a single package by Slug */
export async function getPackageBySlug(serviceCategoryId: string, slug: string): Promise<Package | null> {
  if (!hasCredentials) {
    return DEFAULT_PACKAGES.find((p) => p.slug === slug && p.serviceCategoryId === serviceCategoryId) || null;
  }

  try {
    const snap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
      .where('serviceCategoryId', '==', serviceCategoryId)
      .where('slug', '==', slug)
      .limit(1)
      .get();
      
    if (snap.empty) return null;
    
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Package;
  } catch (error) {
    console.error(`Error fetching package by slug (${slug}) for category (${serviceCategoryId}):`, error);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Backward Compatibility / Deprecated wrappers
// ----------------------------------------------------------------------------

/** @deprecated Use getPackagesByServiceCategory instead */
export async function getPackages(onlyActive = false): Promise<Package[]> {
  if (!hasCredentials) return onlyActive ? DEFAULT_PACKAGES.filter((p) => p.isActive) : DEFAULT_PACKAGES;
  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.PACKAGES);
    if (onlyActive) query = query.where('isActive', '==', true);
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Package[];
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch {
    return onlyActive ? DEFAULT_PACKAGES.filter((p) => p.isActive) : DEFAULT_PACKAGES;
  }
}

/** @deprecated Use getPackageBySlug(serviceCategoryId, slug) instead */
export async function getPackageBySlugLegacy(slug: string): Promise<Package | null> {
  if (!hasCredentials) return DEFAULT_PACKAGES.find((p) => p.slug === slug) || null;
  try {
    const snap = await adminDb.collection(COLLECTIONS.PACKAGES).where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return {
      id: snap.docs[0].id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Package;
  } catch {
    return DEFAULT_PACKAGES.find((p) => p.slug === slug) || null;
  }
}

/** Fetch packages with their nested inbuilt features categories & features scoped by service type */
export async function getPackagesWithInbuiltFeaturesByServiceType(
  serviceCategoryId: string,
  serviceTypeId?: string,
  onlyActive = true
): Promise<Package[]> {
  if (!serviceTypeId) return [];
  const pkgs = await getPackagesByServiceType(serviceCategoryId, serviceTypeId, { onlyActive });

  try {
    const [allCategories, allFeatures] = await Promise.all([
      getPackageFeatureCategoriesByServiceCategory(serviceCategoryId, { onlyActive }),
      getPackageFeaturesByServiceCategory(serviceCategoryId, { onlyActive }),
    ]);

    return pkgs.map((pkg) => {
      const includedIds = pkg.includedFeatureIds || [];
      const packageFeatures = allFeatures.filter((f) => includedIds.includes(f.id));

      const categoriesWithFeatures = allCategories
        .map((cat) => {
          const catFeatures = packageFeatures
            .filter((f) => f.categoryId === cat.id)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          return {
            ...cat,
            features: catFeatures,
          };
        })
        .filter((cat) => cat.features.length > 0)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      return {
        ...pkg,
        featureCategories: categoriesWithFeatures,
      } as any;
    });
  } catch (error) {
    console.error(`Error loading packages with inbuilt features for category ${serviceCategoryId} and type ${serviceTypeId}:`, error);
    return pkgs;
  }
}

/** Fetch a single package with its nested in-built features categories & features */
export async function getPackageWithInbuiltFeaturesById(id: string): Promise<Package | null> {
  const pkg = await getPackageById(id);
  if (!pkg) return null;

  try {
    const includedIds = pkg.includedFeatureIds || [];
    if (includedIds.length === 0) {
      return {
        ...pkg,
        featureCategories: [],
      } as any;
    }

    const serviceCategoryId = pkg.serviceCategoryId;
    const [allCategories, allFeatures] = await Promise.all([
      getPackageFeatureCategoriesByServiceCategory(serviceCategoryId, { onlyActive: true }),
      getPackageFeaturesByServiceCategory(serviceCategoryId, { onlyActive: true }),
    ]);

    const packageFeatures = allFeatures.filter((f) => includedIds.includes(f.id));

    const categoriesWithFeatures = allCategories
      .map((cat) => {
        const catFeatures = packageFeatures
          .filter((f) => f.categoryId === cat.id)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return {
          ...cat,
          features: catFeatures,
        };
      })
      .filter((cat) => cat.features.length > 0)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return {
      ...pkg,
      featureCategories: categoriesWithFeatures,
    } as any;
  } catch (error) {
    console.error(`Error loading package inbuilt features for ${id}:`, error);
    return pkg;
  }
}

import { getServiceCategories } from '../service-category/get-service-categories';

/** @deprecated Use getPackagesWithInbuiltFeaturesByServiceType instead */
export async function getPackagesWithInbuiltFeatures(onlyActive = false): Promise<Package[]> {
  let catId = 'sc-website';
  try {
    const categories = await getServiceCategories(true);
    if (categories.length > 0) {
      const target = categories.find(c => c.id === 'sc-website' || c.slug === 'website-development') || categories[0];
      if (target) catId = target.id;
    }
  } catch (e) {
    console.error('Failed to resolve dynamic category ID for packages:', e);
  }
  return getPackagesWithInbuiltFeaturesByServiceType(catId, undefined, onlyActive);
}
