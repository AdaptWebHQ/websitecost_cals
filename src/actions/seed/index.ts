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
    const existingPackagesSnap = await adminDb.collection(COLLECTIONS.PACKAGES).get();
    existingPackagesSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const packages = [
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

    packages.forEach((pkg) => {
      const ref = adminDb.collection(COLLECTIONS.PACKAGES).doc(pkg.id);
      batch.set(ref, pkg);
    });

    // 2. Seed Feature Categories
    const existingCatsSnap = await adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).get();
    existingCatsSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const categories = [
      {
        id: 'cat-design',
        name: 'Design & Content',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-features',
        name: 'Features & Modules',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-automation',
        name: 'Integrations & Automations',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-setup',
        name: 'Setup & Deployment',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    categories.forEach((cat) => {
      const ref = adminDb.collection(COLLECTIONS.FEATURE_CATEGORIES).doc(cat.id);
      batch.set(ref, cat);
    });

    // 3. Seed Features
    const existingFeatsSnap = await adminDb.collection(COLLECTIONS.FEATURES).get();
    existingFeatsSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const features = [
      // Design & Content
      {
        id: 'feat-extra-page',
        categoryId: 'cat-design',
        name: 'Extra Page',
        description: 'Additional custom designed pages beyond the package inclusion.',
        price: 2000,
        pricingType: 'per_page',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-logo',
        categoryId: 'cat-design',
        name: 'Logo Design',
        description: 'Custom professional vector logo design for your brand.',
        price: 8000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-brand-kit',
        categoryId: 'cat-design',
        name: 'Brand Identity Kit',
        description: 'Complete brand guide, typography layout, color codes, and social templates.',
        price: 15000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-copywriting',
        categoryId: 'cat-design',
        name: 'Copywriting',
        description: 'Professional sales copy and SEO optimized text content written for all pages.',
        price: 10000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Features & Modules
      {
        id: 'feat-blog-cms',
        categoryId: 'cat-features',
        name: 'Blog/CMS',
        description: 'Content Management System (CMS) to publish posts, news articles, or case studies.',
        price: 8000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-booking',
        categoryId: 'cat-features',
        name: 'Booking System',
        description: 'Interactive scheduling calendar allowing users to book appointments and consultations online.',
        price: 10000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-payment-gateway',
        categoryId: 'cat-features',
        name: 'Payment Gateway',
        description: 'Secure SSL checkout integration supporting credit cards, UPI, and net banking.',
        price: 12000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-admin-dashboard',
        categoryId: 'cat-features',
        name: 'Admin Dashboard',
        description: 'Centralized admin interface to manage orders, products, users, or content analytics.',
        price: 20000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-user-login',
        categoryId: 'cat-features',
        name: 'User Login',
        description: 'Secure user registration, profile dashboard, and account authentication portal.',
        price: 10000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-multi-lang',
        categoryId: 'cat-features',
        name: 'Multi-language',
        description: 'Multi-lingual translation support allowing users to toggle between international languages.',
        price: 12000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Integrations & Automations
      {
        id: 'feat-ai-chatbot',
        categoryId: 'cat-automation',
        name: 'AI Chatbot',
        description: 'Intelligent AI-driven automated chatbot for custom customer support desks.',
        price: 25000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-whatsapp-auto',
        categoryId: 'cat-automation',
        name: 'WhatsApp Automation',
        description: 'Auto-reply, invoice sharing, and notification triggers sent directly to client WhatsApp numbers.',
        price: 15000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-crm-integration',
        categoryId: 'cat-automation',
        name: 'CRM Integration',
        description: 'Binding leads forms directly into sales systems like Zoho, HubSpot, or Salesforce.',
        price: 15000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-api-integration',
        categoryId: 'cat-automation',
        name: 'API Integration (per API)',
        description: 'Custom server connection binding to external software APIs.',
        price: 8000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-live-chat',
        categoryId: 'cat-automation',
        name: 'Live Chat',
        description: 'Floating customer service live chat drawer widget.',
        price: 3000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Setup & Deployment
      {
        id: 'feat-email-setup',
        categoryId: 'cat-setup',
        name: 'Business Email Setup',
        description: 'Custom corporate mailbox layout matching your domain (e.g. name@brand.com).',
        price: 2000,
        pricingType: 'fixed',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'feat-hosting-setup',
        categoryId: 'cat-setup',
        name: 'Hosting Setup',
        description: 'Configuring domain registration, nameservers, server environment, and SSL protocols.',
        price: 3000,
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
