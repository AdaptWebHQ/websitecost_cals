'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import { slugify } from '@/lib/utils';
import type { ApiResponse } from '@/types';

interface SeedDataFormat {
  category: {
    name: string;
    slug: string;
    description: string;
    icon: string;
  };
  serviceTypes: { name: string; description: string; icon: string; sortOrder: number }[];
  packages: { name: string; description: string; basePrice: number; deliveryDays: number; pagesIncluded: number; revisions: number; isPopular: boolean }[];
  industries: { name: string; description: string; sortOrder: number }[];
  featureCategories: { name: string; icon: string; displayOrder: number; features: string[] }[];
  addonCategories: { name: string; icon: string; sortOrder: number; addons: { name: string; description: string; pricingType: 'fixed' | 'per_page' | 'percentage'; price: number }[] }[];
}

const TEMPLATES: Record<string, SeedDataFormat> = {
  'website-development': {
    category: {
      name: 'Website Development',
      slug: 'website-development',
      description: 'Custom high-performance websites, landing pages, and web portals.',
      icon: 'Globe',
    },
    serviceTypes: [
      { name: 'Informational Website', description: 'Multi-page business showcase site with CMS.', icon: 'Layers', sortOrder: 1 },
      { name: 'Landing Page', description: 'High-conversion single page lead funnel.', icon: 'FileText', sortOrder: 2 },
      { name: 'Blog / Publisher', description: 'Content platform optimized for SEO and readability.', icon: 'Edit', sortOrder: 3 },
    ],
    packages: [
      { name: 'Starter Website', description: 'Perfect for small local businesses.', basePrice: 1500, deliveryDays: 7, pagesIncluded: 5, revisions: 2, isPopular: false },
      { name: 'Premium Business', description: 'Full business site with custom styling and CMS integrations.', basePrice: 3500, deliveryDays: 14, pagesIncluded: 15, revisions: 5, isPopular: true },
    ],
    industries: [
      { name: 'Real Estate', description: 'Brokers, agents, and listing sites.', sortOrder: 1 },
      { name: 'Medical / Healthcare', description: 'Clinics, dental practices, and private doctors.', sortOrder: 2 },
      { name: 'Professional Services', description: 'Law firms, accountants, consultants.', sortOrder: 3 },
    ],
    featureCategories: [
      {
        name: 'Website Structure',
        icon: 'Layers',
        displayOrder: 1,
        features: ['Home Page', 'About Page', 'Services Directory', 'Contact Page with Map'],
      },
      {
        name: 'Content & CMS',
        icon: 'Edit',
        displayOrder: 2,
        features: ['Sanity / WordPress CMS Syncing', 'Blog Publishing Hub', 'Media Asset Gallery'],
      },
    ],
    addonCategories: [
      {
        name: 'Integrations & Booking',
        icon: 'Plug',
        sortOrder: 1,
        addons: [
          { name: 'Cal.com / Calendly Scheduler Sync', description: 'Online scheduler widget.', pricingType: 'fixed', price: 250 },
          { name: 'Live Chat Widget Integration', description: 'Crisp or HubSpot live chat bubble.', pricingType: 'fixed', price: 150 },
        ],
      },
    ],
  },
  'ecommerce-development': {
    category: {
      name: 'E-commerce Development',
      slug: 'ecommerce-development',
      description: 'Online store fronts, catalog portals, and secure shopping carts.',
      icon: 'ShoppingCart',
    },
    serviceTypes: [
      { name: 'Shopify Storefront', description: 'Custom Shopify 2.0 template configuration.', icon: 'ShoppingCart', sortOrder: 1 },
      { name: 'WooCommerce Store', description: 'Self-hosted WordPress e-commerce solution.', icon: 'Layers', sortOrder: 2 },
      { name: 'Custom Next.js Headless Shop', description: 'High-performance headless checkout.', icon: 'Zap', sortOrder: 3 },
    ],
    packages: [
      { name: 'Standard Shopify Setup', description: 'Store template with standard gateways.', basePrice: 2500, deliveryDays: 10, pagesIncluded: 8, revisions: 3, isPopular: true },
      { name: 'Custom Headless Enterprise', description: 'Completely customized e-commerce engine.', basePrice: 8500, deliveryDays: 30, pagesIncluded: -1, revisions: 99, isPopular: false },
    ],
    industries: [
      { name: 'Fashion & Apparel', description: 'Clothing stores, shoe lines, boutique fashion.', sortOrder: 1 },
      { name: 'Food & Grocery', description: 'Online supermarkets, local food delivery hubs.', sortOrder: 2 },
      { name: 'Consumer Electronics', description: 'Hardware, gadgets, and accessories stores.', sortOrder: 3 },
    ],
    featureCategories: [
      {
        name: 'Catalog & Products',
        icon: 'ShoppingCart',
        displayOrder: 1,
        features: ['Product Details View', 'Category Filtering system', 'Reviews & Ratings section'],
      },
    ],
    addonCategories: [
      {
        name: 'Advanced Gateways',
        icon: 'CreditCard',
        sortOrder: 1,
        addons: [
          { name: 'Stripe Multi-currency checkout', description: 'Handle local currencies dynamically.', pricingType: 'fixed', price: 500 },
          { name: 'Afterpay / Klarna BNPL Gateway', description: 'Integrate buy-now-pay-later modules.', pricingType: 'fixed', price: 350 },
        ],
      },
    ],
  },
  'mobile-app-development': {
    category: {
      name: 'Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Native iOS, Android, and cross-platform mobile apps.',
      icon: 'Smartphone',
    },
    serviceTypes: [
      { name: 'React Native / Flutter App', description: 'Cross-platform mobile client.', icon: 'Smartphone', sortOrder: 1 },
      { name: 'Native iOS Client', description: 'SwiftUI premium native app.', icon: 'Smartphone', sortOrder: 2 },
      { name: 'Native Android Client', description: 'Kotlin jetpack native client.', icon: 'Smartphone', sortOrder: 3 },
    ],
    packages: [
      { name: 'MVP Launch Tier', description: 'Basic application layout with static contents.', basePrice: 8000, deliveryDays: 20, pagesIncluded: 10, revisions: 3, isPopular: false },
      { name: 'Standard App Shell', description: 'Dynamic dashboard app with database API sync.', basePrice: 15000, deliveryDays: 45, pagesIncluded: 25, revisions: 5, isPopular: true },
    ],
    industries: [
      { name: 'On-demand Delivery', description: 'Uber-style driver and customer clients.', sortOrder: 1 },
      { name: 'Fitness & Health', description: 'Workout trainers, macro tracking apps.', sortOrder: 2 },
    ],
    featureCategories: [
      {
        name: 'App Essentials',
        icon: 'Smartphone',
        displayOrder: 1,
        features: ['Email/Password Registration', 'Profile Customization UI', 'Local App Push Notifications'],
      },
    ],
    addonCategories: [
      {
        name: 'Device Integrations',
        icon: 'Plug',
        sortOrder: 1,
        addons: [
          { name: 'FaceID / Biometric Login Sync', description: 'Fast biometric device lock login.', pricingType: 'fixed', price: 300 },
          { name: 'Apple HealthKit / Google Fit Sync', description: 'Retrieve step and health metadata.', pricingType: 'fixed', price: 950 },
        ],
      },
    ],
  },
};

