import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Package } from '@/types';
import { getPackageFeatureCategories, getPackageFeatures } from './package-features-library';

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
  } catch (error: unknown) {
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

/** Fetch all packages with their nested in-built features categories & features */
export async function getPackagesWithInbuiltFeatures(onlyActive = false): Promise<Package[]> {
  const pkgs = await getPackages(onlyActive);

  try {
    // 1. Fetch all master categories and features globally
    const [allCategories, allFeatures] = await Promise.all([
      getPackageFeatureCategories(onlyActive),
      getPackageFeatures(undefined, onlyActive)
    ]);

    // 2. Resolve features per package
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
      };
    });
  } catch (error) {
    console.error('Error loading packages with inbuilt features:', error);
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
      };
    }

    const [allCategories, allFeatures] = await Promise.all([
      getPackageFeatureCategories(true),
      getPackageFeatures(undefined, true)
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
    };
  } catch (error) {
    console.error(`Error loading package inbuilt features for ${id}:`, error);
    return pkg;
  }
}
