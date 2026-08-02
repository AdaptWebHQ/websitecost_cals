import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import { getCache, setCache } from '@/lib/server-cache';
import type { PackageFeatureCategory, PackageFeature, Package } from '@/types';

// Check if credentials are loaded
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// -------------------------------------------------------------
// Category Helpers & Validations
// -------------------------------------------------------------

async function checkDuplicateCategoryName(serviceCategoryId: string, name: string, excludeId?: string): Promise<boolean> {
  if (!hasCredentials) return false;
  
  const snap = await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('name', '==', name)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

// -------------------------------------------------------------
// Feature Helpers & Validations
// -------------------------------------------------------------

async function checkDuplicateFeatureName(
  serviceCategoryId: string,
  categoryId: string,
  name: string,
  excludeId?: string
): Promise<boolean> {
  if (!hasCredentials) return false;

  const snap = await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURES)
    .where('serviceCategoryId', '==', serviceCategoryId)
    .where('categoryId', '==', categoryId)
    .where('name', '==', name)
    .get();

  const duplicates = snap.docs.filter((doc) => doc.id !== excludeId);
  return duplicates.length > 0;
}

async function isFeatureReferenced(id: string): Promise<boolean> {
  if (!hasCredentials) return false;

  // Check if any calculations reference this feature ID
  const calculationsSnap = await adminDb
    .collection(COLLECTIONS.CALCULATIONS)
    .where('selectedPackageFeatureIds', 'array-contains', id)
    .limit(1)
    .get();

  // Check if any packages reference this feature ID (in case database transaction went out of sync)
  const packagesSnap = await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .where('includedFeatureIds', 'array-contains', id)
    .limit(1)
    .get();

  return !calculationsSnap.empty || !packagesSnap.empty;
}

// -------------------------------------------------------------
// Categories Database Methods
// -------------------------------------------------------------

export async function createPackageFeatureCategory(
  data: Omit<PackageFeatureCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateCategoryName(data.serviceCategoryId, data.name);
  if (isDuplicate) {
    throw new Error('A category with this name already exists in this service category.');
  }

  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc();
  await docRef.set({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updatePackageFeatureCategory(
  id: string,
  data: Partial<Omit<PackageFeatureCategory, 'id' | 'createdAt'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Category not found.');
  }

  const currentData = docSnap.data() as PackageFeatureCategory;
  const name = data.name ?? currentData.name;
  const serviceCategoryId = data.serviceCategoryId ?? currentData.serviceCategoryId;

  if (name !== currentData.name || serviceCategoryId !== currentData.serviceCategoryId) {
    const isDuplicate = await checkDuplicateCategoryName(serviceCategoryId, name, id);
    if (isDuplicate) {
      throw new Error('A category with this name already exists in this service category.');
    }
  }

  await docRef.update({
    ...data,
    updatedAt: new Date(),
  });
}

export async function deletePackageFeatureCategory(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  // Block deletion if category contains any features
  const featuresSnap = await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURES)
    .where('categoryId', '==', id)
    .limit(1)
    .get();

  if (!featuresSnap.empty) {
    throw new Error('Cannot delete category containing package features. Please delete or re-assign features first.');
  }

  const catRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(id);
  const docSnap = await catRef.get();
  if (!docSnap.exists) {
    throw new Error('Category not found.');
  }

  await catRef.delete();
}

export async function reorderPackageFeatureCategories(orderedIds: string[]): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  const batch = adminDb.batch();
  orderedIds.forEach((id, idx) => {
    const ref = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(id);
    batch.update(ref, { displayOrder: idx, updatedAt: new Date() });
  });
  await batch.commit();
}

export async function getPackageFeatureCategoryById(id: string): Promise<PackageFeatureCategory | null> {
  if (!hasCredentials) return null;
  try {
    const doc = await adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as PackageFeatureCategory;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

/** Fetch feature categories for a service category ordered by displayOrder */
export async function getPackageFeatureCategoriesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean } = { onlyActive: true }
): Promise<PackageFeatureCategory[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) return [];

  const cacheKey = `pkg_feature_categories:category:${serviceCategoryId}:onlyActive:${onlyActive}`;
  const cached = getCache<PackageFeatureCategory[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES)
      .where('serviceCategoryId', '==', serviceCategoryId);

    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }

    const snap = await query.get();
    const list = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as PackageFeatureCategory;
    });

    const sorted = list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error) {
    console.error(`Error fetching feature categories for service category (${serviceCategoryId}):`, error);
    return [];
  }
}

// -------------------------------------------------------------
// Features Database Methods
// -------------------------------------------------------------

