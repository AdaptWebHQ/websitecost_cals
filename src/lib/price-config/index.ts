import { adminDb } from '@/firebase/admin';
import { COLLECTIONS, DEFAULT_PRICE_CONFIG } from '@/constants';
import type { PriceConfig } from '@/types';

// Check if credentials are loaded to verify whether database is fully queryable
const hasCredentials = 
  !!process.env.FIREBASE_PROJECT_ID && 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY;

// Baseline fallback price configuration returned when Firebase credentials are empty
export const STATIC_PRICE_CONFIG: PriceConfig = {
  id: 'global',
  ...DEFAULT_PRICE_CONFIG,
  companyName: 'AdaptWeb IT Solutions',
  companyEmail: 'quotations@adaptweb.com',
  companyPhone: '+919342624226, +918072268570',
  companyAddress: '123 Innovation Drive\nTech District\nSan Francisco, CA 94103',
  termsAndConditions: '1. Quotations generated dynamically are valid for 30 days.\n2. Design phase commences post initial 50% retainer.\n3. Revisions outside scope billed at standard rate.',
  pdfFooter: 'Thank you for choosing AdaptWeb.',
  privacyPolicy: 'Your details are stored securely.',
  isCalculatorEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/** Fetch the singleton global pricing configuration from Firestore. Creates default if not exists. */
export async function getPriceConfig(): Promise<PriceConfig> {
  if (!hasCredentials) {
    return STATIC_PRICE_CONFIG;
  }

  try {
    const docRef = adminDb.collection(COLLECTIONS.PRICE_CONFIG).doc('global');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        id: 'global',
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as PriceConfig;
    }

    // Initialize with default config if not found
    const now = new Date();
    const initialConfig = {
      ...DEFAULT_PRICE_CONFIG,
      companyName: 'AdaptWeb IT Solutions',
      companyEmail: 'quotations@adaptweb.com',
      companyPhone: '+919342624226, +918072268570',
      companyAddress: '123 Innovation Drive\nTech District\nSan Francisco, CA 94103',
      companyVat: 'VAT-US-987654321',
      termsAndConditions: '1. Quotations generated dynamically are valid for 30 days.\n2. Design revisions apply strictly to baseline themes before code phases.\n3. Content provisioning is the client\'s responsibility.',
      pdfFooter: 'Thank you for choosing AdaptWeb.',
      privacyPolicy: 'Your details are stored securely.',
      isCalculatorEnabled: true,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(initialConfig);
    return {
      id: 'global',
      ...initialConfig,
    };
  } catch (error: unknown) {
    // Quiet fallback to static assets
    return STATIC_PRICE_CONFIG;
  }
}
