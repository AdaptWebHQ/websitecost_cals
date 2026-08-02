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
  console.log("🚀 Starting Web Portal Packages Migration...");

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

  // 2. Find Web Portal Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let portalTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase() === "web portal" ||
    (d.data().name?.toLowerCase().includes("portal") && !d.data().name?.toLowerCase().includes("job"))
  );

  let serviceTypeId = "";

  if (!portalTypeDoc) {
    console.log("Creating 'Web Portal' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Web Portal",
      slug: "web-portal",
      description: "Secure dashboard platforms for employees, vendors, customers, dealers, healthcare, and institutions.",
      icon: "Globe",
      sortOrder: 12,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Web Portal Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = portalTypeDoc.id;
    console.log(`✅ Found Web Portal Service Type: ${portalTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Web Portal",
    "Authentication",
    "Notifications",
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
        icon: "LayoutDashboard",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Web Portal Package
  const proFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Login" },
    { cat: "Website Structure", name: "Dashboard" },
    { cat: "Website Structure", name: "Profile" },
    { cat: "Website Structure", name: "Notifications" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // Web Portal
    { cat: "Web Portal", name: "User Dashboard" },
    { cat: "Web Portal", name: "Profile Management" },
    { cat: "Web Portal", name: "Document Management" },
    { cat: "Web Portal", name: "Activity History" },
    { cat: "Web Portal", name: "File Uploads" },
    { cat: "Web Portal", name: "Search" },
    { cat: "Web Portal", name: "Role-Based Navigation" },
    { cat: "Web Portal", name: "User Settings" },
    // Authentication
    { cat: "Authentication", name: "User Registration" },
    { cat: "Authentication", name: "Secure Login" },
    { cat: "Authentication", name: "Password Reset" },
    { cat: "Authentication", name: "Email Verification" },
    // Notifications
    { cat: "Notifications", name: "Email Notifications" },
    { cat: "Notifications", name: "In-App Notifications" },
    // Design & Experience
    { cat: "Design & Experience", name: "Premium UI" },
    { cat: "Design & Experience", name: "Responsive Design" },
    { cat: "Design & Experience", name: "Mobile First" },
    // Security & Deployment & Support
    { cat: "Security", name: "SSL" },
    { cat: "Security", name: "Spam Protection" },
    { cat: "Security", name: "Secure Authentication" },
    { cat: "Deployment", name: "Domain Setup" },
    { cat: "Deployment", name: "Hosting Deployment" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Web Portal
    { cat: "Web Portal", name: "Multi-Role Dashboards" },
    { cat: "Web Portal", name: "Approval Workflow" },
    { cat: "Web Portal", name: "Task Management" },
    { cat: "Web Portal", name: "Document Sharing" },
    { cat: "Web Portal", name: "Calendar" },
    { cat: "Web Portal", name: "Reports" },
    { cat: "Web Portal", name: "Audit Trail" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Staff Dashboard" },
    { cat: "Business Features", name: "Team Management" },
    { cat: "Business Features", name: "Department Management" },
    // Notifications
    { cat: "Notifications", name: "Push Notifications" },
    { cat: "Notifications", name: "Reminder Notifications" },
    // Analytics
    { cat: "Analytics", name: "Dashboard Analytics" },
    { cat: "Analytics", name: "User Activity Reports" },
    // Authentication & Support
    { cat: "Authentication", name: "Advanced Role-Based Access" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "Priority Support" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Web Portal
    { cat: "Web Portal", name: "Multi-Tenant Architecture" },
    { cat: "Web Portal", name: "Workflow Automation" },
    { cat: "Web Portal", name: "API Integrations" },
    { cat: "Web Portal", name: "Digital Approvals" },
    { cat: "Web Portal", name: "Custom Forms" },
    { cat: "Web Portal", name: "Multi-language" },
    { cat: "Web Portal", name: "Multi-location" },
    { cat: "Web Portal", name: "Advanced Search" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "CRM Integration" },
    { cat: "Enterprise Features", name: "HRMS Integration" },
    { cat: "Enterprise Features", name: "Single Sign-On (SSO)" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Custom Dashboards" },
    { cat: "Analytics", name: "Executive Reports" },
    // Security
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "Backup & Recovery" },
    { cat: "Security", name: "IP Restrictions" },
    { cat: "Security", name: "Two-Factor Authentication (2FA)" },
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
    { cat: "Support", name: "SLA Support" },
    { cat: "Support", name: "12 Months Support" },
  ];

  const allFeatureDefs = [
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
        description: `${fDef.name} for web portal platform.`,
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

  // 5. Ensure all 3 Web Portal Packages Exist under serviceTypeId
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

  const proPkgId = await ensurePackage("Professional Portal", "professional-portal", 149999, 28, 25, 5, true, 1, "Best for companies, schools, healthcare, dealers & vendors with personalized user dashboard & document management.");
  const busPkgId = await ensurePackage("Business Portal", "business-portal", 299999, 45, 50, 10, false, 2, "Everything in Professional + Multi-Role Dashboards, Approval Workflow, Task Management, Audit Trail & Source Code.");
  const entPkgId = await ensurePackage("Enterprise Portal", "enterprise-portal", 599999, 75, -1, 99, false, 3, "Everything in Business + Multi-Tenant Architecture, Digital Approvals, ERP/CRM/HRMS/SSO & 2FA.");

  const proFeatureIds = Array.from(new Set(proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Portal (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Portal (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Portal (${entPkgId}) with ${entFeatureIds.length} features.`);

  // 6. Sync bidirectional packageIds on features
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isPro = proFeatureDefs.some((f) => f.name === featName);
    const isBus = busFeatureDefs.some((f) => f.name === featName) || isPro;
    const isEnt = true;

    const assignedPkgIds: string[] = [];
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

  // 7. Ensure Web Portal Paid Add-ons Exist
  console.log("Checking Add-on Categories for Web Portal add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let portalAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("portal") || d.data().name?.toLowerCase().includes("web portal")
  );

  let portalAddonCatId = "";
  if (!portalAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    portalAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Web Portal & Security Integration Add-ons",
      icon: "Globe",
      sortOrder: 12,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Web Portal & Security Integration Add-ons (${portalAddonCatId})`);
  } else {
    portalAddonCatId = portalAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: portalAddonCatId, name: "Native Mobile Portal App (iOS & Android)", description: "Mobile user & admin dashboard application.", pricingType: "fixed", price: 85000 },
    { categoryId: portalAddonCatId, name: "AI Portal Assistant", description: "AI chatbot assistant for user queries & ticket handling.", pricingType: "fixed", price: 30000 },
    { categoryId: portalAddonCatId, name: "WhatsApp Business API Integration", description: "In-app notifications & OTP alerts via WhatsApp.", pricingType: "fixed", price: 12000 },
    { categoryId: portalAddonCatId, name: "SMS Gateway Integration", description: "Transactional portal login & verification SMS.", pricingType: "fixed", price: 8000 },
    { categoryId: portalAddonCatId, name: "Custom ERP Connectors (SAP/Oracle/Tally)", description: "Custom two-way ERP data sync API.", pricingType: "fixed", price: 45000 },
    { categoryId: portalAddonCatId, name: "Custom CRM Connectors (Salesforce/HubSpot)", description: "Two-way CRM lead & client sync.", pricingType: "fixed", price: 35000 },
    { categoryId: portalAddonCatId, name: "Payment Gateway Integration", description: "Online portal invoice & fee payments.", pricingType: "fixed", price: 10000 },
    { categoryId: portalAddonCatId, name: "Biometric & Attendance Integration", description: "Biometric hardware API integration.", pricingType: "fixed", price: 30000 },
    { categoryId: portalAddonCatId, name: "Digital Signature Integration (Aadhaar/DocuSign)", description: "Legally binding digital document signing.", pricingType: "fixed", price: 25000 },
    { categoryId: portalAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, security & backups.", pricingType: "fixed", price: 36000 },
    { categoryId: portalAddonCatId, name: "Digital Marketing & User Onboarding", description: "Portal adoption campaigns & user training.", pricingType: "fixed", price: 25000 },
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

  console.log("🎉 Successfully completed Web Portal Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