/** Create a new package feature with transactional bidirectional relationship syncing */
export async function createPackageFeature(
  data: Omit<PackageFeature, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const isDuplicate = await checkDuplicateFeatureName(data.serviceCategoryId, data.categoryId, data.name);
  if (isDuplicate) {
    throw new Error('A feature with this name already exists in this category.');
  }

  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc();
  const now = new Date();

  await adminDb.runTransaction(async (transaction) => {
    const packageIds = data.packageIds || [];

    // 1. ALL READS FIRST
    const pkgItems: { ref: FirebaseFirestore.DocumentReference; data?: Package }[] = [];
    for (const pkgId of packageIds) {
      const pkgRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(pkgId);
      const pkgSnap = await transaction.get(pkgRef);
      if (pkgSnap.exists) {
        pkgItems.push({ ref: pkgRef, data: pkgSnap.data() as Package });
      }
    }

    // 2. ALL WRITES AFTER READS COMPLETE
    for (const item of pkgItems) {
      if (item.data) {
        const currentIncludedFeatureIds = item.data.includedFeatureIds || [];
        if (!currentIncludedFeatureIds.includes(docRef.id)) {
          transaction.update(item.ref, {
            includedFeatureIds: [...currentIncludedFeatureIds, docRef.id],
            updatedAt: now,
          });
        }
      }
    }

    // Set the package feature document
    transaction.set(docRef, {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  });

  return docRef.id;
}

/** Update an existing package feature with transactional bidirectional relationship syncing */
export async function updatePackageFeature(
  id: string,
  data: Partial<Omit<PackageFeature, 'id' | 'createdAt'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(id);
  const now = new Date();

  // Check duplicate feature name BEFORE transaction if needed
  const initialSnap = await docRef.get();
  if (!initialSnap.exists) {
    throw new Error('Package feature not found.');
  }

  const initialFeature = initialSnap.data() as PackageFeature;
  const newName = data.name ?? initialFeature.name;
  const categoryId = data.categoryId ?? initialFeature.categoryId;
  const serviceCategoryId = data.serviceCategoryId ?? initialFeature.serviceCategoryId;

  if (newName !== initialFeature.name || categoryId !== initialFeature.categoryId || serviceCategoryId !== initialFeature.serviceCategoryId) {
    const isDuplicate = await checkDuplicateFeatureName(serviceCategoryId, categoryId, newName, id);
    if (isDuplicate) {
      throw new Error('A feature with this name already exists in this category.');
    }
  }

  await adminDb.runTransaction(async (transaction) => {
    // 1. READ package feature doc inside transaction
    const docSnap = await transaction.get(docRef);
    if (!docSnap.exists) {
      throw new Error('Package feature not found.');
    }

    const currentFeature = docSnap.data() as PackageFeature;
    const newPackageIds = data.packageIds ?? currentFeature.packageIds ?? [];
    const oldPackageIds = currentFeature.packageIds || [];

    const addedPackageIds = newPackageIds.filter((pid) => !oldPackageIds.includes(pid));
    const removedPackageIds = oldPackageIds.filter((pid) => !newPackageIds.includes(pid));

    // 2. ALL READS FOR ADDED PACKAGES
    const addedItems: { ref: FirebaseFirestore.DocumentReference; data?: Package }[] = [];
    for (const pkgId of addedPackageIds) {
      const pkgRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(pkgId);
      const pkgSnap = await transaction.get(pkgRef);
      if (pkgSnap.exists) {
        addedItems.push({ ref: pkgRef, data: pkgSnap.data() as Package });
      }
    }

    // 3. ALL READS FOR REMOVED PACKAGES
    const removedItems: { ref: FirebaseFirestore.DocumentReference; data?: Package }[] = [];
    for (const pkgId of removedPackageIds) {
      const pkgRef = adminDb.collection(COLLECTIONS.PACKAGES).doc(pkgId);
      const pkgSnap = await transaction.get(pkgRef);
      if (pkgSnap.exists) {
        removedItems.push({ ref: pkgRef, data: pkgSnap.data() as Package });
      }
    }

    // 4. NOW EXECUTE ALL WRITES AFTER READS
    for (const item of addedItems) {
      if (item.data) {
        const currentIncludedFeatureIds = item.data.includedFeatureIds || [];
        if (!currentIncludedFeatureIds.includes(id)) {
          transaction.update(item.ref, {
            includedFeatureIds: [...currentIncludedFeatureIds, id],
            updatedAt: now,
          });
        }
      }
    }

    for (const item of removedItems) {
      if (item.data) {
        const currentIncludedFeatureIds = item.data.includedFeatureIds || [];
        transaction.update(item.ref, {
          includedFeatureIds: currentIncludedFeatureIds.filter((fid) => fid !== id),
          updatedAt: now,
        });
      }
    }

    // Update package feature document
    transaction.update(docRef, {
      ...data,
      updatedAt: now,
    });
  });
}

/** Delete a package feature and remove references from packages */
export async function deletePackageFeature(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');

  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('Package feature not found.');
  }

  const isUsed = await isFeatureReferenced(id);
  if (isUsed) {
    throw new Error('Cannot delete package feature because it is referenced in packages or calculations.');
  }

  // Query referencing packages BEFORE transaction
  const packagesSnap = await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .where('includedFeatureIds', 'array-contains', id)
    .get();

  await adminDb.runTransaction(async (transaction) => {
    // 1. ALL READS FIRST
    const items: { ref: FirebaseFirestore.DocumentReference; data?: Package }[] = [];
    for (const pkgDoc of packagesSnap.docs) {
      const pkgSnap = await transaction.get(pkgDoc.ref);
      if (pkgSnap.exists) {
        items.push({ ref: pkgDoc.ref, data: pkgSnap.data() as Package });
      }
    }

    // 2. ALL WRITES AFTER READS
    for (const item of items) {
      if (item.data) {
        const currentIncludedFeatureIds = item.data.includedFeatureIds || [];
        transaction.update(item.ref, {
          includedFeatureIds: currentIncludedFeatureIds.filter((fid) => fid !== id),
          updatedAt: new Date(),
        });
      }
    }

    // Delete the package feature document
    transaction.delete(docRef);
  });
}

export async function reorderPackageFeatures(orderedIds: string[]): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  const batch = adminDb.batch();
  orderedIds.forEach((id, idx) => {
    const ref = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(id);
    batch.update(ref, { displayOrder: idx, updatedAt: new Date() });
  });
  await batch.commit();
}

