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
    id: 'pkg-portfolio',
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-starter',
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-professional',
    name: 'Professional',
    slug: 'professional',
    description: 'Best for businesses that want to generate leads online.',
    basePrice: 39999,
    pagesIncluded: 10,
    deliveryDays: 14,
    revisions: 6,
    isPopular: true,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-business',
    name: 'Business',
    slug: 'business',
    description: 'Perfect for businesses needing advanced functionality.',
    basePrice: 69999,
    pagesIncluded: 20,
    deliveryDays: 28,
    revisions: 10,
    isPopular: false,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For businesses requiring fully customized solutions.',
    basePrice: 99999,
    pagesIncluded: 100,
    deliveryDays: 45,
    revisions: 99,
    isPopular: false,
    isActive: true,
    sortOrder: 5,
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
