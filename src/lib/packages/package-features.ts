import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { PackageFeature } from '@/types';

const hasCredentials =
  !!process.env.FIREBASE_PROJECT_ID &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!process.env.FIREBASE_PRIVATE_KEY;

export async function getPackageFeatures(
  packageId: string
): Promise<PackageFeature[]> {
  if (!hasCredentials) return [];

  try {
    const snap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
      .doc(packageId)
      .collection('features')
      .get();

    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as PackageFeature[];

    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.error('Error fetching package features:', error);
    return [];
  }
}

export async function getPackageFeatureById(
  packageId: string,
  featureId: string
): Promise<PackageFeature | null> {
  if (!hasCredentials) return null;

  try {
    const docSnap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
      .doc(packageId)
      .collection('features')
      .doc(featureId)
      .get();

    if (!docSnap.exists) return null;

    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as PackageFeature;
  } catch (error) {
    console.error('Error fetching package feature:', error);
    return null;
  }
}

export async function createPackageFeature(
  packageId: string,
  data: Omit<PackageFeature, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = new Date();

  const docRef = await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .doc(packageId)
    .collection('features')
    .add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

  return docRef.id;
}

export async function updatePackageFeature(
  packageId: string,
  featureId: string,
  data: Partial<Omit<PackageFeature, 'id' | 'createdAt'>>
): Promise<void> {
  await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .doc(packageId)
    .collection('features')
    .doc(featureId)
    .update({
      ...data,
      updatedAt: new Date(),
    });
}

export async function deletePackageFeature(
  packageId: string,
  featureId: string
): Promise<void> {
  await adminDb
    .collection(COLLECTIONS.PACKAGES)
    .doc(packageId)
    .collection('features')
    .doc(featureId)
    .delete();
}