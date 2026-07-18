import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getCache, setCache } from '@/lib/server-cache';
import type { AddonFeature } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback features returned when Firebase credentials are empty (e.g. initial builds/dev setups)
export const DEFAULT_ADDON_FEATURES: AddonFeature[] = [
  // Category 1: Design & Content (cat-design)
  {
    id: 'feat-extra-page',
    categoryId: 'cat-design',
    name: 'Extra Page',
    slug: 'extra-page',
    description: 'Additional custom designed pages beyond the package inclusion.',
    price: 2000,
    pricingType: 'per_page',
    defaultSelected: false,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-logo',
    categoryId: 'cat-design',
    name: 'Logo Design',
    slug: 'logo-design',
    description: 'Custom professional vector logo design for your brand.',
    price: 8000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-brand-kit',
    categoryId: 'cat-design',
    name: 'Brand Identity Kit',
    slug: 'brand-identity-kit',
    description: 'Complete brand guide, typography layout, color codes, and social templates.',
    price: 15000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-copywriting',
    categoryId: 'cat-design',
    name: 'Copywriting',
    slug: 'copywriting',
    description: 'Professional sales copy and SEO optimized text content written for all pages.',
    price: 10000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Category 2: Features & Modules (cat-features)
  {
    id: 'feat-blog-cms',
    categoryId: 'cat-features',
    name: 'Blog/CMS',
    slug: 'blog-cms',
    description: 'Content Management System (CMS) to publish posts, news articles, or case studies.',
    price: 8000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-booking',
    categoryId: 'cat-features',
    name: 'Booking System',
    slug: 'booking-system',
    description: 'Interactive scheduling calendar allowing users to book appointments and consultations online.',
    price: 10000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-payment-gateway',
    categoryId: 'cat-features',
    name: 'Payment Gateway',
    slug: 'payment-gateway',
    description: 'Secure SSL checkout integration supporting credit cards, UPI, and net banking.',
    price: 12000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-admin-dashboard',
    categoryId: 'cat-features',
    name: 'Admin Dashboard',
    slug: 'admin-dashboard',
    description: 'Centralized admin interface to manage orders, products, users, or content analytics.',
    price: 20000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-user-login',
    categoryId: 'cat-features',
    name: 'User Login',
    slug: 'user-login',
    description: 'Secure user registration, profile dashboard, and account authentication portal.',
    price: 10000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-multi-lang',
    categoryId: 'cat-features',
    name: 'Multi-language',
    slug: 'multi-language',
    description: 'Multi-lingual translation support allowing users to toggle between international languages.',
    price: 12000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Category 3: Integrations & Automations (cat-automation)
  {
    id: 'feat-ai-chatbot',
    categoryId: 'cat-automation',
    name: 'AI Chatbot',
    slug: 'ai-chatbot',
    description: 'Intelligent AI-driven automated chatbot for custom customer support desks.',
    price: 25000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-whatsapp-auto',
    categoryId: 'cat-automation',
    name: 'WhatsApp Automation',
    slug: 'whatsapp-automation',
    description: 'Auto-reply, invoice sharing, and notification triggers sent directly to client WhatsApp numbers.',
    price: 15000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-crm-integration',
    categoryId: 'cat-automation',
    name: 'CRM Integration',
    slug: 'crm-integration',
    description: 'Binding leads forms directly into sales systems like Zoho, HubSpot, or Salesforce.',
    price: 15000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 13,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-api-integration',
    categoryId: 'cat-automation',
    name: 'API Integration (per API)',
    slug: 'api-integration',
    description: 'Custom server connection binding to external software APIs.',
    price: 8000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 14,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-live-chat',
    categoryId: 'cat-automation',
    name: 'Live Chat',
    slug: 'live-chat',
    description: 'Floating customer service live chat drawer widget.',
    price: 3000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Category 4: Setup & Deployment (cat-setup)
  {
    id: 'feat-email-setup',
    categoryId: 'cat-setup',
    name: 'Business Email Setup',
    slug: 'business-email-setup',
    description: 'Custom corporate mailbox layout matching your domain (e.g. name@brand.com).',
    price: 2000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 16,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feat-hosting-setup',
    categoryId: 'cat-setup',
    name: 'Hosting Setup',
    slug: 'hosting-setup',
    description: 'Configuring domain registration, nameservers, server environment, and SSL protocols.',
    price: 3000,
    pricingType: 'fixed',
    defaultSelected: false,
    isActive: true,
    sortOrder: 17,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Fetch all addon features, optionally filtered by category and sorted by sortOrder */
export async function getAddons(
  categoryId?: string,
  onlyActive = false
): Promise<AddonFeature[]> {
  if (!hasCredentials) {
    let list = DEFAULT_ADDON_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }

  try {
    const cacheKey = `addons:category:${categoryId || 'all'}:onlyActive:${onlyActive}`;
    const cached = getCache<AddonFeature[]>(cacheKey);
    if (cached) return cached;
    let queryRef: FirebaseFirestore.Query = adminDb.collection(COLLECTIONS.ADDON_FEATURES);
    
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
    })) as AddonFeature[];

    // Sort in-memory to bypass composite index requirements
    const sorted = list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    setCache(cacheKey, sorted, 3600);
    return sorted;
  } catch (error: unknown) {
    // Quiet fallback to static assets
    let list = DEFAULT_ADDON_FEATURES;
    if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
    if (onlyActive) list = list.filter((f) => f.isActive);
    return list;
  }
}

/** Fetch a single addon feature by ID */
export async function getAddonById(id: string): Promise<AddonFeature | null> {
  if (!hasCredentials) {
    return DEFAULT_ADDON_FEATURES.find((f) => f.id === id) || null;
  }

  try {
    const docSnap = await adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as AddonFeature;
  } catch (error) {
    console.error(`Error fetching addon by ID (${id}):`, error);
    return DEFAULT_ADDON_FEATURES.find((f) => f.id === id) || null;
  }
}
