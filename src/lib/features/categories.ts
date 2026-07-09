import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { FeatureCategory } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback categories returned when Firebase credentials are empty (e.g. initial builds/dev setups)
export const DEFAULT_CATEGORIES: FeatureCategory[] = [
  {
    id: 'cat-design',
    name: 'Design & Content',
    slug: 'design-content',
    description: 'Custom branding, logo design, page layout, copywriting, and design assets.',
    icon: 'Palette',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-features',
    name: 'Features & Modules',
    slug: 'features-modules',
    description: 'Advanced dynamic modules like CMS, blogs, booking engines, gateways, and login systems.',
    icon: 'Cpu',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-automation',
    name: 'Integrations & Automations',
    slug: 'integrations-automations',
    description: 'Automation widgets, chatbots, API integrations, and direct live support options.',
    icon: 'Sparkles',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-setup',
    name: 'Setup & Deployment',
    slug: 'setup-deployment',
    description: 'Server infrastructure, deployment, business emails, and hosting configuration.',
    icon: 'Server',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Fetch all feature categories sorted by sortOrder */
export async function getFeatureCategories(onlyActive = false): Promise<FeatureCategory[]> {
  if (!hasCredentials) {
    return onlyActive ? DEFAULT_CATEGORIES.filter((c) => c.isActive) : DEFAULT_CATEGORIES;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES);
    
    if (onlyActive) {
      query = query.where('isActive', '==', true);
    }
    
    const snap = await query.get();
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as FeatureCategory[];

    // Sort in-memory to bypass composite index requirements
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error: any) {
    // Quiet fallback to static assets
    return onlyActive ? DEFAULT_CATEGORIES.filter((c) => c.isActive) : DEFAULT_CATEGORIES;
  }
}

/** Fetch a single feature category by ID */
export async function getCategoryById(id: string): Promise<FeatureCategory | null> {
  if (!hasCredentials) {
    return DEFAULT_CATEGORIES.find((c) => c.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as FeatureCategory;
  } catch (error) {
    console.error(`Error fetching category by ID (${id}):`, error);
    return DEFAULT_CATEGORIES.find((c) => c.id === id) || null;
  }
}
