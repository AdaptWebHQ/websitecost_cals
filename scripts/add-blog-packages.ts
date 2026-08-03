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
  console.log("🚀 Starting Blog Website Packages Migration...");

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

  // 2. Find Blog Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let blogTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("blog") ||
    d.data().slug?.includes("blog")
  );

  let serviceTypeId = "";

  if (!blogTypeDoc) {
    console.log("Creating 'Blog Website' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Blog Website",
      slug: "blog-website",
      description: "Designed for content creators, publishers, news blogs, and personal writers.",
      icon: "BookOpen",
      sortOrder: 9,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Blog Website Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = blogTypeDoc.id;
    console.log(`✅ Found Blog Website Service Type: ${blogTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Blog",
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
        icon: "Edit3",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Blog Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Blog Listing" },
    { cat: "Website Structure", name: "Blog Details" },
    { cat: "Website Structure", name: "Categories" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // Blog
    { cat: "Blog", name: "Blog Management" },
    { cat: "Blog", name: "Categories" },
    { cat: "Blog", name: "Tags" },
    { cat: "Blog", name: "Rich Text Editor" },
    { cat: "Blog", name: "Featured Posts" },
    { cat: "Blog", name: "Search" },
    { cat: "Blog", name: "Author Profile" },
    // Authentication
    { cat: "Authentication", name: "Admin Login" },
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
    // Blog
    { cat: "Blog", name: "Multiple Authors" },
    { cat: "Blog", name: "Draft & Publish" },
    { cat: "Blog", name: "Scheduled Publishing" },
    { cat: "Blog", name: "Related Posts" },
    { cat: "Blog", name: "Popular Posts" },
    { cat: "Blog", name: "Reading Time" },
    { cat: "Blog", name: "Newsletter Subscription" },
    { cat: "Blog", name: "Comments" },
    // CMS
    { cat: "CMS", name: "Media Library" },
    { cat: "CMS", name: "Blog CMS" },
    // Analytics
    { cat: "Analytics", name: "Blog Analytics" },
    { cat: "Analytics", name: "Visitor Dashboard" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Canonical URLs" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Blog
    { cat: "Blog", name: "Member-only Articles" },
    { cat: "Blog", name: "Premium Content" },
    { cat: "Blog", name: "Content Approval Workflow" },
    { cat: "Blog", name: "Series Management" },
    { cat: "Blog", name: "Bookmarks" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "User Management" },
    { cat: "Business Features", name: "Email Notifications" },
    // Reports
    { cat: "Reports", name: "Reader Reports" },
    { cat: "Reports", name: "Content Performance" },
    { cat: "Reports", name: "Author Performance" },
    // Authentication & Support
    { cat: "Authentication", name: "Role-Based Access" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Blog
    { cat: "Blog", name: "Multi-language" },
    { cat: "Blog", name: "Multi-site Blogs" },
    { cat: "Blog", name: "Headless API" },
    { cat: "Blog", name: "AI Content Suggestions" },
    { cat: "Blog", name: "Workflow Automation" },
    { cat: "Blog", name: "API Integrations" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "SSO" },
    { cat: "Enterprise Features", name: "CRM Integration" },
    { cat: "Enterprise Features", name: "Marketing Automation" },
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
        description: `${fDef.name} for blog website platform.`,
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

  // 5. Ensure all 4 Blog Packages Exist under serviceTypeId
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

  const starterPkgId = await ensurePackage("Starter Blog", "starter-blog", 19999, 7, 5, 3, false, 1, "Best for individual bloggers, content creators, and small businesses with tags & author profile.");
  const proPkgId = await ensurePackage("Professional Blog", "professional-blog", 39999, 14, 15, 5, true, 2, "Everything in Starter + Multiple Authors, Scheduled Publishing, Reading Time, Newsletter & Comments.");
  const busPkgId = await ensurePackage("Business Blog", "business-blog", 69999, 25, 30, 8, false, 3, "Everything in Professional + Member-only Articles, Premium Content, Content Approval & Reader Analytics.");
  const entPkgId = await ensurePackage("Enterprise Blog", "enterprise-blog", 129999, 45, -1, 99, false, 4, "Everything in Business + Multi-language, Multi-site Blogs, Headless API, AI Suggestions & Marketing Sync.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter Blog (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Blog (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Blog (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Blog (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure Blog Paid Add-ons Exist
  console.log("Checking Add-on Categories for Blog add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let blogAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("blog") || d.data().name?.toLowerCase().includes("publishing")
  );

  let blogAddonCatId = "";
  if (!blogAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    blogAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Blog Publishing & Audience Add-ons",
      icon: "Edit3",
      sortOrder: 9,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Blog Publishing & Audience Add-ons (${blogAddonCatId})`);
  } else {
    blogAddonCatId = blogAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: blogAddonCatId, name: "Native Mobile Blog Reader App", description: "iOS & Android reader application.", pricingType: "fixed", price: 65000 },
    { categoryId: blogAddonCatId, name: "AI Content Writer", description: "Automated AI blog post outline & draft writer.", pricingType: "fixed", price: 20000 },
    { categoryId: blogAddonCatId, name: "AI SEO Assistant", description: "Automated SEO title & meta description helper.", pricingType: "fixed", price: 15000 },
    { categoryId: blogAddonCatId, name: "Email Marketing Setup", description: "Mailchimp / Substack integration & popup setup.", pricingType: "fixed", price: 12000 },
    { categoryId: blogAddonCatId, name: "Ad Management & Monitization", description: "Google AdSense & affiliate banner placement.", pricingType: "fixed", price: 15000 },
    { categoryId: blogAddonCatId, name: "Content Migration (per 100 posts)", description: "Migrate legacy articles from Medium/WordPress.", pricingType: "fixed", price: 15000 },
    { categoryId: blogAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance & security updates.", pricingType: "fixed", price: 18000 },
    { categoryId: blogAddonCatId, name: "Digital Marketing & SEO Setup", description: "Initial keyword strategy & social push.", pricingType: "fixed", price: 20000 },
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

  console.log("🎉 Successfully completed Blog Website Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
