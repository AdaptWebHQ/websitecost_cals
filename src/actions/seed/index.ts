'use strict';

'use server';

import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';
import { getServerUser } from '@/actions/auth';
import type { ApiResponse } from '@/types';

/** Secure Server Action to seed Firestore database collections with default master values. Admin only. */
export async function seedDatabaseAction(): Promise<ApiResponse<string>> {
  try {
    const user = await getServerUser();
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return {
        success: false,
        error: 'Unauthorized. Administrator credentials required.',
      };
    }

    const batch = adminDb.batch();

    // 1. Seed Packages
    const packages = [
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

    packages.forEach((pkg) => {
      const ref = adminDb.collection(COLLECTIONS.PACKAGES).doc(pkg.id);
      batch.set(ref, pkg);
    });

    // 2. Seed Feature Categories
    const categories = [
      {
        id: 'cat-core',
        name: 'Core Design & Layout',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-integrations',
        name: 'CMS & Custom Integrations',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-marketing',
        name: 'SEO & Marketing Support',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    categories.forEach((cat) => {
      const ref = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(cat.id);
      batch.set(ref, cat);
    });

    // 3. Seed Features
    const features = [
      {
        id: 'feat-theme',
        categoryId: 'cat-core',
        name: 'Custom Tailored UI/UX Design',
        description: 'Bespoke Figma prototype converted to custom Tailwind code without using stock layouts.',
        price: 15000,
        pricingType: 'fixed', // adds flat 15,000
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-cms',
        categoryId: 'cat-integrations',
        name: 'Headless CMS Dashboard Integration',
        description: 'Allows editing content, media files, and services from a clean web panel interface.',
        price: 10000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-payments',
        categoryId: 'cat-integrations',
        name: 'Razorpay / Stripe Gateway Binding',
        description: 'Secure SSL checkout integration supporting UPI, Credit Cards, and recurring plans.',
        price: 5000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-seo',
        categoryId: 'cat-marketing',
        name: 'Advanced On-Page SEO Scopes',
        description: 'Configuring metadata, sitemaps, open-graph cards, and structured schema tags.',
        price: 500,
        pricingType: 'per_page', // adds 500 per page
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-chat',
        categoryId: 'cat-integrations',
        name: 'Live Chat / WhatsApp Widget',
        description: 'Floating chat drawer connected directly to support lines or CRM desks.',
        price: 2500,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    features.forEach((feat) => {
      const ref = adminDb.collection(COLLECTIONS.FEATURES).doc(feat.id);
      batch.set(ref, feat);
    });

    // 4. Seed Industries
    const industries = [
      {
        id: 'ind-tech',
        name: 'Technology & SaaS Enterprises',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ind-retail',
        name: 'Retail, E-commerce, & Logistics',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ind-finance',
        name: 'Finance, Banking & Insurtech',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ind-healthcare',
        name: 'Healthcare, Clinical & Well-being',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    industries.forEach((ind) => {
      const ref = adminDb.collection(COLLECTIONS.INDUSTRIES).doc(ind.id);
      batch.set(ref, ind);
    });

    // 5. Seed Price Config (Check if exists first, otherwise seed default)
    const configRef = adminDb.collection(COLLECTIONS.PRICE_CONFIG).doc('default');
    const configSnap = await configRef.get();
    if (!configSnap.exists) {
      batch.set(configRef, {
        isCalculatorEnabled: true,
        gstPercentage: 18,
        rushDeliveryPercentage: 25,
        quotationValidityDays: 30,
        companyName: 'WebCost Pro Solutions Ltd.',
        companyEmail: 'quotations@webcostpro.com',
        companyPhone: '+91 98765 43210',
        companyAddress: '404 Suite, Cyber Towers, Hitec City, Hyderabad, TG, India',
        termsAndConditions: '1. Quotations generated dynamically are valid for 30 days.\n2. Design revisions apply strictly to baseline themes before code phases.\n3. Content provisioning is the client\'s responsibility.',
        supportEmail: 'support@webcostpro.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await batch.commit();

    return {
      success: true,
      data: 'Database seeded successfully with default packages, features, categories, sectors, and configurations!',
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: 'Failed to seed default database tables.',
    };
  }
}
