import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Industry } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback industries returned when Firebase credentials are empty (e.g. initial builds/dev setups)
export const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: 'ind-tech',
    name: 'Technology & SaaS Enterprises',
    slug: 'tech-saas',
    basePrice: 0,
    recommendedPackageId: 'pkg-enterprise',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ind-retail',
    name: 'Retail, E-commerce, & Logistics',
    slug: 'retail-ecommerce',
    basePrice: 0,
    recommendedPackageId: 'pkg-professional',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ind-finance',
    name: 'Finance, Banking & Insurtech',
    slug: 'finance-banking',
    basePrice: 0,
    recommendedPackageId: 'pkg-enterprise',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ind-healthcare',
    name: 'Healthcare, Clinical & Well-being',
    slug: 'healthcare-clinical',
    basePrice: 0,
    recommendedPackageId: 'pkg-professional',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Fetch all industries sorted by sortOrder */
export async function getIndustries(onlyActive = false): Promise<Industry[]> {
  if (!hasCredentials) {
    return onlyActive ? DEFAULT_INDUSTRIES.filter((i) => i.isActive) : DEFAULT_INDUSTRIES;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.INDUSTRIES);
    
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

    // Sort in-memory to bypass composite index requirements
    return list.sort((a, b) => ((a as any).sortOrder || 0) - ((b as any).sortOrder || 0));
  } catch (error: any) {
    // Quiet fallback to static assets
    return onlyActive ? DEFAULT_INDUSTRIES.filter((i) => i.isActive) : DEFAULT_INDUSTRIES;
  }
}

/** Fetch a single industry by ID */
export async function getIndustryById(id: string): Promise<Industry | null> {
  if (!hasCredentials) {
    return DEFAULT_INDUSTRIES.find((i) => i.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.INDUSTRIES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Industry;
  } catch (error) {
    console.error(`Error fetching industry by ID (${id}):`, error);
    return DEFAULT_INDUSTRIES.find((i) => i.id === id) || null;
  }
}
