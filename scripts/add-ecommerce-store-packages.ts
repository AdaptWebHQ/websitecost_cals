import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

// Attempt to load service account file
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
  initializeApp({
    credential: cert(serviceAccount),
  });
  console.log("ℹ️ Initialized Firebase Admin using secrets/firebase-admin.json credentials.");
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
  console.log("ℹ️ Initialized Firebase Admin using environment variables.");
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
  console.log("🚀 Starting E-commerce Packages and Features Migration...");

  // 1. Find Website Development Service Category
  const categoriesSnap = await db.collection("service_categories").get();
  let categoryDoc = categoriesSnap.docs.find(
    (d) =>
      d.id === "sc-website" ||
      d.data().slug === "website-development" ||
      d.data().name?.toLowerCase().includes("website")
  );

  let serviceCategoryId = "";

  if (!categoryDoc) {
    console.log("Creating Website Development category...");
    const catRef = db.collection("service_categories").doc("sc-website");
    await catRef.set({
      name: "Website Development",
      slug: "website-development",
      description: "Custom websites, web apps, and e-commerce solutions.",
      icon: "Globe",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    serviceCategoryId = "sc-website";
  } else {
    serviceCategoryId = categoryDoc.id;
    console.log(`✅ Found Service Category: ${categoryDoc.data().name} (${serviceCategoryId})`);
  }

  // 2. Find or Create E-commerce Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let ecommerceTypeDoc = serviceTypesSnap.docs.find(
    (d) =>
      d.data().name?.toLowerCase().includes("e-commerce") ||
      d.data().slug?.includes("e-commerce") ||
      d.data().slug?.includes("ecommerce")
  );

  let serviceTypeId = "";

  if (!ecommerceTypeDoc) {
    console.log("Creating 'E-commerce Website' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "E-commerce Website",
      slug: "e-commerce-website",
      description: "Online stores, shopping carts, inventory management, and multi-vendor marketplaces.",
      icon: "ShoppingCart",
      sortOrder: 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created E-commerce Website Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = ecommerceTypeDoc.id;
    console.log(`✅ Found E-commerce Website Service Type: ${ecommerceTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const featureCatDefinitions: { name: string; icon: string; displayOrder: number }[] = [
    { name: "E-commerce", icon: "ShoppingCart", displayOrder: 1 },
    { name: "Business Features", icon: "Briefcase", displayOrder: 2 },
    { name: "Reports", icon: "BarChart", displayOrder: 3 },
    { name: "Authentication", icon: "Key", displayOrder: 4 },
    { name: "Support", icon: "Headphones", displayOrder: 5 },
    { name: "Enterprise Features", icon: "Zap", displayOrder: 6 },
    { name: "Security", icon: "Shield", displayOrder: 7 },
    { name: "Analytics", icon: "TrendingUp", displayOrder: 8 },
    { name: "Performance", icon: "Gauge", displayOrder: 9 },
    { name: "Deployment", icon: "Server", displayOrder: 10 },
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

  // 4. Feature Lists for Business Store and Enterprise Store
  const businessFeaturesDef: { category: string; name: string; description: string }[] = [
    { category: "E-commerce", name: "E-commerce", description: "Complete online store functionality with cart and checkout." },
    { category: "E-commerce", name: "Returns", description: "Customer product returns and order exchange workflow." },
    { category: "E-commerce", name: "Refund Management", description: "Automated and manual refund processing." },
    { category: "E-commerce", name: "Advanced Inventory", description: "Real-time multi-variant inventory tracking." },
    { category: "E-commerce", name: "Stock Alerts", description: "Low stock notifications and automated re-order thresholds." },
    { category: "E-commerce", name: "Invoice Generation", description: "Automated PDF tax invoices and receipts." },
    { category: "Business Features", name: "Admin Dashboard", description: "Comprehensive administrative control panel." },
    { category: "Business Features", name: "Customer Dashboard", description: "Customer account portal with order history and tracking." },
    { category: "Business Features", name: "Staff Roles", description: "Custom permission roles for team members." },
    { category: "Business Features", name: "CRM Integration", description: "Seamless sync with HubSpot, Zoho, or Salesforce." },
    { category: "Business Features", name: "Email Notifications", description: "Transactional emails for orders, shipping, and account updates." },
    { category: "Reports", name: "Sales Reports", description: "Detailed product and category sales analytics." },
    { category: "Reports", name: "Revenue Reports", description: "Financial breakdown and tax summary reporting." },
    { category: "Reports", name: "Customer Reports", description: "Customer LTV, purchase frequency, and acquisition reports." },
    { category: "Authentication", name: "Role Based Access", description: "Granular access control based on user roles." },
    { category: "Support", name: "Source Code", description: "Full repository ownership and unencrypted source code." },
    { category: "Support", name: "Priority Support", description: "Dedicated rapid-response technical support line." },
    { category: "Support", name: "6 Months Maintenance", description: "6 months of included bug fixes and technical maintenance." },
  ];

  const enterpriseFeaturesDef: { category: string; name: string; description: string }[] = [
    { category: "E-commerce", name: "Multi Vendor", description: "Multi-seller marketplace capabilities." },
    { category: "E-commerce", name: "Vendor Dashboard", description: "Dedicated vendor portals for product and order management." },
    { category: "E-commerce", name: "Commission System", description: "Automated seller commission splits and payout calculations." },
    { category: "Enterprise Features", name: "ERP Integration", description: "Bi-directional sync with SAP, Tally, or Oracle ERP." },
    { category: "Enterprise Features", name: "POS Integration", description: "Real-time sync with physical retail Point-of-Sale systems." },
    { category: "Enterprise Features", name: "Multi Currency", description: "Dynamic localized currency switching and geo-pricing." },
    { category: "Enterprise Features", name: "Multi Language", description: "Multilingual content support and localization." },
    { category: "Enterprise Features", name: "API Integrations", description: "Custom REST/GraphQL API connections." },
    { category: "Enterprise Features", name: "Workflow Automation", description: "Custom automated triggers and business process workflows." },
    { category: "Security", name: "Audit Logs", description: "Comprehensive activity logging for compliance and security." },
    { category: "Security", name: "Enterprise Security", description: "WAF, DDoS protection, and penetration-tested security layer." },
    { category: "Security", name: "Backup System", description: "Automated daily automated cloud database backups." },
    { category: "Analytics", name: "Business Intelligence", description: "Advanced BI reporting dashboards and predictive insights." },
    { category: "Analytics", name: "Advanced Reports", description: "Customizable tabular and visual reporting tools." },
    { category: "Analytics", name: "Custom Dashboards", description: "Tailored executive KPI analytics widgets." },
    { category: "Performance", name: "CDN", description: "Global edge CDN acceleration for lightning fast assets." },
    { category: "Performance", name: "Performance Monitoring", description: "Real-time uptime and performance tracing." },
    { category: "Performance", name: "Auto Scaling", description: "Dynamic server capacity scaling for high-traffic spikes." },
    { category: "Deployment", name: "CI/CD", description: "Automated continuous integration and deployment pipelines." },
    { category: "Deployment", name: "Staging", description: "Dedicated sandbox/staging environment for pre-release testing." },
    { category: "Deployment", name: "Documentation", description: "Complete technical architecture and API documentation." },
    { category: "Support", name: "Dedicated Manager", description: "Assigned account manager and technical lead." },
    { category: "Support", name: "6 Months Support", description: "6 months of 24/7 dedicated enterprise support." },
  ];

  // Combine feature definitions
  const allFeaturesDef = [...businessFeaturesDef, ...enterpriseFeaturesDef];

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

  // 5. Create or Update "Business Store" Package (₹1,19,999)
  const businessFeatureIds = Array.from(
    new Set(businessFeaturesDef.map((f) => featureIdMap[f.name]).filter(Boolean))
  );

  const existingPackagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .where("serviceTypeId", "==", serviceTypeId)
    .get();

  let businessPkgDoc = existingPackagesSnap.docs.find(
    (d) => d.data().name.toLowerCase().trim() === "business store"
  );

  let businessPkgId = "";
  const now = new Date();

  if (businessPkgDoc) {
    businessPkgId = businessPkgDoc.id;
    await db.collection("packages").doc(businessPkgId).update({
      basePrice: 119999,
      description: "Everything in Professional + E-commerce, Returns, Refund Management, Advanced Inventory, Stock Alerts, Invoice Generation, CRM, Reports, Source Code, and 6 Months Maintenance.",
      includedFeatureIds: businessFeatureIds,
      updatedAt: now,
    });
    console.log(`✅ Updated Package: Business Store (₹1,19,999) (${businessPkgId})`);
  } else {
    const pkgRef = db.collection("packages").doc();
    businessPkgId = pkgRef.id;
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name: "Business Store",
      slug: "business-store",
      description: "Everything in Professional + E-commerce, Returns, Refund Management, Advanced Inventory, Stock Alerts, Invoice Generation, CRM, Reports, Source Code, and 6 Months Maintenance.",
      basePrice: 119999,
      deliveryDays: 21,
      pagesIncluded: 20,
      revisions: 5,
      isPopular: true,
      isActive: true,
      sortOrder: 1,
      includedFeatureIds: businessFeatureIds,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package: Business Store (₹1,19,999) (${businessPkgId})`);
  }

  // 6. Create or Update "Enterprise Store" Package (₹2,49,999)
  // Enterprise Store includes Business features PLUS Enterprise features
  const enterpriseFeatureIds = Array.from(
    new Set([
      ...businessFeatureIds,
      ...enterpriseFeaturesDef.map((f) => featureIdMap[f.name]).filter(Boolean),
    ])
  );

  let enterprisePkgDoc = existingPackagesSnap.docs.find(
    (d) => d.data().name.toLowerCase().trim() === "enterprise store"
  );

  let enterprisePkgId = "";

  if (enterprisePkgDoc) {
    enterprisePkgId = enterprisePkgDoc.id;
    await db.collection("packages").doc(enterprisePkgId).update({
      basePrice: 249999,
      description: "Everything in Business + Multi Vendor, Vendor Dashboard, Commission System, ERP/POS Integration, Multi Currency, Multi Language, Workflow Automation, Audit Logs, BI & 6 Months Enterprise Support.",
      includedFeatureIds: enterpriseFeatureIds,
      updatedAt: now,
    });
    console.log(`✅ Updated Package: Enterprise Store (₹2,49,999) (${enterprisePkgId})`);
  } else {
    const pkgRef = db.collection("packages").doc();
    enterprisePkgId = pkgRef.id;
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name: "Enterprise Store",
      slug: "enterprise-store",
      description: "Everything in Business + Multi Vendor, Vendor Dashboard, Commission System, ERP/POS Integration, Multi Currency, Multi Language, Workflow Automation, Audit Logs, BI & 6 Months Enterprise Support.",
      basePrice: 249999,
      deliveryDays: 45,
      pagesIncluded: -1,
      revisions: 99,
      isPopular: false,
      isActive: true,
      sortOrder: 2,
      includedFeatureIds: enterpriseFeatureIds,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package: Enterprise Store (₹2,49,999) (${enterprisePkgId})`);
  }

  // 7. Sync Bidirectional Package References on Features
  console.log("Syncing bidirectional feature packageIds...");
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isBusiness = businessFeaturesDef.some((f) => f.name === featName);
    const isEnterprise = true; // All added features belong to Enterprise Store

    const assignedPackageIds: string[] = [];
    if (isBusiness) assignedPackageIds.push(businessPkgId);
    if (isEnterprise) assignedPackageIds.push(enterprisePkgId);

    const featRef = db.collection("package_features").doc(featId);
    const featSnap = await featRef.get();
    const existingPackageIds: string[] = featSnap.data()?.packageIds || [];
    const mergedPackageIds = Array.from(new Set([...existingPackageIds, ...assignedPackageIds]));

    await featRef.update({
      packageIds: mergedPackageIds,
      updatedAt: now,
    });
  }

  // 8. Add Paid Logistics & Marketing Add-ons
  console.log("Checking Add-on Categories for logistics and marketing add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let logisticsCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("logistics") || d.data().name?.toLowerCase().includes("courier")
  );

  let logisticsCatId = "";
  if (!logisticsCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    logisticsCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Logistics & Shipping Integrations",
      icon: "Truck",
      sortOrder: 3,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Logistics & Shipping Integrations (${logisticsCatId})`);
  } else {
    logisticsCatId = logisticsCatDoc.id;
  }

  let marketingCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("marketing") || d.data().name?.toLowerCase().includes("growth")
  );

  let marketingCatId = "";
  if (!marketingCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    marketingCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Marketing, Media & AMC Add-ons",
      icon: "Megaphone",
      sortOrder: 4,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Marketing, Media & AMC Add-ons (${marketingCatId})`);
  } else {
    marketingCatId = marketingCatDoc.id;
  }

  const addonDefs = [
    { categoryId: logisticsCatId, name: "Shiprocket Integration", description: "Automated courier dispatch & tracking sync.", pricingType: "fixed", price: 15000 },
    { categoryId: logisticsCatId, name: "Delhivery Integration", description: "Direct Delhivery B2C & B2B courier API integration.", pricingType: "fixed", price: 15000 },
    { categoryId: logisticsCatId, name: "Blue Dart Integration", description: "Blue Dart express logistics and AWB tracking.", pricingType: "fixed", price: 18000 },
    { categoryId: logisticsCatId, name: "DTDC Integration", description: "DTDC courier API tracking & label printing.", pricingType: "fixed", price: 15000 },
    { categoryId: logisticsCatId, name: "SMS Gateway Integration", description: "DLT-approved transactional OTP & order SMS API.", pricingType: "fixed", price: 8000 },
    { categoryId: logisticsCatId, name: "WhatsApp Business API", description: "Automated WhatsApp order notifications & abandoned cart recovery.", pricingType: "fixed", price: 12000 },
    { categoryId: logisticsCatId, name: "AI Shopping Assistant", description: "Custom AI chatbot trained on your product inventory.", pricingType: "fixed", price: 25000 },
    { categoryId: logisticsCatId, name: "Mobile App (iOS & Android)", description: "Flutter/React Native mobile shopping apps.", pricingType: "fixed", price: 75000 },
    { categoryId: marketingCatId, name: "Product Data Entry (per 100 items)", description: "Catalog uploading, variant creation & image optimization.", pricingType: "fixed", price: 5000 },
    { categoryId: marketingCatId, name: "Content Writing (per page)", description: "SEO-optimized conversion content writing.", pricingType: "per_page", price: 1500 },
    { categoryId: marketingCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly security updates, backups & server upkeep.", pricingType: "fixed", price: 24000 },
    { categoryId: marketingCatId, name: "Digital Marketing Setup", description: "SEO setup, Google Search Console & Analytics 4 tracking.", pricingType: "fixed", price: 20000 },
    { categoryId: marketingCatId, name: "Google Ads Campaign Setup", description: "High-intent Google Shopping & Search ads configuration.", pricingType: "fixed", price: 15000 },
    { categoryId: marketingCatId, name: "Meta Ads Campaign Setup", description: "Instagram & Facebook retargeting & catalog ad setup.", pricingType: "fixed", price: 15000 },
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

  console.log("🎉 Successfully completed E-commerce Store Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
