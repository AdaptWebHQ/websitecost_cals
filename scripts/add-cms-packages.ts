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
  console.log("🚀 Starting Content Management System (CMS) Packages Migration...");

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

  // 2. Find Content Management System (CMS) Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let cmsTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("content management") ||
    d.data().slug?.includes("content-management")
  );

  let serviceTypeId = "";

  if (!cmsTypeDoc) {
    console.log("Creating 'Content Management System (CMS)' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Content Management System (CMS)",
      slug: "content-management-system-cms",
      description: "Enables managing and publishing dynamic content across single or multiple websites.",
      icon: "FileText",
      sortOrder: 8,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created CMS Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = cmsTypeDoc.id;
    console.log(`✅ Found CMS Service Type: ${cmsTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "CMS",
    "Authentication",
    "SEO & Performance",
    "Security",
    "Deployment",
    "Support",
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
        icon: "FileText",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each CMS Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Content Listing" },
    { cat: "Website Structure", name: "Content Details" },
    { cat: "Website Structure", name: "Categories" },
    { cat: "Website Structure", name: "Search" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // CMS
    { cat: "CMS", name: "Content Management" },
    { cat: "CMS", name: "Category Management" },
    { cat: "CMS", name: "Media Library" },
    { cat: "CMS", name: "Rich Text Editor" },
    { cat: "CMS", name: "Draft & Publish" },
    { cat: "CMS", name: "Featured Content" },
    { cat: "CMS", name: "Tags" },
    // Authentication
    { cat: "Authentication", name: "Admin Login" },
    { cat: "Authentication", name: "Content Editor Login" },
    // Design & Experience
    { cat: "Design & Experience", name: "Premium UI" },
    { cat: "Design & Experience", name: "Responsive Design" },
    { cat: "Design & Experience", name: "Mobile First" },
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
    // CMS
    { cat: "CMS", name: "Scheduled Publishing" },
    { cat: "CMS", name: "Content Version History" },
    { cat: "CMS", name: "Page Builder" },
    { cat: "CMS", name: "Custom Content Types" },
    { cat: "CMS", name: "Navigation Manager" },
    { cat: "CMS", name: "File Manager" },
    // Authentication
    { cat: "Authentication", name: "Role-Based Access" },
    { cat: "Authentication", name: "Editor Permissions" },
    // Analytics
    { cat: "Analytics", name: "Content Analytics" },
    { cat: "Analytics", name: "Visitor Dashboard" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Canonical URLs" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // CMS
    { cat: "CMS", name: "Workflow Approval" },
    { cat: "CMS", name: "Multi-author Publishing" },
    { cat: "CMS", name: "Revision Approval" },
    { cat: "CMS", name: "Content Archive" },
    { cat: "CMS", name: "Bulk Content Management" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "User Management" },
    { cat: "Business Features", name: "Activity Logs" },
    { cat: "Business Features", name: "Email Notifications" },
    // Reports
    { cat: "Reports", name: "Content Reports" },
    { cat: "Reports", name: "User Reports" },
    { cat: "Reports", name: "Analytics Dashboard" },
    // Authentication & Support
    { cat: "Authentication", name: "Advanced Role Management" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // CMS
    { cat: "CMS", name: "Multi-site Management" },
    { cat: "CMS", name: "Multi-language" },
    { cat: "CMS", name: "Headless CMS API" },
    { cat: "CMS", name: "Content Personalization" },
    { cat: "CMS", name: "Workflow Automation" },
    { cat: "CMS", name: "API Integrations" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "SSO" },
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "CRM Integration" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Custom Reports" },
    // Security
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "Backup System" },
    // Performance
    { cat: "Performance", name: "CDN" },
    { cat: "Performance", name: "Auto Scaling" },
    { cat: "Performance", name: "Performance Monitoring" },
    // Deployment
    { cat: "Deployment", name: "CI/CD" },
    { cat: "Deployment", name: "Staging Environment" },
    { cat: "Deployment", name: "Documentation" },
    // Support
    { cat: "Support", name: "Dedicated Project Manager" },
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
        description: `${fDef.name} for content management platform.`,
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

  // 5. Ensure all 4 CMS Packages Exist under serviceTypeId
  const allCategoryPackagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const now = new Date();

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

  const starterPkgId = await ensurePackage("Starter CMS", "starter-cms", 49999, 12, 10, 4, false, 1, "Best for blogs, news websites, and company content portals with rich text editor & tags.");
  const proPkgId = await ensurePackage("Professional CMS", "professional-cms", 99999, 21, 25, 7, true, 2, "Everything in Starter + Scheduled Publishing, Version History, Page Builder, Custom Content Types & Analytics.");
  const busPkgId = await ensurePackage("Business CMS", "business-cms", 199999, 35, 50, 10, false, 3, "Everything in Professional + Workflow Approval, Multi-author Publishing, Activity Logs & Source Code.");
  const entPkgId = await ensurePackage("Enterprise CMS", "enterprise-cms", 399999, 60, -1, 99, false, 4, "Everything in Business + Multi-site, Multi-language, Headless CMS API, Personalization, SSO & BI.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter CMS (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional CMS (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business CMS (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise CMS (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure CMS Paid Add-ons Exist
  console.log("Checking Add-on Categories for CMS add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let cmsAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("cms") || d.data().name?.toLowerCase().includes("content")
  );

  let cmsAddonCatId = "";
  if (!cmsAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    cmsAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "CMS & Media Publishing Add-ons",
      icon: "FileText",
      sortOrder: 8,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: CMS & Media Publishing Add-ons (${cmsAddonCatId})`);
  } else {
    cmsAddonCatId = cmsAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: cmsAddonCatId, name: "Native Mobile App (iOS & Android)", description: "Mobile content reader & publisher app.", pricingType: "fixed", price: 75000 },
    { categoryId: cmsAddonCatId, name: "AI Content Generator", description: "AI blog post & article draft writer.", pricingType: "fixed", price: 25000 },
    { categoryId: cmsAddonCatId, name: "AI SEO Assistant", description: "AI automated meta tags & keyword optimizer.", pricingType: "fixed", price: 20000 },
    { categoryId: cmsAddonCatId, name: "Translation Services", description: "Multi-language automatic translation engine.", pricingType: "fixed", price: 18000 },
    { categoryId: cmsAddonCatId, name: "Content Migration (per 100 posts)", description: "Migrate posts from WordPress/Blogger/Drupal.", pricingType: "fixed", price: 15000 },
    { categoryId: cmsAddonCatId, name: "Third-party Integrations", description: "Custom REST API integration & webhooks.", pricingType: "fixed", price: 20000 },
    { categoryId: cmsAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, security & backups.", pricingType: "fixed", price: 24000 },
    { categoryId: cmsAddonCatId, name: "Digital Marketing & Distribution", description: "Social media distribution & SEO push.", pricingType: "fixed", price: 20000 },
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

  console.log("🎉 Successfully completed Content Management System (CMS) Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