export async function getPackageFeatureById(id: string): Promise<PackageFeature | null> {
  if (!hasCredentials) return null;
  try {
    const doc = await adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as PackageFeature;
  } catch (error) {
    console.error(`Error fetching package feature ${id}:`, error);
    return null;
  }
}

/** Fetch features for a service category, optionally filtered by categoryId */
export async function getPackageFeaturesByServiceCategory(
  serviceCategoryId: string,
  options: { onlyActive?: boolean; categoryId?: string; packageId?: string } = { onlyActive: true }
): Promise<PackageFeature[]> {
  const onlyActive = options.onlyActive ?? true;

  if (!hasCredentials) return [];

  const cacheKey = `pkg_features:category:${serviceCategoryId}:catId:${options.categoryId || 'all'}:pkgId:${options.packageId || 'all'}:onlyActive:${onlyActive}`;
  const cached = getCache<PackageFeature[]>(cacheKey);
  if (cached) return cached;

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection(COLLECTIONS.PACKAGE_FEATURES)
      .where('serviceCategoryId', '==', serviceCategoryId);

    if (options.categoryId) {
      query = query.where('categoryId', '==', options.categoryId);
    }
    
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }

    const snap = await query.get();
    let list = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as PackageFeature;
    });

    if (options.packageId) {
      list = list.filter((f) => f.packageIds && f.packageIds.includes(options.packageId!));
    }

    const sorted = list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error) {
    console.error(`Error fetching package features for category (${serviceCategoryId}):`, error);
    return [];
  }
}

/** Paginated features list fetch */
export async function getPackageFeaturesPage(
  options: { limit?: number; cursor?: string; serviceCategoryId?: string; categoryId?: string; onlyActive?: boolean; filters?: PaginationFilters } = {}
) {
  if (!hasCredentials) {
    const items = await getPackageFeaturesByServiceCategory(options.serviceCategoryId || '', {
      onlyActive: options.onlyActive,
      categoryId: options.categoryId,
    });
    return { items, nextCursor: undefined, hasMore: false };
  }

  try {
    const collectionRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES);
    const combinedFilters = { ...(options.filters || {}) } as Record<string, unknown>;
    if (options.serviceCategoryId) combinedFilters.serviceCategoryId = options.serviceCategoryId;
    if (options.categoryId) combinedFilters.categoryId = options.categoryId;
    if (options.onlyActive) combinedFilters.isActive = true;

    const query = buildPagedQuery(
      collectionRef,
      { page: 1, limit: options.limit ?? 25, cursor: options.cursor, filters: combinedFilters },
      'displayOrder',
      'asc'
    );

    const snap = await query.get();
    const page = formatPageResult<PackageFeature>(snap.docs, options.limit ?? 25, 'displayOrder');

    return {
      ...page,
      items: page.items.map((item) => ({
        ...item,
        createdAt: (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : item.createdAt,
        updatedAt: (item as any).updatedAt?.toDate ? (item as any).updatedAt.toDate() : item.updatedAt,
      })) as PackageFeature[],
    };
  } catch (error) {
    console.error('Error fetching package features page:', error);
    return { items: [], hasMore: false };
  }
}

// ----------------------------------------------------------------------------
// Backward Compatibility / Deprecated wrappers
// ----------------------------------------------------------------------------

/** @deprecated Use getPackageFeatureCategoriesByServiceCategory instead */
export async function getPackageFeatureCategories(onlyActive = false): Promise<PackageFeatureCategory[]> {
  if (!hasCredentials) return [];
  try {
    const snap = await adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).get();
    let categories = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as PackageFeatureCategory;
    });
    if (onlyActive) categories = categories.filter((c) => c.isActive === true);
    return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch {
    return [];
  }
}

/** @deprecated Use getPackageFeaturesByServiceCategory instead */
export async function getPackageFeatures(categoryId?: string, onlyActive = false): Promise<PackageFeature[]> {
  if (!hasCredentials) return [];
  try {
    const snap = await adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).get();
    let features = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as PackageFeature;
    });
    if (categoryId) features = features.filter((f) => f.categoryId === categoryId);
    if (onlyActive) features = features.filter((f) => f.isActive === true);
    return features.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch {
    return [];
  }
}
