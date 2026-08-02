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
  console.log("🚀 Starting Booking & Appointment Website Packages Migration...");

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

  // 2. Find Booking & Appointment Website Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let bookingTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("booking")
  );

  let serviceTypeId = "";

  if (!bookingTypeDoc) {
    console.log("Creating 'Booking & Appointment Website' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Booking & Appointment Website",
      slug: "booking-appointment-website",
      description: "Designed for appointment-based businesses, salons, clinics, consultants, and scheduling.",
      icon: "Calendar",
      sortOrder: 6,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Booking & Appointment Website Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = bookingTypeDoc.id;
    console.log(`✅ Found Booking & Appointment Website Service Type: ${bookingTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Booking & Scheduling",
    "Authentication",
    "Lead Generation",
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
        icon: "Calendar",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Booking Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Services" },
    { cat: "Website Structure", name: "Book Appointment" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // Booking & Scheduling
    { cat: "Booking & Scheduling", name: "Appointment Booking" },
    { cat: "Booking & Scheduling", name: "Calendar View" },
    { cat: "Booking & Scheduling", name: "Time Slot Selection" },
    { cat: "Booking & Scheduling", name: "Service Selection" },
    { cat: "Booking & Scheduling", name: "Staff Selection" },
    { cat: "Booking & Scheduling", name: "Booking Confirmation" },
    { cat: "Booking & Scheduling", name: "Booking History" },
    { cat: "Booking & Scheduling", name: "Booking Status" },
    // Authentication
    { cat: "Authentication", name: "Customer Registration" },
    { cat: "Authentication", name: "Customer Login" },
    // Lead Generation
    { cat: "Lead Generation", name: "Contact Form" },
    { cat: "Lead Generation", name: "WhatsApp" },
    { cat: "Lead Generation", name: "Call Button" },
    { cat: "Lead Generation", name: "Google Maps" },
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
    // Booking & Scheduling
    { cat: "Booking & Scheduling", name: "Reschedule Booking" },
    { cat: "Booking & Scheduling", name: "Cancel Booking" },
    { cat: "Booking & Scheduling", name: "Booking Reminders" },
    { cat: "Booking & Scheduling", name: "Email Notifications" },
    { cat: "Booking & Scheduling", name: "SMS Notifications" },
    { cat: "Booking & Scheduling", name: "Service Duration" },
    { cat: "Booking & Scheduling", name: "Staff Availability" },
    { cat: "Booking & Scheduling", name: "Holiday Management" },
    { cat: "Booking & Scheduling", name: "Recurring Appointments" },
    // CMS
    { cat: "CMS", name: "Service CMS" },
    { cat: "CMS", name: "Staff CMS" },
    { cat: "CMS", name: "Media Library" },
    // Analytics
    { cat: "Analytics", name: "Appointment Dashboard" },
    { cat: "Analytics", name: "Customer Dashboard" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Booking & Scheduling
    { cat: "Booking & Scheduling", name: "Online Payments" },
    { cat: "Booking & Scheduling", name: "Advance Booking Payment" },
    { cat: "Booking & Scheduling", name: "Invoice Generation" },
    { cat: "Booking & Scheduling", name: "Waiting List" },
    { cat: "Booking & Scheduling", name: "Queue Management" },
    { cat: "Booking & Scheduling", name: "Multi Branch Booking" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Staff Dashboard" },
    { cat: "Business Features", name: "CRM Integration" },
    { cat: "Business Features", name: "Customer Management" },
    { cat: "Business Features", name: "Reports Dashboard" },
    // Authentication
    { cat: "Authentication", name: "Role Based Access" },
    // Reports
    { cat: "Reports", name: "Revenue Reports" },
    { cat: "Reports", name: "Appointment Reports" },
    { cat: "Reports", name: "Staff Performance Reports" },
    // Support
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Booking & Scheduling
    { cat: "Booking & Scheduling", name: "Multi-location Booking" },
    { cat: "Booking & Scheduling", name: "Video Consultation Booking" },
    { cat: "Booking & Scheduling", name: "API Integrations" },
    { cat: "Booking & Scheduling", name: "Workflow Automation" },
    { cat: "Booking & Scheduling", name: "Calendar Sync (Google/Outlook)" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "HRMS Integration" },
    { cat: "Enterprise Features", name: "Multi-language" },
    { cat: "Enterprise Features", name: "Multi-currency" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence Dashboard" },
    { cat: "Analytics", name: "Custom Reports" },
    { cat: "Analytics", name: "Forecast Reports" },
    // Security
    { cat: "Security", name: "Audit Logs" },
    { cat: "Security", name: "Enterprise Security" },
    { cat: "Security", name: "Backup System" },
    // Performance
    { cat: "Performance", name: "CDN" },
    { cat: "Performance", name: "Performance Monitoring" },
    { cat: "Performance", name: "Auto Scaling" },
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
        description: `${fDef.name} for booking and appointment scheduling.`,
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

  // 5. Ensure all 4 Booking Packages Exist under serviceTypeId
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

  const starterPkgId = await ensurePackage("Starter Booking", "starter-booking", 29999, 10, 5, 3, false, 1, "Best for small businesses, salons, clinics, consultants with appointment booking & calendar.");
  const proPkgId = await ensurePackage("Professional Booking", "professional-booking", 59999, 14, 15, 5, true, 2, "Everything in Starter + Reschedule, Cancel, Reminders, Staff Availability, CMS & Dashboards.");
  const busPkgId = await ensurePackage("Business Booking", "business-booking", 99999, 25, 25, 8, false, 3, "Everything in Professional + Online Payments, Advance Payment, Invoice, Queue & Multi-Branch.");
  const entPkgId = await ensurePackage("Enterprise Booking", "enterprise-booking", 199999, 45, -1, 99, false, 4, "Everything in Business + Multi-location, Video Consultation, Google/Outlook Calendar Sync & ERP.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter Booking (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Booking (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Booking (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Booking (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure Booking Paid Add-ons Exist
  console.log("Checking Add-on Categories for Booking add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let bookingCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("booking") || d.data().name?.toLowerCase().includes("appointment")
  );

  let bookingAddonCatId = "";
  if (!bookingCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    bookingAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Booking & Virtual Integration Add-ons",
      icon: "Calendar",
      sortOrder: 6,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Booking & Virtual Integration Add-ons (${bookingAddonCatId})`);
  } else {
    bookingAddonCatId = bookingCatDoc.id;
  }

  const addonDefs = [
    { categoryId: bookingAddonCatId, name: "Mobile App (iOS & Android)", description: "Customer & staff scheduling app.", pricingType: "fixed", price: 75000 },
    { categoryId: bookingAddonCatId, name: "AI Appointment Assistant", description: "AI chatbot for 24/7 automated booking assistance.", pricingType: "fixed", price: 25000 },
    { categoryId: bookingAddonCatId, name: "WhatsApp Business API", description: "Automated booking reminders & confirmation messages.", pricingType: "fixed", price: 12000 },
    { categoryId: bookingAddonCatId, name: "SMS Gateway Integration", description: "Transactional appointment OTP & reminder SMS.", pricingType: "fixed", price: 8000 },
    { categoryId: bookingAddonCatId, name: "Zoom / Google Meet Integration", description: "Automated video consultation link creation.", pricingType: "fixed", price: 15000 },
    { categoryId: bookingAddonCatId, name: "Telemedicine Module", description: "E-prescriptions & patient consultation records.", pricingType: "fixed", price: 35000 },
    { categoryId: bookingAddonCatId, name: "Customer Loyalty Program", description: "Reward points for repeat bookings.", pricingType: "fixed", price: 18000 },
    { categoryId: bookingAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance & security updates.", pricingType: "fixed", price: 24000 },
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

  console.log("🎉 Successfully completed Booking & Appointment Website Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
