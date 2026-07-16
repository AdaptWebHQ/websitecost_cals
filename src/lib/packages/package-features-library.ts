import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { PackageFeatureCategory, PackageFeature } from '@/types';

// Check if credentials are loaded
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// -------------------------------------------------------------
// Categories Database Methods
// -------------------------------------------------------------

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

    if (onlyActive) {
      categories = categories.filter((c) => c.isActive === true);
    }
    
    return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.error('Error fetching package feature categories:', error);
    return [];
  }
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

export async function createPackageFeatureCategory(
  data: Omit<PackageFeatureCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
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
  await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES)
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date(),
    });
}

export async function deletePackageFeatureCategory(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  const batch = adminDb.batch();
  
  // Delete the category document
  const catRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc(id);
  batch.delete(catRef);

  // Find all child features and delete them
  const featuresSnap = await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURES)
    .where('categoryId', '==', id)
    .get();

  featuresSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
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

// -------------------------------------------------------------
// Features Database Methods
// -------------------------------------------------------------

export async function getPackageFeatures(
  categoryId?: string,
  onlyActive = false
): Promise<PackageFeature[]> {
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

    if (categoryId) {
      features = features.filter((f) => f.categoryId === categoryId);
    }
    if (onlyActive) {
      features = features.filter((f) => f.isActive === true);
    }
    
    return features.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.error('Error fetching package features:', error);
    return [];
  }
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

export async function createPackageFeature(
  data: Omit<PackageFeature, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  const docRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc();
  await docRef.set({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function updatePackageFeature(
  id: string,
  data: Partial<Omit<PackageFeature, 'id' | 'createdAt'>>
): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  await adminDb
    .collection(COLLECTIONS.PACKAGE_FEATURES)
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date(),
    });
}

export async function deletePackageFeature(id: string): Promise<void> {
  if (!hasCredentials) throw new Error('Firebase credentials missing.');
  await adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc(id).delete();
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
