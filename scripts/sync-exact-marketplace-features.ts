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

async function run() {
  console.log("🚀 Starting Exact Feature Synchronization for Marketplace Website...");

  // 1. Find Website Development Category
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

  // 2. Find Marketplace Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const marketplaceTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("marketplace")
  );

  if (!marketplaceTypeDoc) {
    console.error("❌ Marketplace Website service type not found!");
    process.exit(1);
  }

  const serviceTypeId = marketplaceTypeDoc.id;
  console.log(`✅ Category: ${serviceCategoryId} | ServiceType: ${serviceTypeId}`);

  // 3. Ensure Feature Categories
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Marketplace",
    "E-commerce",
    "Authentication",
    "Business Features",
    "SEO & Performance",
    "Security",
    "Deployment",
    "Support",
    "Enterprise",
    "Analytics",
    "Performance",
  ];

  const existingFeatureCatsSnap = await db
    .collection("package_feature_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const featureCategoryMap: Record<string, string> = {};

  for (let i = 0; i < categoryNames.length; i++) {
    const catName = categoryNames[i];
    const existing = existingFeatureCatsSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === catName.toLowerCase().trim()
    );

    if (existing) {
      featureCategoryMap[catName] = existing.id;
    } else {
      const catRef = db.collection("package_feature_categories").doc();
      await catRef.set({
        serviceCategoryId,
        name: catName,
        icon: "Layers",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each package
  const professionalFeatureNames = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Shop" },
    { cat: "Website Structure", name: "Categories" },
    { cat: "Website Structure", name: "Product Details" },
    { cat: "Website Structure", name: "Vendor Store" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms" },
    { cat: "Website Structure", name: "404" },
    // Marketplace
    { cat: "Marketplace", name: "Vendor Registration" },
    { cat: "Marketplace", name: "Vendor Approval" },
    { cat: "Marketplace", name: "Vendor Login" },
    { cat: "Marketplace", name: "Vendor Dashboard" },
    { cat: "Marketplace", name: "Vendor Profile" },
    { cat: "Marketplace", name: "Vendor Products" },
    { cat: "Marketplace", name: "Vendor Orders" },
    { cat: "Marketplace", name: "Vendor Earnings" },
    // E-commerce
    { cat: "E-commerce", name: "Shopping Cart" },
    { cat: "E-commerce", name: "Checkout" },
    { cat: "E-commerce", name: "Online Payments" },
    { cat: "E-commerce", name: "Customer Login" },
    { cat: "E-commerce", name: "Order Management" },
    { cat: "E-commerce", name: "Product Reviews" },
    { cat: "E-commerce", name: "Wishlist" },
    // Authentication
    { cat: "Authentication", name: "Customer Login" },
    { cat: "Authentication", name: "Vendor Login" },
    { cat: "Authentication", name: "Admin Login" },
    // SEO & Performance
    { cat: "SEO & Performance", name: "Technical SEO" },
    { cat: "SEO & Performance", name: "XML Sitemap" },
    { cat: "SEO & Performance", name: "robots.txt" },
    // Deployment & Support
    { cat: "Deployment", name: "Hosting" },
    { cat: "Deployment", name: "SSL" },
    { cat: "Deployment", name: "Domain Setup" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const businessFeatureNames = [
    // Marketplace
    { cat: "Marketplace", name: "Commission Management" },
    { cat: "Marketplace", name: "Vendor Verification" },
    { cat: "Marketplace", name: "Vendor Analytics" },
    { cat: "Marketplace", name: "Vendor Notifications" },
    { cat: "Marketplace", name: "Vendor Payout Requests" },
    { cat: "Marketplace", name: "Vendor Coupons" },
    // E-commerce
    { cat: "E-commerce", name: "Inventory Management" },
    { cat: "E-commerce", name: "Shipping Management" },
    { cat: "E-commerce", name: "Returns" },
    { cat: "E-commerce", name: "Refunds" },
    { cat: "E-commerce", name: "Invoice Generation" },
    // Business Features
    { cat: "Business Features", name: "CRM" },
    { cat: "Business Features", name: "Reports" },
    { cat: "Business Features", name: "Analytics Dashboard" },
    { cat: "Business Features", name: "Email Notifications" },
    // Auth & Security & Support
    { cat: "Authentication", name: "Role Based Access" },
    { cat: "Security", name: "Audit Logs" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "Source Code" },
  ];

  const enterpriseFeatureNames = [
    // Marketplace
    { cat: "Marketplace", name: "Multi-country Vendors" },
    { cat: "Marketplace", name: "Multi-language" },
    { cat: "Marketplace", name: "Multi-currency" },
    { cat: "Marketplace", name: "Vendor API" },
    { cat: "Marketplace", name: "Automated Commission Settlement" },
    // Enterprise
    { cat: "Enterprise", name: "ERP Integration" },
    { cat: "Enterprise", name: "Payment Split" },
    { cat: "Enterprise", name: "Tax Automation" },
    { cat: "Enterprise", name: "Workflow Automation" },
    { cat: "Enterprise", name: "API Integrations" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Custom Reports" },
    { cat: "Analytics", name: "Revenue Dashboard" },
    // Performance
    { cat: "Performance", name: "CDN" },
    { cat: "Performance", name: "Auto Scaling" },
    { cat: "Performance", name: "Queue Processing" },
    { cat: "Performance", name: "Performance Monitoring" },
    // Security
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Backup" },
    { cat: "Security", name: "Disaster Recovery" },
    // Support
    { cat: "Support", name: "Dedicated Account Manager" },
    { cat: "Support", name: "12 Months Support" },
  ];

  const allFeatureDefs = [
    ...professionalFeatureNames,
    ...businessFeatureNames,
    ...enterpriseFeatureNames,
  ];

  const existingFeaturesSnap = await db
    .collection("package_features")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const featureIdMap: Record<string, string> = {};

  for (const fDef of allFeatureDefs) {
    const categoryId = featureCategoryMap[fDef.cat];
    const existing = existingFeaturesSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === fDef.name.toLowerCase().trim()
    );

    if (existing) {
      featureIdMap[fDef.name] = existing.id;
    } else {
      const featRef = db.collection("package_features").doc();
      await featRef.set({
        serviceCategoryId,
        categoryId,
        name: fDef.name,
        description: `${fDef.name} for marketplace platform.`,
        packageIds: [],
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureIdMap[fDef.name] = featRef.id;
      console.log(`✅ Created Feature: "${fDef.name}" (${featRef.id})`);
    }
  }

  // 5. Get Packages under Marketplace Website
  const packagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .where("serviceTypeId", "==", serviceTypeId)
    .get();

  const profPkgDoc = packagesSnap.docs.find((d) => d.data().name?.toLowerCase().includes("professional marketplace"));
  const busPkgDoc = packagesSnap.docs.find((d) => d.data().name?.toLowerCase().includes("business marketplace"));
  const entPkgDoc = packagesSnap.docs.find((d) => d.data().name?.toLowerCase().includes("enterprise marketplace"));

  if (!profPkgDoc || !busPkgDoc || !entPkgDoc) {
    console.error("❌ Marketplace packages missing. Make sure packages are created.");
    process.exit(1);
  }

  const profPkgId = profPkgDoc.id;
  const busPkgId = busPkgDoc.id;
  const entPkgId = entPkgDoc.id;

  const profFeatureIds = Array.from(new Set(professionalFeatureNames.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const busFeatureIds = Array.from(new Set([...profFeatureIds, ...businessFeatureNames.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...enterpriseFeatureNames.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  const now = new Date();

  await db.collection("packages").doc(profPkgId).update({
    includedFeatureIds: profFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Marketplace (${profPkgId}) with ${profFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Marketplace (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Marketplace (${entPkgId}) with ${entFeatureIds.length} features.`);

  // 6. Sync bidirectional packageIds on features
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isProf = professionalFeatureNames.some((f) => f.name === featName);
    const isBus = businessFeatureNames.some((f) => f.name === featName) || isProf;
    const isEnt = true;

    const assignedPkgIds: string[] = [];
    if (isProf) assignedPkgIds.push(profPkgId);
    if (isBus) assignedPkgIds.push(busPkgId);
    if (isEnt) assignedPkgIds.push(entPkgId);

    const featRef = db.collection("package_features").doc(featId);
    const featSnap = await featRef.get();
    const existingPkgIds: string[] = featSnap.data()?.packageIds || [];
    const mergedPkgIds = Array.from(new Set([...existingPkgIds, ...assignedPkgIds]));

    await featRef.update({
      packageIds: mergedPkgIds,
      updatedAt: now,
    });
  }

  console.log("🎉 Successfully completed exact feature sync for Marketplace Website!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
