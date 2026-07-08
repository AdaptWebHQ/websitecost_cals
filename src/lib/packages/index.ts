import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Package } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback packages returned when Firebase credentials are empty (e.g. initial builds/dev setups)
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Brochure',
    slug: 'basic-brochure',
    description: 'Perfect for landing pages, portfolio sites, and single-page startup brochure teasers.',
    basePrice: 15000,
    pagesIncluded: 5,
    deliveryDays: 7,
    revisions: 3,
    isPopular: false,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-professional',
    name: 'Professional Business',
    slug: 'professional-business',
    description: 'Best choice for growing corporate brands requiring interactive blogs, CMS, and analytics.',
    basePrice: 35000,
    pagesIncluded: 15,
    deliveryDays: 14,
    revisions: 5,
    isPopular: true,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise Custom',
    slug: 'enterprise-custom',
    description: 'Bespoke architectural layout tailored for complex portals, e-commerce networks, and SaaS builds.',
    basePrice: 75000,
    pagesIncluded: 35,
    deliveryDays: 25,
    revisions: 99,
    isPopular: false,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Fetch all packages sorted by sortOrder */
export async function getPackages(onlyActive = false): Promise<Package[]> {
  if (!hasCredentials) {
    return onlyActive ? DEFAULT_PACKAGES.filter((p) => p.isActive) : DEFAULT_PACKAGES;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.PACKAGES);
    
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }
    
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Package[];

    // Sort in-memory to bypass composite index requirements
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error: any) {
    // Quiet fallback to static assets
    return onlyActive ? DEFAULT_PACKAGES.filter((p) => p.isActive) : DEFAULT_PACKAGES;
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
    return DEFAULT_PACKAGES.find((p) => p.id === id) || null;
  }
}

/** Fetch a single package by Slug */
export async function getPackageBySlug(slug: string): Promise<Package | null> {
  if (!hasCredentials) {
    return DEFAULT_PACKAGES.find((p) => p.slug === slug) || null;
  }

  try {
    const snap = await adminDb
      .collection(COLLECTIONS.PACKAGES)
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
    console.error(`Error fetching package by slug (${slug}):`, error);
    return DEFAULT_PACKAGES.find((p) => p.slug === slug) || null;
  }
}
