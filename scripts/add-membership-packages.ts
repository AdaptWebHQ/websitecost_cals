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
  console.log("🚀 Starting Membership Website Packages Migration...");

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

  // 2. Find Membership Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let membershipTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("membership") ||
    d.data().slug?.includes("membership")
  );

  let serviceTypeId = "";

  if (!membershipTypeDoc) {
    console.log("Creating 'Membership Website' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Membership Website",
      slug: "membership-website",
      description: "Designed for online communities, fitness memberships, premium content, and subscription platforms.",
      icon: "Users",
      sortOrder: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Membership Website Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = membershipTypeDoc.id;
    console.log(`✅ Found Membership Website Service Type: ${membershipTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Membership",
    "Authentication",
    "SEO & Performance",
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
        icon: "ShieldCheck",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Membership Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Membership Plans" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "FAQ" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // Membership
    { cat: "Membership", name: "Member Registration" },
    { cat: "Membership", name: "Member Login" },
    { cat: "Membership", name: "Member Dashboard" },
    { cat: "Membership", name: "Protected Content" },
    { cat: "Membership", name: "Profile Management" },
    { cat: "Membership", name: "Subscription Management" },
    // Authentication
    { cat: "Authentication", name: "User Registration" },
    { cat: "Authentication", name: "Login" },
    { cat: "Authentication", name: "Password Reset" },
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
    // Membership
    { cat: "Membership", name: "Recurring Subscription" },
    { cat: "Membership", name: "Membership Levels" },
    { cat: "Membership", name: "Content Drip" },
    { cat: "Membership", name: "Member Directory" },
    { cat: "Membership", name: "Member Notifications" },
    { cat: "Membership", name: "Digital Downloads" },
    { cat: "Membership", name: "Event Registration" },
    // CMS
    { cat: "CMS", name: "Content CMS" },
    { cat: "CMS", name: "Media Library" },
    // Analytics
    { cat: "Analytics", name: "Subscription Analytics" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Membership
    { cat: "Membership", name: "Community Forum" },
    { cat: "Membership", name: "Group Management" },
    { cat: "Membership", name: "Member Messaging" },
    { cat: "Membership", name: "Loyalty Program" },
    { cat: "Membership", name: "Member Activity Tracking" },
    { cat: "Membership", name: "Certificate Management" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Staff Dashboard" },
    { cat: "Business Features", name: "CRM Integration" },
    { cat: "Business Features", name: "Email Notifications" },
    // Reports
    { cat: "Reports", name: "Membership Reports" },
    { cat: "Reports", name: "Revenue Reports" },
    { cat: "Reports", name: "Retention Reports" },
    // Authentication & Support
    { cat: "Authentication", name: "Role-Based Access" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Membership
    { cat: "Membership", name: "Multi-Tenant Membership" },
    { cat: "Membership", name: "Multi-language" },
    { cat: "Membership", name: "Multi-currency" },
    { cat: "Membership", name: "White Label Platform" },
    { cat: "Membership", name: "API Integrations" },
    { cat: "Membership", name: "Workflow Automation" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "SSO" },
    { cat: "Enterprise Features", name: "Marketing Automation" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Custom Reports" },
    { cat: "Analytics", name: "Predictive Analytics" },
    // Security
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "Enterprise Security" },
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
        description: `${fDef.name} for membership website platform.`,
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

  // 5. Ensure all 4 Membership Packages Exist under serviceTypeId
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

  const starterPkgId = await ensurePackage("Starter Membership", "starter-membership", 49999, 12, 10, 4, false, 1, "Best for coaches, creators, small communities & subscription services with protected content.");
  const proPkgId = await ensurePackage("Professional Membership", "professional-membership", 99999, 21, 25, 7, true, 2, "Everything in Starter + Recurring Subscription, Membership Levels, Content Drip & Event Registration.");
  const busPkgId = await ensurePackage("Business Membership", "business-membership", 199999, 35, 50, 10, false, 3, "Everything in Professional + Community Forum, Group Management, Messaging, Loyalty Program & Retention Reports.");
  const entPkgId = await ensurePackage("Enterprise Membership", "enterprise-membership", 399999, 60, -1, 99, false, 4, "Everything in Business + Multi-Tenant, Multi-language, White Label, SSO, Predictive Analytics & BI.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter Membership (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Membership (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Membership (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Membership (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure Membership Paid Add-ons Exist
  console.log("Checking Add-on Categories for Membership add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let membershipAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("membership") || d.data().name?.toLowerCase().includes("community")
  );

  let membershipAddonCatId = "";
  if (!membershipAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    membershipAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Membership & Community Add-ons",
      icon: "Users",
      sortOrder: 10,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Membership & Community Add-ons (${membershipAddonCatId})`);
  } else {
    membershipAddonCatId = membershipAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: membershipAddonCatId, name: "Native Mobile Community App", description: "iOS & Android app for members & notifications.", pricingType: "fixed", price: 85000 },
    { categoryId: membershipAddonCatId, name: "AI Community Assistant", description: "AI chatbot for member onboarding & support.", pricingType: "fixed", price: 25000 },
    { categoryId: membershipAddonCatId, name: "WhatsApp Business API", description: "Automated subscription renewal & event reminders.", pricingType: "fixed", price: 12000 },
    { categoryId: membershipAddonCatId, name: "SMS Gateway Integration", description: "Transactional member OTP & renewal alerts.", pricingType: "fixed", price: 8000 },
    { categoryId: membershipAddonCatId, name: "Payment Gateway Integration", description: "Stripe/Razorpay subscription checkout.", pricingType: "fixed", price: 10000 },
    { categoryId: membershipAddonCatId, name: "Email Marketing Automation", description: "Drip campaign & automated retention setup.", pricingType: "fixed", price: 18000 },
    { categoryId: membershipAddonCatId, name: "Custom API Integrations", description: "REST API & webhook integrations.", pricingType: "fixed", price: 20000 },
    { categoryId: membershipAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, backups & security.", pricingType: "fixed", price: 24000 },
    { categoryId: membershipAddonCatId, name: "Digital Marketing & Growth", description: "Member acquisition & funnel optimization.", pricingType: "fixed", price: 25000 },
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

  console.log("🎉 Successfully completed Membership Website Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
