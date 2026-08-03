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
  console.log("🚀 Starting Custom Web Application Packages Migration...");

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

  // 2. Find Custom Web Application Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let webappTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("custom web application") ||
    d.data().slug?.includes("custom-web-application") ||
    d.data().name?.toLowerCase().includes("custom web app")
  );

  let serviceTypeId = "";

  if (!webappTypeDoc) {
    console.log("Creating 'Custom Web Application' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Custom Web Application",
      slug: "custom-web-application",
      description: "Tailored web software built around unique business workflows (CRM, ERP, SaaS, HRMS, Logistics).",
      icon: "Code",
      sortOrder: 14,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Custom Web Application Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = webappTypeDoc.id;
    console.log(`✅ Found Custom Web Application Service Type: ${webappTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Authentication",
    "Dashboard",
    "CRUD Management",
    "Business Modules",
    "Notifications",
    "SEO & Performance",
    "Security",
    "Deployment",
    "Support",
    "API & Integrations",
    "Analytics",
    "Reports",
    "Enterprise Features",
    "Performance",
    "Infrastructure",
    "DevOps",
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
        icon: "Cpu",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Custom Web Application Package
  const mvpFeatureDefs: { cat: string; name: string }[] = [
    // Dashboard
    { cat: "Dashboard", name: "Admin Dashboard" },
    { cat: "Dashboard", name: "Basic Analytics" },
    { cat: "Dashboard", name: "Overview Cards" },
    { cat: "Dashboard", name: "Activity Feed" },
    // Authentication
    { cat: "Authentication", name: "User Registration" },
    { cat: "Authentication", name: "Login" },
    { cat: "Authentication", name: "Password Reset" },
    { cat: "Authentication", name: "Email Verification" },
    // CRUD Management
    { cat: "CRUD Management", name: "Create" },
    { cat: "CRUD Management", name: "Read" },
    { cat: "CRUD Management", name: "Update" },
    { cat: "CRUD Management", name: "Delete" },
    { cat: "CRUD Management", name: "Search" },
    { cat: "CRUD Management", name: "Filters" },
    // Design & Experience
    { cat: "Design & Experience", name: "Premium UI" },
    { cat: "Design & Experience", name: "Responsive Design" },
    { cat: "Design & Experience", name: "Mobile First" },
    // Notifications
    { cat: "Notifications", name: "Email Notifications" },
    { cat: "Notifications", name: "In-App Notifications" },
    // Security & Deployment & Support
    { cat: "Security", name: "SSL" },
    { cat: "Security", name: "Role-Based Access" },
    { cat: "Security", name: "Audit Logs (Basic)" },
    { cat: "Deployment", name: "Production Deployment" },
    { cat: "Deployment", name: "Domain Setup" },
    { cat: "Deployment", name: "Hosting Configuration" },
    { cat: "Support", name: "3 Months Support" },
  ];

  const proFeatureDefs: { cat: string; name: string }[] = [
    // Business Modules
    { cat: "Business Modules", name: "Multiple Modules" },
    { cat: "Business Modules", name: "Workflow Management" },
    { cat: "Business Modules", name: "Document Management" },
    { cat: "Business Modules", name: "Reports" },
    { cat: "Business Modules", name: "File Uploads" },
    { cat: "Business Modules", name: "Approval System" },
    { cat: "Business Modules", name: "Calendar" },
    { cat: "Business Modules", name: "Task Management" },
    // Dashboard
    { cat: "Dashboard", name: "Custom Dashboards" },
    { cat: "Dashboard", name: "Charts" },
    { cat: "Dashboard", name: "KPI Reports" },
    // Authentication
    { cat: "Authentication", name: "Multi-Role Access" },
    { cat: "Authentication", name: "Permission Management" },
    // Notifications
    { cat: "Notifications", name: "SMS Integration" },
    { cat: "Notifications", name: "Push Notifications" },
    // API & Integrations
    { cat: "API & Integrations", name: "Third-Party API Integrations" },
    { cat: "API & Integrations", name: "REST API" },
    // Support
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Business Modules
    { cat: "Business Modules", name: "Multi-Department Management" },
    { cat: "Business Modules", name: "Workflow Automation" },
    { cat: "Business Modules", name: "CRM Integration" },
    { cat: "Business Modules", name: "ERP Integration" },
    { cat: "Business Modules", name: "Inventory Module" },
    { cat: "Business Modules", name: "Billing Module" },
    { cat: "Business Modules", name: "Document Approval" },
    { cat: "Business Modules", name: "Advanced Reports" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Executive Dashboard" },
    { cat: "Analytics", name: "Forecast Reports" },
    // Security
    { cat: "Security", name: "Two-Factor Authentication (2FA)" },
    { cat: "Security", name: "Advanced Audit Logs" },
    // Performance
    { cat: "Performance", name: "Queue Processing" },
    { cat: "Performance", name: "Caching" },
    { cat: "Performance", name: "Background Jobs" },
    // Support
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "Dedicated Technical Support" },
    { cat: "Support", name: "12 Months Support" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Enterprise Features
    { cat: "Enterprise Features", name: "Multi-Tenant SaaS" },
    { cat: "Enterprise Features", name: "White Label Solution" },
    { cat: "Enterprise Features", name: "Multi-Company Support" },
    { cat: "Enterprise Features", name: "Multi-Language" },
    { cat: "Enterprise Features", name: "Multi-Currency" },
    { cat: "Enterprise Features", name: "Single Sign-On (SSO)" },
    { cat: "Enterprise Features", name: "Microservices Architecture" },
    { cat: "Enterprise Features", name: "Event-Driven Architecture" },
    { cat: "Enterprise Features", name: "API Gateway" },
    { cat: "Enterprise Features", name: "Workflow Automation Engine" },
    // API & Integrations
    { cat: "API & Integrations", name: "HRMS Integration" },
    { cat: "API & Integrations", name: "Payment Gateway" },
    { cat: "API & Integrations", name: "SMS Gateway" },
    { cat: "API & Integrations", name: "Email Services" },
    { cat: "API & Integrations", name: "Accounting Software" },
    { cat: "API & Integrations", name: "Government APIs" },
    { cat: "API & Integrations", name: "Any Third-Party APIs" },
    // Infrastructure
    { cat: "Infrastructure", name: "Auto Scaling" },
    { cat: "Infrastructure", name: "Load Balancer" },
    { cat: "Infrastructure", name: "CDN" },
    { cat: "Infrastructure", name: "Backup & Disaster Recovery" },
    { cat: "Infrastructure", name: "High Availability" },
    // DevOps
    { cat: "DevOps", name: "CI/CD Pipeline" },
    { cat: "DevOps", name: "Staging Environment" },
    { cat: "DevOps", name: "Monitoring & Logging" },
    { cat: "DevOps", name: "Documentation" },
    // Security
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Compliance Features" },
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "IP Restrictions" },
    // Support
    { cat: "Support", name: "Dedicated Project Manager" },
    { cat: "Support", name: "SLA Support" },
    { cat: "Support", name: "Priority Bug Fixes" },
    { cat: "Support", name: "Long-Term Maintenance" },
  ];

  const allFeatureDefs = [
    ...mvpFeatureDefs,
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
        description: `${fDef.name} for custom web application platform.`,
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

  // 5. Ensure all 4 Custom Web Application Packages Exist under serviceTypeId
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

  const mvpPkgId = await ensurePackage("MVP", "custom-app-mvp", 199999, 30, 15, 5, false, 1, "Best for startups, new SaaS products, internal tools, and proof of concept with admin dashboard & CRUD.");
  const proPkgId = await ensurePackage("Professional Custom App", "custom-app-professional", 499999, 60, 35, 10, true, 2, "Everything in MVP + Multiple Modules, Workflow Management, Document System, Custom Dashboards & REST APIs.");
  const busPkgId = await ensurePackage("Business Custom App", "custom-app-business", 999999, 90, 75, 15, false, 3, "Everything in Professional + Multi-Department, Workflow Automation, CRM/ERP Integration, BI & 2FA.");
  const entPkgId = await ensurePackage("Enterprise Custom App", "custom-app-enterprise", 1499999, 120, -1, 99, false, 4, "Everything in Business + Multi-Tenant SaaS, White Label, Microservices, Event-Driven, SSO & SLA Support.");

  const mvpFeatureIds = Array.from(new Set(mvpFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...mvpFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(mvpPkgId).update({
    includedFeatureIds: mvpFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated MVP (${mvpPkgId}) with ${mvpFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Custom App (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Custom App (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Custom App (${entPkgId}) with ${entFeatureIds.length} features.`);

  // 6. Sync bidirectional packageIds on features
  for (const [featName, featId] of Object.entries(featureIdMap)) {
    const isMvp = mvpFeatureDefs.some((f) => f.name === featName);
    const isPro = proFeatureDefs.some((f) => f.name === featName) || isMvp;
    const isBus = busFeatureDefs.some((f) => f.name === featName) || isPro;
    const isEnt = true;

    const assignedPkgIds: string[] = [];
    if (isMvp) assignedPkgIds.push(mvpPkgId);
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

  // 7. Ensure Custom Web Application Paid Add-ons Exist
  console.log("Checking Add-on Categories for Custom Web App add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let webappAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("custom") || d.data().name?.toLowerCase().includes("saas")
  );

  let webappAddonCatId = "";
  if (!webappAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    webappAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Custom Software & AI Infrastructure Add-ons",
      icon: "Code",
      sortOrder: 14,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Custom Software & AI Infrastructure Add-ons (${webappAddonCatId})`);
  } else {
    webappAddonCatId = webappAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: webappAddonCatId, name: "Native Mobile App (Android & iOS)", description: "Cross-platform mobile companion application.", pricingType: "fixed", price: 120000 },
    { categoryId: webappAddonCatId, name: "AI Features (Chatbot, OCR, Predictions)", description: "AI automation engine, document OCR & predictive analytics.", pricingType: "fixed", price: 60000 },
    { categoryId: webappAddonCatId, name: "Legacy Data Migration", description: "SQL/Excel/JSON legacy data cleanup & migration.", pricingType: "fixed", price: 35000 },
    { categoryId: webappAddonCatId, name: "Third-Party API Integration & Licenses", description: "Integration with proprietary third-party software APIs.", pricingType: "fixed", price: 30000 },
    { categoryId: webappAddonCatId, name: "Cloud Infrastructure Setup (AWS/GCP/Azure)", description: "DevOps Terraform, Kubernetes & cloud architecture.", pricingType: "fixed", price: 45000 },
    { categoryId: webappAddonCatId, name: "SMS & Email Gateway Credits Setup", description: "Configuration & warmup for transactional communications.", pricingType: "fixed", price: 15000 },
    { categoryId: webappAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, security patches & backups.", pricingType: "fixed", price: 50000 },
    { categoryId: webappAddonCatId, name: "Ongoing Feature Development (Monthly Retainer)", description: "Dedicated developer hours for continuous enhancements.", pricingType: "fixed", price: 65000 },
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

  console.log("🎉 Successfully completed Custom Web Application Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
