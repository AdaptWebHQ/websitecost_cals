import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import type { Feature } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback features returned when Firebase credentials are empty (e.g. initial builds/dev setups)
export const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'feat-theme',
    categoryId: 'cat-core',
    name: 'Custom Tailored UI/UX Design',
    slug: 'custom-ui-ux',
    description: 'Bespoke Figma prototype converted to custom Tailwind code without using stock layouts.',
    price: 15000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-cms',
    categoryId: 'cat-integrations',
    name: 'Headless CMS Dashboard Integration',
    slug: 'headless-cms',
    description: 'Allows editing content, media files, and services from a clean web panel interface.',
    price: 10000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-payments',
    categoryId: 'cat-integrations',
    name: 'Razorpay / Stripe Gateway Binding',
    slug: 'payments-gateway',
    description: 'Secure SSL checkout integration supporting UPI, Credit Cards, and recurring plans.',
    price: 5000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-seo',
    categoryId: 'cat-marketing',
    name: 'Advanced On-Page SEO Scopes',
    slug: 'advanced-seo',
    description: 'Configuring metadata, sitemaps, open-graph cards, and structured schema tags.',
    price: 500,
    pricingType: 'per_page',
    defaultSelected: false,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-chat',
    categoryId: 'cat-integrations',
    name: 'Live Chat / WhatsApp Widget',
    slug: 'live-chat',
    description: 'Floating chat drawer connected directly to support lines or CRM desks.',
    price: 2500,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Fetch all features, optionally filtered by category and sorted by sortOrder */
export async function getFeatures(
  categoryId?: string,
  onlyActive = false
): Promise<Feature[]> {
  if (!hasCredentials) {
    let list = DEFAULT_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }

  try {
    let queryRef: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.FEATURES);
    
    if (categoryId) {
      queryRef = queryRef.where('categoryId', '==', categoryId);
    }
    
    if (onlyActive) {
      queryRef = queryRef.where('isActive', '==', true);
    }
    
    const snap = await queryRef.get();
    
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Feature[];

    // Sort in-memory to bypass composite index requirements
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error: any) {
    // Quiet fallback to static assets
    let list = DEFAULT_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }
}

/** Fetch a single feature by ID */
export async function getFeatureById(id: string): Promise<Feature | null> {
  if (!hasCredentials) {
    return DEFAULT_FEATURES.find((f) => f.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.FEATURES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Feature;
  } catch (error) {
    console.error(`Error fetching feature by ID (${id}):`, error);
    return DEFAULT_FEATURES.find((f) => f.id === id) || null;
  }
}
