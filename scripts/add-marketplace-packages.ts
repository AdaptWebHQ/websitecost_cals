import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

let serviceAccount: any = null;
const serviceAccountPath = path.resolve(process.cwd(), "secrets/firebase-admin.json");

if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } catch (err) {
    console.error("❌ Failed to parse secrets/firebase-admin.json:", err);
  }
}

if (serviceAccount) {
  initializeApp({ credential: cert(serviceAccount) });
} else if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/"/g, ""),
    }),
  });
} else {
  console.error("❌ Error: Firebase Admin credentials not found.");
  process.exit(1);
}

const db = getFirestore();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function run() {
  console.log("🚀 Starting Marketplace Website Packages and Features Migration...");

  // 1. Find Website Development Service Category
  const categoriesSnap = await db.collection("service_categories").get();
  const websiteCatDoc = categoriesSnap.docs.find(
    (d) =>
      d.id === "sc-website" ||
      d.data().slug === "website-development" ||
      d.data().name?.toLowerCase().includes("website")
  );

  if (!websiteCatDoc) {
    console.error("❌ Could not find Website Development category.");
    process.exit(1);
  }

  const serviceCategoryId = websiteCatDoc.id;
  console.log(`✅ Found Category: ${websiteCatDoc.data().name} (${serviceCategoryId})`);

  // 2. Find or Create Marketplace Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let marketplaceTypeDoc = serviceTypesSnap.docs.find(
    (d) =>
      d.data().name?.toLowerCase().includes("marketplace") ||
      d.data().slug?.includes("marketplace")
  );

  let serviceTypeId = "";

  if (!marketplaceTypeDoc) {
    console.log("Creating 'Marketplace Website' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Marketplace Website",
      slug: "marketplace-website",
      description: "Multi-vendor marketplaces connecting buyers and sellers with commission management.",
      icon: "Store",
      sortOrder: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Marketplace Website Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = marketplaceTypeDoc.id;
    console.log(`✅ Found Marketplace Website Service Type: ${marketplaceTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const featureCatDefinitions: { name: string; icon: string; displayOrder: number }[] = [
    { name: "Website Structure", icon: "Layers", displayOrder: 1 },
    { name: "Design & Experience", icon: "Layout", displayOrder: 2 },
    { name: "Marketplace", icon: "Store", displayOrder: 3 },
    { name: "E-commerce", icon: "ShoppingCart", displayOrder: 4 },
    { name: "Authentication", icon: "Key", displayOrder: 5 },
    { name: "Business Features", icon: "Briefcase", displayOrder: 6 },
    { name: "SEO & Performance", icon: "Search", displayOrder: 7 },
    { name: "Security", icon: "Shield", displayOrder: 8 },
    { name: "Deployment", icon: "Server", displayOrder: 9 },
    { name: "Support", icon: "Headphones", displayOrder: 10 },
    { name: "Analytics", icon: "TrendingUp", displayOrder: 11 },
    { name: "Performance", icon: "Gauge", displayOrder: 12 },
    { name: "Enterprise Features", icon: "Zap", displayOrder: 13 },
  ];

  const existingFeatureCatsSnap = await db
    .collection("package_feature_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const featureCategoryMap: Record<string, string> = {};

  for (const catDef of featureCatDefinitions) {
    const existing = existingFeatureCatsSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === catDef.name.toLowerCase().trim()
    );

    if (existing) {
      featureCategoryMap[catDef.name] = existing.id;
    } else {
      const catRef = db.collection("package_feature_categories").doc();
      await catRef.set({
        serviceCategoryId,
        name: catDef.name,
        icon: catDef.icon,
        displayOrder: catDef.displayOrder,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catDef.name] = catRef.id;
      console.log(`✅ Created Feature Category: ${catDef.name} (${catRef.id})`);
    }
  }

  // 4. Feature Definitions for Marketplace Packages
  const professionalFeaturesDef: { category: string; name: string; description: string }[] = [
    // Website Structure
    { category: "Website Structure", name: "Home Page Layout", description: "Marketplace storefront home page." },
    { category: "Website Structure", name: "Shop Catalog Page", description: "Browse all vendor products catalog." },
    { category: "Website Structure", name: "Product Categories View", description: "Multi-level category navigation." },
    { category: "Website Structure", name: "Product Details Page", description: "Detailed product view with vendor info." },
    { category: "Website Structure", name: "Vendor Store Front", description: "Dedicated public vendor storefront page." },
    { category: "Website Structure", name: "Contact Page with Map", description: "Interactive contact page." },
    { category: "Website Structure", name: "Privacy Policy Page", description: "Legal privacy policy document page." },
    { category: "Website Structure", name: "Terms & Conditions Page", description: "Legal terms of service page." },
    { category: "Website Structure", name: "Custom 404 Page", description: "Custom branded 404 error page." },
    // Marketplace
    { category: "Marketplace", name: "Vendor Registration", description: "Public vendor onboarding & application form." },
    { category: "Marketplace", name: "Vendor Approval Workflow", description: "Admin approval queue for new sellers." },
    { category: "Marketplace", name: "Vendor Portal Login", description: "Secure seller login portal." },
    { category: "Marketplace", name: "Vendor Dashboard", description: "Seller control panel for managing store operations." },
    { category: "Marketplace", name: "Vendor Store Profile", description: "Seller profile customization (logo, banner, bio)." },
    { category: "Marketplace", name: "Vendor Product Management", description: "Sellers can add, edit, and manage products." },
    { category: "Marketplace", name: "Vendor Order Management", description: "Sellers can process and ship incoming orders." },
    { category: "Marketplace", name: "Vendor Earnings Overview", description: "Sellers track sales revenue and balance." },
    // E-commerce
    { category: "E-commerce", name: "Shopping Cart", description: "Multi-item multi-vendor shopping cart." },
    { category: "E-commerce", name: "Unified Checkout", description: "Single seamless checkout for multi-vendor carts." },
    { category: "E-commerce", name: "Online Payment Gateways", description: "Stripe, Razorpay, or PayPal integration." },
    { category: "E-commerce", name: "Customer Portal Login", description: "Customer account registration and login." },
    { category: "E-commerce", name: "Order History & Tracking", description: "Customers view order history and shipping status." },
    { category: "E-commerce", name: "Product Reviews & Ratings", description: "Customer product ratings and feedback." },
    { category: "E-commerce", name: "Customer Wishlist", description: "Save products to personal wishlists." },
    // Authentication
    { category: "Authentication", name: "Customer Auth", description: "Customer login & password management." },
    { category: "Authentication", name: "Vendor Auth", description: "Vendor dashboard authentication." },
    { category: "Authentication", name: "Admin Portal Auth", description: "Master admin dashboard login." },
    // SEO & Performance
    { category: "SEO & Performance", name: "Technical SEO Optimization", description: "On-page and meta tag SEO setup." },
    { category: "SEO & Performance", name: "XML Sitemap Generator", description: "Dynamic XML sitemap auto-generation." },
    { category: "SEO & Performance", name: "Robots.txt Configuration", description: "Optimized search crawler instructions." },
    // Deployment & Support
    { category: "Deployment", name: "Cloud Hosting Configuration", description: "Server deployment setup." },
    { category: "Deployment", name: "SSL Certificate Setup", description: "HTTPS SSL encryption security certificate." },
    { category: "Deployment", name: "Custom Domain Connection", description: "DNS domain mapping and routing." },
    { category: "Support", name: "6 Months Support", description: "6 months included bug fixes and maintenance." },
  ];

  const businessFeaturesDef: { category: string; name: string; description: string }[] = [
    // Marketplace
    { category: "Marketplace", name: "Commission Management", description: "Configure global or vendor-specific percentage/flat commission splits." },
    { category: "Marketplace", name: "Vendor Verification System", description: "KYC and business document verification process." },
    { category: "Marketplace", name: "Vendor Performance Analytics", description: "Detailed seller sales & fulfillment analytics." },
    { category: "Marketplace", name: "Vendor Email Notifications", description: "Automated SMS/Email order alerts to sellers." },
    { category: "Marketplace", name: "Vendor Payout Requests", description: "Sellers request balance withdrawals to bank accounts." },
    { category: "Marketplace", name: "Vendor Coupon System", description: "Sellers can create promotional discount codes." },
    // E-commerce
    { category: "E-commerce", name: "Multi-Store Inventory Sync", description: "Centralized stock control and variant inventory." },
    { category: "E-commerce", name: "Vendor Shipping Management", description: "Configure shipping rates per seller or location." },
    { category: "E-commerce", name: "Returns Management", description: "RMA customer return requests and vendor approvals." },
    { category: "E-commerce", name: "Refund Processing", description: "Partial and full refund management." },
    { category: "E-commerce", name: "Automated Invoice Generation", description: "Multi-seller PDF tax invoices and receipts." },
    // Business Features
    { category: "Business Features", name: "CRM System Integration", description: "Sync customer & vendor leads to CRM." },
    { category: "Business Features", name: "Master Sales Reports", description: "Comprehensive marketplace financial reports." },
    { category: "Business Features", name: "Marketplace Analytics Dashboard", description: "Executive KPI dashboard for site owner." },
    { category: "Business Features", name: "Transactional Email Notifications", description: "Automated customer, vendor, and admin notification emails." },
    // Authentication, Security, Support
    { category: "Authentication", name: "Role Based Access Control", description: "Custom admin and staff permission levels." },
    { category: "Security", name: "Audit Trail Logs", description: "Track all admin and vendor activity logs." },
    { category: "Support", name: "Priority Support Line", description: "Dedicated priority ticket & phone support." },
    { category: "Support", name: "Full Source Code Ownership", description: "Complete unencrypted source code repository." },
  ];

  const enterpriseFeaturesDef: { category: string; name: string; description: string }[] = [
    // Marketplace
    { category: "Marketplace", name: "Multi-country Vendors", description: "Global seller registration and cross-border shipping." },
    { category: "Marketplace", name: "Multi-language Localization", description: "Multilingual marketplace interface for global markets." },
    { category: "Marketplace", name: "Multi-currency Auto Exchange", description: "Real-time currency conversions and localized pricing." },
    { category: "Marketplace", name: "Vendor REST/GraphQL API", description: "Programmatic API for vendors to sync inventory automatically." },
    { category: "Marketplace", name: "Automated Commission Settlement", description: "Direct Stripe Connect or Razorpay Route automated payout splits." },
    // Enterprise
    { category: "Enterprise Features", name: "Enterprise ERP Sync", description: "Bi-directional integration with SAP, Oracle, or NetSuite." },
    { category: "Enterprise Features", name: "Automated Payment Split", description: "Instant gateway-level split payouts to sellers at checkout." },
    { category: "Enterprise Features", name: "Tax Automation Engine", description: "Automated GST/VAT tax calculation per seller jurisdiction." },
    { category: "Enterprise Features", name: "Workflow Automation Engine", description: "Custom automated triggers and business process rules." },
    { category: "Enterprise Features", name: "Custom API Integrations", description: "Bespoke third-party software and logistics API links." },
    // Analytics
    { category: "Analytics", name: "Business Intelligence Suite", description: "Advanced BI data modeling and cohort analytics." },
    { category: "Analytics", name: "Custom Executive Reports", description: "Tailored report builder for enterprise metrics." },
    { category: "Analytics", name: "Live Revenue Dashboard", description: "Real-time revenue monitoring and forecasting." },
    // Performance
    { category: "Performance", name: "Global CDN Acceleration", description: "Fast static asset delivery via Cloudflare/CloudFront CDN." },
    { category: "Performance", name: "Auto Scaling Infrastructure", description: "Dynamic server capacity scaling during high-traffic sales." },
    { category: "Performance", name: "Background Queue Processing", description: "Redis/BullMQ asynchronous task queues for fast responses." },
    { category: "Performance", name: "Real-time APM Tracing", description: "Performance tracing and proactive crash monitoring." },
    // Security
    { category: "Security", name: "Enterprise Hardened Security", description: "WAF, DDoS mitigation, and vulnerability penetration testing." },
    { category: "Security", name: "Automated Cloud Backups", description: "Daily automated encrypted database snapshots." },
    { category: "Security", name: "Disaster Recovery Protocol", description: "High-availability multi-region fallback redundancy." },
    // Support
    { category: "Support", name: "Dedicated Account Manager", description: "Assigned senior account executive and technical lead." },
    { category: "Support", name: "12 Months Dedicated Support", description: "12 months of round-the-clock 24/7 technical support." },
  ];

  const allFeaturesDef = [
    ...professionalFeaturesDef,
    ...businessFeaturesDef,
    ...enterpriseFeaturesDef,
  ];

  const existingFeaturesSnap = await db
    .collection("package_features")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const featureIdMap: Record<string, string> = {};

  for (const featDef of allFeaturesDef) {
    const categoryId = featureCategoryMap[featDef.category];
    const existing = existingFeaturesSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === featDef.name.toLowerCase().trim()
    );

    if (existing) {
      featureIdMap[featDef.name] = existing.id;
    } else {
      const featRef = db.collection("package_features").doc();
      await featRef.set({
        serviceCategoryId,
        categoryId,
        name: featDef.name,
        description: featDef.description,
        packageIds: [],
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureIdMap[featDef.name] = featRef.id;
      console.log(`✅ Created Package Feature: ${featDef.name} (${featRef.id})`);
    }
  }

  // 5. Create or Update Packages
  const existingPackagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .where("serviceTypeId", "==", serviceTypeId)
    .get();

  const now = new Date();

  // Package 1: Professional Marketplace (₹1,49,999)
  const profFeatureIds = Array.from(
    new Set(professionalFeaturesDef.map((f) => featureIdMap[f.name]).filter(Boolean))
  );

  let profPkgDoc = existingPackagesSnap.docs.find(
    (d) => d.data().name.toLowerCase().trim() === "professional marketplace"
  );

  let profPkgId = "";
  if (profPkgDoc) {
    profPkgId = profPkgDoc.id;
    await db.collection("packages").doc(profPkgId).update({
      basePrice: 149999,
      description: "Best for local multi-vendor platforms, handmade product marketplaces, B2B & niche marketplaces with vendor registration, store, products, orders, cart, checkout, payments, and 6 months support.",
      includedFeatureIds: profFeatureIds,
      updatedAt: now,
    });
    console.log(`✅ Updated Package: Professional Marketplace (₹1,49,999) (${profPkgId})`);
  } else {
    const pkgRef = db.collection("packages").doc();
    profPkgId = pkgRef.id;
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name: "Professional Marketplace",
      slug: "professional-marketplace",
      description: "Best for local multi-vendor platforms, handmade product marketplaces, B2B & niche marketplaces with vendor registration, store, products, orders, cart, checkout, payments, and 6 months support.",
      basePrice: 149999,
      deliveryDays: 28,
      pagesIncluded: 25,
      revisions: 5,
      isPopular: false,
      isActive: true,
      sortOrder: 1,
      includedFeatureIds: profFeatureIds,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package: Professional Marketplace (₹1,49,999) (${profPkgId})`);
  }

  // Package 2: Business Marketplace (₹2,99,999)
  const busFeatureIds = Array.from(
    new Set([
      ...profFeatureIds,
      ...businessFeaturesDef.map((f) => featureIdMap[f.name]).filter(Boolean),
    ])
  );

  let busPkgDoc = existingPackagesSnap.docs.find(
    (d) => d.data().name.toLowerCase().trim() === "business marketplace"
  );

  let busPkgId = "";
  if (busPkgDoc) {
    busPkgId = busPkgDoc.id;
    await db.collection("packages").doc(busPkgId).update({
      basePrice: 299999,
      description: "Everything in Professional + Commission Management, Vendor Verification, Vendor Analytics, Vendor Notifications, Payout Requests, Coupons, Inventory, Shipping, Returns, Refunds, Invoice, CRM, Reports, Audit Logs, Priority Support & Source Code.",
      includedFeatureIds: busFeatureIds,
      updatedAt: now,
    });
    console.log(`✅ Updated Package: Business Marketplace (₹2,99,999) (${busPkgId})`);
  } else {
    const pkgRef = db.collection("packages").doc();
    busPkgId = pkgRef.id;
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name: "Business Marketplace",
      slug: "business-marketplace",
      description: "Everything in Professional + Commission Management, Vendor Verification, Vendor Analytics, Vendor Notifications, Payout Requests, Coupons, Inventory, Shipping, Returns, Refunds, Invoice, CRM, Reports, Audit Logs, Priority Support & Source Code.",
      basePrice: 299999,
      deliveryDays: 45,
      pagesIncluded: 50,
      revisions: 10,
      isPopular: true,
      isActive: true,
      sortOrder: 2,
      includedFeatureIds: busFeatureIds,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package: Business Marketplace (₹2,99,999) (${busPkgId})`);
  }

  // Package 3: Enterprise Marketplace (₹5,99,999+)
  const entFeatureIds = Array.from(
    new Set([
      ...busFeatureIds,
      ...enterpriseFeaturesDef.map((f) => featureIdMap[f.name]).filter(Boolean),
    ])
  );

  let entPkgDoc = existingPackagesSnap.docs.find(
    (d) => d.data().name.toLowerCase().trim() === "enterprise marketplace"
  );

  let entPkgId = "";
  if (entPkgDoc) {
    entPkgId = entPkgDoc.id;
    await db.collection("packages").doc(entPkgId).update({
      basePrice: 599999,
      description: "Everything in Business + Multi-country Vendors, Multi-language, Multi-currency, Vendor API, Automated Commission Settlement, ERP Integration, Payment Split, Tax Automation, BI, CDN, Auto Scaling, Enterprise Security & 12 Months Support.",
      includedFeatureIds: entFeatureIds,
      updatedAt: now,
    });
    console.log(`✅ Updated Package: Enterprise Marketplace (₹5,99,999) (${entPkgId})`);
  } else {
    const pkgRef = db.collection("packages").doc();
    entPkgId = pkgRef.id;
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name: "Enterprise Marketplace",
      slug: "enterprise-marketplace",
      description: "Everything in Business + Multi-country Vendors, Multi-language, Multi-currency, Vendor API, Automated Commission Settlement, ERP Integration, Payment Split, Tax Automation, BI, CDN, Auto Scaling, Enterprise Security & 12 Months Support.",
      basePrice: 599999,
      deliveryDays: 75,
      pagesIncluded: -1,
      revisions: 99,
      isPopular: false,
      isActive: true,
      sortOrder: 3,
      includedFeatureIds: entFeatureIds,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package: Enterprise Marketplace (₹5,99,999) (${entPkgId})`);
  }

  // 6. Sync Bidirectional Package References on Features
  console.log("Syncing bidirectional feature packageIds...");
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isProf = professionalFeaturesDef.some((f) => f.name === featName);
    const isBus = businessFeaturesDef.some((f) => f.name === featName) || isProf;
    const isEnt = true;

    const assignedPackageIds: string[] = [];
    if (isProf) assignedPackageIds.push(profPkgId);
    if (isBus) assignedPackageIds.push(busPkgId);
    if (isEnt) assignedPackageIds.push(entPkgId);

    const featRef = db.collection("package_features").doc(featId);
    const featSnap = await featRef.get();
    const existingPackageIds: string[] = featSnap.data()?.packageIds || [];
    const mergedPackageIds = Array.from(new Set([...existingPackageIds, ...assignedPackageIds]));

    await featRef.update({
      packageIds: mergedPackageIds,
      updatedAt: now,
    });
  }

  // 7. Ensure Marketplace Paid Add-ons Exist
  console.log("Checking Add-on Categories for Marketplace add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let mobileCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("mobile") || d.data().name?.toLowerCase().includes("app")
  );

  let mobileCatId = "";
  if (!mobileCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    mobileCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Mobile Apps & AI Extensions",
      icon: "Smartphone",
      sortOrder: 5,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Mobile Apps & AI Extensions (${mobileCatId})`);
  } else {
    mobileCatId = mobileCatDoc.id;
  }

  let marketingCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("marketing") || d.data().name?.toLowerCase().includes("growth")
  );

  let marketingCatId = marketingCatDoc ? marketingCatDoc.id : mobileCatId;

  const addonDefs = [
    { categoryId: mobileCatId, name: "Native Mobile App (iOS & Android)", description: "Flutter/React Native buyer & seller mobile apps.", pricingType: "fixed", price: 85000 },
    { categoryId: mobileCatId, name: "AI Product Recommendation Engine", description: "Machine learning personalized product recommendations.", pricingType: "fixed", price: 35000 },
    { categoryId: mobileCatId, name: "AI Visual & Semantic Search", description: "Smart AI powered search engine for product discovery.", pricingType: "fixed", price: 30000 },
    { categoryId: mobileCatId, name: "SMS Gateway Integration", description: "DLT transactional OTP and order notification SMS.", pricingType: "fixed", price: 8000 },
    { categoryId: mobileCatId, name: "WhatsApp Business API Integration", description: "Automated seller order alerts & buyer updates via WhatsApp.", pricingType: "fixed", price: 12000 },
    { categoryId: mobileCatId, name: "Courier API Logistics Integration", description: "Shiprocket/Delhivery automated shipping dispatch.", pricingType: "fixed", price: 15000 },
    { categoryId: marketingCatId, name: "Marketing Automation Suite", description: "Automated email sequences & buyer retargeting workflows.", pricingType: "fixed", price: 25000 },
    { categoryId: marketingCatId, name: "Customer Loyalty Program", description: "Buyer reward points and tier status system.", pricingType: "fixed", price: 20000 },
    { categoryId: marketingCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly security updates, server upkeep & database backups.", pricingType: "fixed", price: 36000 },
    { categoryId: marketingCatId, name: "Digital Marketing & SEO Setup", description: "Complete SEO setup & conversion optimization.", pricingType: "fixed", price: 25000 },
  ];

  const existingAddonsSnap = await db
    .collection("addon_features")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  for (const addDef of addonDefs) {
    const existing = existingAddonsSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === addDef.name.toLowerCase().trim()
    );

    if (!existing) {
      const addRef = db.collection("addon_features").doc();
      await addRef.set({
        serviceCategoryId,
        categoryId: addDef.categoryId,
        name: addDef.name,
        description: addDef.description,
        pricingType: addDef.pricingType,
        price: addDef.price,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`✅ Created Add-on Feature: ${addDef.name} (₹${addDef.price})`);
    }
  }

  console.log("🎉 Successfully completed Marketplace Website Packages & Features Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