export async function seedServiceCategoryTemplateAction(
  templateKey: string
): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return { success: false, error: 'Unauthorized.' };
    }

    let seed = TEMPLATES[templateKey];
    if (!seed) {
      // Fallback fallback generator for custom templates to guarantee dynamic creation
      const name = templateKey
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      seed = {
        category: {
          name,
          slug: templateKey,
          description: `Custom generated ${name} services ecosystem.`,
          icon: 'Layers',
        },
        serviceTypes: [
          { name: `${name} Standard`, description: `Baseline configuration template for ${name}.`, icon: 'Layers', sortOrder: 1 },
        ],
        packages: [
          { name: `Basic ${name} Plan`, description: `Starter package config.`, basePrice: 1000, deliveryDays: 14, pagesIncluded: 5, revisions: 3, isPopular: true },
        ],
        industries: [
          { name: 'General Business', description: 'Standard industrial vertical.', sortOrder: 1 },
        ],
        featureCategories: [
          { name: 'Standard Features', icon: 'Layers', displayOrder: 1, features: ['Initial consultation', 'Project setup'] },
        ],
        addonCategories: [
          { name: 'Standard Addons', icon: 'Plug', sortOrder: 1, addons: [{ name: 'Priority Support Addon', description: '24/7 client portal chat.', pricingType: 'fixed', price: 200 }] },
        ],
      };
    }

    // Verify slug uniqueness
    const slugSnap = await adminDb
      .collection(COLLECTIONS.SERVICE_CATEGORIES)
      .where('slug', '==', seed.category.slug)
      .limit(1)
      .get();
    if (!slugSnap.empty) {
      return { success: false, error: `A Service Category with slug "${seed.category.slug}" already exists.` };
    }

    const newCategoryRef = adminDb.collection(COLLECTIONS.SERVICE_CATEGORIES).doc();
    const catId = newCategoryRef.id;

    const now = new Date();
    const batch = adminDb.batch();

    // 1. Create Category
    batch.set(newCategoryRef, {
      id: catId,
      name: seed.category.name,
      slug: seed.category.slug,
      description: seed.category.description,
      icon: seed.category.icon,
      isActive: true,
      displayOrder: 1,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Service Types
    const typeRefs: string[] = [];
    seed.serviceTypes.forEach(t => {
      const ref = adminDb.collection(COLLECTIONS.SERVICE_TYPES).doc();
      batch.set(ref, {
        id: ref.id,
        serviceCategoryId: catId,
        name: t.name,
        slug: slugify(t.name),
        description: t.description,
        icon: t.icon,
        isActive: true,
        sortOrder: t.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      typeRefs.push(ref.id);
    });

    // 3. Packages
    const packageRefs: string[] = [];
    seed.packages.forEach(p => {
      const ref = adminDb.collection(COLLECTIONS.PACKAGES).doc();
      batch.set(ref, {
        id: ref.id,
        serviceCategoryId: catId,
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        basePrice: p.basePrice,
        deliveryDays: p.deliveryDays,
        pagesIncluded: p.pagesIncluded,
        revisions: p.revisions,
        isPopular: p.isPopular,
        isActive: true,
        sortOrder: 1,
        includedFeatureIds: [],
        createdAt: now,
        updatedAt: now,
      });
      packageRefs.push(ref.id);
    });

    // 4. Industries
    seed.industries.forEach(ind => {
      const ref = adminDb.collection(COLLECTIONS.INDUSTRIES).doc();
      batch.set(ref, {
        id: ref.id,
        serviceCategoryId: catId,
        name: ind.name,
        slug: slugify(ind.name),
        description: ind.description,
        basePrice: 0,
        recommendedPackageId: packageRefs[0] || '',
        isActive: true,
        sortOrder: ind.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
    });

    // 5. Feature Categories & Features
    seed.featureCategories.forEach(fc => {
      const catRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURE_CATEGORIES).doc();
      batch.set(catRef, {
        id: catRef.id,
        serviceCategoryId: catId,
        name: fc.name,
        description: `Library category for ${fc.name}`,
        icon: fc.icon,
        isActive: true,
        displayOrder: fc.displayOrder,
        createdAt: now,
        updatedAt: now,
      });

      fc.features.forEach((featName, index) => {
        const featRef = adminDb.collection(COLLECTIONS.PACKAGE_FEATURES).doc();
        batch.set(featRef, {
          id: featRef.id,
          serviceCategoryId: catId,
          categoryId: catRef.id,
          name: featName,
          description: `Preset description for ${featName}`,
          isActive: true,
          displayOrder: index + 1,
          packageIds: [],
          isRequired: false,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    // 6. Addon Categories & Addon Features
    seed.addonCategories.forEach(ac => {
      const catRef = adminDb.collection(COLLECTIONS.ADDON_CATEGORIES).doc();
      batch.set(catRef, {
        id: catRef.id,
        serviceCategoryId: catId,
        name: ac.name,
        description: `Addons for ${ac.name}`,
        icon: ac.icon,
        isActive: true,
        sortOrder: ac.sortOrder,
        createdAt: now,
        updatedAt: now,
      });

      ac.addons.forEach((ad, index) => {
        const adRef = adminDb.collection(COLLECTIONS.ADDON_FEATURES).doc();
        batch.set(adRef, {
          id: adRef.id,
          serviceCategoryId: catId,
          categoryId: catRef.id,
          name: ad.name,
          slug: slugify(ad.name),
          description: ad.description,
          pricingType: ad.pricingType,
          price: ad.price,
          defaultSelected: false,
          isActive: true,
          sortOrder: index + 1,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    // Commit batch
    await batch.commit();

    return {
      success: true,
      data: catId,
      message: 'Template seeded successfully.',
    };
  } catch (error: unknown) {
    console.error('Error seeding template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to seed template.',
    };
  }
}
