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
  console.log("🚀 Starting E-commerce Store Exact Feature Sync...");

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

  // 2. Find E-commerce Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const ecommerceTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("e-commerce")
  );

  if (!ecommerceTypeDoc) {
    console.error("❌ E-commerce Website service type not found!");
    process.exit(1);
  }

  const serviceTypeId = ecommerceTypeDoc.id;
  console.log(`✅ Category: ${serviceCategoryId} | ServiceType: ${serviceTypeId}`);

  // 3. Ensure Feature Categories
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "E-commerce",
    "Lead Generation",
    "SEO & Performance",
    "Authentication",
    "Security",
    "Deployment",
    "Support",
    "CMS",
    "Analytics",
    "Business Features",
    "Reports",
    "Enterprise Features",
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

  // 4. Feature Lists for each E-commerce Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Shop" },
    { cat: "Website Structure", name: "Product Details" },
    { cat: "Website Structure", name: "Categories" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // E-commerce
    { cat: "E-commerce", name: "Product Management" },
    { cat: "E-commerce", name: "Category Management" },
    { cat: "E-commerce", name: "Shopping Cart" },
    { cat: "E-commerce", name: "Checkout" },
    { cat: "E-commerce", name: "Online Payments" },
    { cat: "E-commerce", name: "Order Management" },
    { cat: "E-commerce", name: "Basic Inventory" },
    { cat: "E-commerce", name: "Customer Registration" },
    { cat: "E-commerce", name: "Customer Login" },
    { cat: "E-commerce", name: "Order History" },
    // Lead Generation
    { cat: "Lead Generation", name: "Contact Form" },
    { cat: "Lead Generation", name: "WhatsApp" },
    { cat: "Lead Generation", name: "Social Links" },
    // Design & Experience
    { cat: "Design & Experience", name: "Responsive Design" },
    { cat: "Design & Experience", name: "Premium UI" },
    { cat: "Design & Experience", name: "Mobile First" },
    { cat: "Design & Experience", name: "Animations" },
    // SEO & Performance
    { cat: "SEO & Performance", name: "Technical SEO" },
    { cat: "SEO & Performance", name: "Meta Tags" },
    { cat: "SEO & Performance", name: "XML Sitemap" },
    { cat: "SEO & Performance", name: "robots.txt" },
    // Security & Deployment & Support
    { cat: "Security", name: "SSL" },
    { cat: "Security", name: "Spam Protection" },
    { cat: "Deployment", name: "Domain Setup" },
    { cat: "Deployment", name: "Hosting Deployment" },
    { cat: "Support", name: "3 Months Support" },
  ];

  const proFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Blog" },
    { cat: "Website Structure", name: "FAQ" },
    // E-commerce
    { cat: "E-commerce", name: "Wishlist" },
    { cat: "E-commerce", name: "Product Reviews" },
    { cat: "E-commerce", name: "Product Ratings" },
    { cat: "E-commerce", name: "Product Variants" },
    { cat: "E-commerce", name: "Coupons" },
    { cat: "E-commerce", name: "Discount Engine" },
    { cat: "E-commerce", name: "Shipping Methods" },
    { cat: "E-commerce", name: "Order Tracking" },
    { cat: "E-commerce", name: "Related Products" },
    { cat: "E-commerce", name: "Featured Products" },
    { cat: "E-commerce", name: "Recently Viewed Products" },
    // CMS
    { cat: "CMS", name: "Product CMS" },
    { cat: "CMS", name: "Blog CMS" },
    { cat: "CMS", name: "Media Library" },
    // SEO & Analytics & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "SEO & Performance", name: "Lazy Loading" },
    { cat: "Analytics", name: "Google Analytics" },
    { cat: "Analytics", name: "Dashboard" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // E-commerce
    { cat: "E-commerce", name: "Returns" },
    { cat: "E-commerce", name: "Refund Management" },
    { cat: "E-commerce", name: "Advanced Inventory" },
    { cat: "E-commerce", name: "Stock Alerts" },
    { cat: "E-commerce", name: "Invoice Generation" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Customer Dashboard" },
    { cat: "Business Features", name: "Staff Roles" },
    { cat: "Business Features", name: "CRM Integration" },
    { cat: "Business Features", name: "Email Notifications" },
    // Reports
    { cat: "Reports", name: "Sales Reports" },
    { cat: "Reports", name: "Revenue Reports" },
    { cat: "Reports", name: "Customer Reports" },
    // Authentication & Support
    { cat: "Authentication", name: "Role Based Access" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // E-commerce
    { cat: "E-commerce", name: "Multi Vendor" },
    { cat: "E-commerce", name: "Vendor Dashboard" },
    { cat: "E-commerce", name: "Commission System" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "POS Integration" },
    { cat: "Enterprise Features", name: "Multi Currency" },
    { cat: "Enterprise Features", name: "Multi Language" },
    { cat: "Enterprise Features", name: "API Integrations" },
    { cat: "Enterprise Features", name: "Workflow Automation" },
    // Security
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Backup System" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Advanced Reports" },
    { cat: "Analytics", name: "Custom Dashboards" },
    // Performance
    { cat: "Performance", name: "CDN" },
    { cat: "Performance", name: "Performance Monitoring" },
    { cat: "Performance", name: "Auto Scaling" },
    // Deployment & Support
    { cat: "Deployment", name: "CI/CD" },
    { cat: "Deployment", name: "Staging" },
    { cat: "Deployment", name: "Documentation" },
    { cat: "Support", name: "Dedicated Manager" },
    { cat: "Support", name: "12 Months Support" },
  ];

  const allFeatureDefs = [
    ...starterFeatureDefs,
    ...proFeatureDefs,
    ...busFeatureDefs,
    ...entFeatureDefs,
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
        description: `${fDef.name} for e-commerce website.`,
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

  // 5. Find or Create all 4 Packages under E-commerce Website
  const allCategoryPackagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const now = new Date();

  // Helper to ensure a package exists under serviceTypeId
  async function ensurePackage(name: string, slug: string, basePrice: number, deliveryDays: number, pagesIncluded: number, revisions: number, isPopular: boolean, sortOrder: number, description: string) {
    let doc = allCategoryPackagesSnap.docs.find((d) => d.data().name?.toLowerCase().trim() === name.toLowerCase().trim());
    if (doc) {
      await db.collection("packages").doc(doc.id).update({
        serviceTypeId,
        basePrice,
        description,
        sortOrder,
        updatedAt: now,
      });
      return doc.id;
    }

    const pkgRef = db.collection("packages").doc();
    await pkgRef.set({
      serviceCategoryId,
      serviceTypeId,
      name,
      slug,
      description,
      basePrice,
      deliveryDays,
      pagesIncluded,
      revisions,
      isPopular,
      isActive: true,
      sortOrder,
      includedFeatureIds: [],
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Package "${name}" (₹${basePrice}) (${pkgRef.id})`);
    return pkgRef.id;
  }

  const starterPkgId = await ensurePackage("Starter Store (Launch Offer ₹25,000)", "starter-store", 39999, 10, 5, 3, true, 1, "Professional website for small online retailers.");
  const proPkgId = await ensurePackage("Professional Store", "professional-store", 69999, 14, 15, 5, false, 2, "Full-featured online store with variants, blog, reviews & coupons.");
  const busPkgId = await ensurePackage("Business Store", "business-store", 119999, 21, 20, 5, false, 3, "Advanced e-commerce store with stock alerts, returns, CRM & analytics.");
  const entPkgId = await ensurePackage("Enterprise Store", "enterprise-store", 249999, 45, -1, 99, false, 4, "Enterprise multi-vendor platform with ERP/POS sync and dedicated support.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter Store (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Store (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Store (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Store (${entPkgId}) with ${entFeatureIds.length} features.`);

  // 6. Sync bidirectional packageIds on features
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isStarter = starterFeatureDefs.some((f) => f.name === featName);
    const isPro = proFeatureDefs.some((f) => f.name === featName) || isStarter;
    const isBus = busFeatureDefs.some((f) => f.name === featName) || isPro;
    const isEnt = true;

    const assignedPkgIds: string[] = [];
    if (isStarter) assignedPkgIds.push(starterPkgId);
    if (isPro) assignedPkgIds.push(proPkgId);
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

  console.log("🎉 Successfully completed exact feature sync for E-commerce Website!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
