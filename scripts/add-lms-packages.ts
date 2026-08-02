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
  console.log("🚀 Starting Learning Management System (LMS) Packages Migration...");

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

  // 2. Find Learning Management System (LMS) Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let lmsTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("lms") ||
    d.data().name?.toLowerCase().includes("learning")
  );

  let serviceTypeId = "";

  if (!lmsTypeDoc) {
    console.log("Creating 'Learning Management System (LMS)' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Learning Management System (LMS)",
      slug: "learning-management-system-lms",
      description: "Designed for coaching institutes, schools, academies, corporate training, and online courses.",
      icon: "GraduationCap",
      sortOrder: 7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created LMS Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = lmsTypeDoc.id;
    console.log(`✅ Found LMS Service Type: ${lmsTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "LMS",
    "Authentication",
    "SEO & Performance",
    "Security",
    "Deployment",
    "Support",
    "CMS",
    "Notifications",
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
        icon: "BookOpen",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each LMS Package
  const starterFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Courses" },
    { cat: "Website Structure", name: "Course Details" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // LMS
    { cat: "LMS", name: "Course Management" },
    { cat: "LMS", name: "Course Categories" },
    { cat: "LMS", name: "Lesson Management" },
    { cat: "LMS", name: "Video Lessons" },
    { cat: "LMS", name: "PDF Resources" },
    { cat: "LMS", name: "Student Dashboard" },
    { cat: "LMS", name: "Course Enrollment" },
    { cat: "LMS", name: "Progress Tracking" },
    { cat: "LMS", name: "Course Completion" },
    // Authentication
    { cat: "Authentication", name: "Student Registration" },
    { cat: "Authentication", name: "Student Login" },
    { cat: "Authentication", name: "Admin Login" },
    // Design & Experience
    { cat: "Design & Experience", name: "Responsive Design" },
    { cat: "Design & Experience", name: "Premium UI" },
    { cat: "Design & Experience", name: "Mobile First" },
    { cat: "Design & Experience", name: "Smooth Animations" },
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
    // LMS
    { cat: "LMS", name: "Quizzes" },
    { cat: "LMS", name: "Assignments" },
    { cat: "LMS", name: "Certificates" },
    { cat: "LMS", name: "Drip Content" },
    { cat: "LMS", name: "Live Classes" },
    { cat: "LMS", name: "Discussion Forum" },
    { cat: "LMS", name: "Course Reviews" },
    { cat: "LMS", name: "Instructor Dashboard" },
    // CMS
    { cat: "CMS", name: "Course CMS" },
    { cat: "CMS", name: "Lesson CMS" },
    { cat: "CMS", name: "Media Library" },
    // Notifications
    { cat: "Notifications", name: "Email Notifications" },
    { cat: "Notifications", name: "Course Reminders" },
    // Analytics
    { cat: "Analytics", name: "Course Analytics" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "SEO & Performance", name: "Image Optimization" },
    { cat: "Support", name: "Admin Training" },
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // LMS
    { cat: "LMS", name: "Multiple Instructors" },
    { cat: "LMS", name: "Batch Management" },
    { cat: "LMS", name: "Attendance Management" },
    { cat: "LMS", name: "Online Exams" },
    { cat: "LMS", name: "Question Bank" },
    { cat: "LMS", name: "Assignment Evaluation" },
    { cat: "LMS", name: "Student Reports" },
    { cat: "LMS", name: "Leaderboards" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Student Management" },
    { cat: "Business Features", name: "CRM Integration" },
    // Reports
    { cat: "Reports", name: "Revenue Reports" },
    { cat: "Reports", name: "Student Performance Reports" },
    { cat: "Reports", name: "Course Reports" },
    // Authentication & Support
    { cat: "Authentication", name: "Role-Based Access" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "6 Months Maintenance" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // LMS
    { cat: "LMS", name: "Multi-Tenant LMS" },
    { cat: "LMS", name: "White Label Platform" },
    { cat: "LMS", name: "Multi-language" },
    { cat: "LMS", name: "Learning Paths" },
    { cat: "LMS", name: "SCORM/xAPI Support" },
    { cat: "LMS", name: "API Integrations" },
    { cat: "LMS", name: "Corporate Training Portal" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "HRMS Integration" },
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "Workflow Automation" },
    { cat: "Enterprise Features", name: "Single Sign-On (SSO)" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence Dashboard" },
    { cat: "Analytics", name: "Custom Reports" },
    { cat: "Analytics", name: "Learning Analytics" },
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
        description: `${fDef.name} for learning management platform.`,
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

  // 5. Ensure all 4 LMS Packages Exist under serviceTypeId
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

  const starterPkgId = await ensurePackage("Starter LMS", "starter-lms", 59999, 14, 10, 4, false, 1, "Best for coaching centres, small academies, and trainers with course & lesson management.");
  const proPkgId = await ensurePackage("Professional LMS", "professional-lms", 119999, 25, 25, 8, true, 2, "Everything in Starter + Quizzes, Assignments, Certificates, Drip Content, Live Classes & Course Analytics.");
  const busPkgId = await ensurePackage("Business LMS", "business-lms", 249999, 45, 50, 12, false, 3, "Everything in Professional + Multiple Instructors, Batch Management, Online Exams, Leaderboards & CRM.");
  const entPkgId = await ensurePackage("Enterprise LMS", "enterprise-lms", 499999, 75, -1, 99, false, 4, "Everything in Business + Multi-Tenant, White Label, SCORM/xAPI, SSO, HRMS/ERP & BI Dashboard.");

  const starterFeatureIds = Array.from(new Set(starterFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const proFeatureIds = Array.from(new Set([...starterFeatureIds, ...proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(starterPkgId).update({
    includedFeatureIds: starterFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Starter LMS (${starterPkgId}) with ${starterFeatureIds.length} features.`);

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional LMS (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business LMS (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise LMS (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure LMS Paid Add-ons Exist
  console.log("Checking Add-on Categories for LMS add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let lmsAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("lms") || d.data().name?.toLowerCase().includes("learning")
  );

  let lmsAddonCatId = "";
  if (!lmsAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    lmsAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "LMS & Educational Integration Add-ons",
      icon: "GraduationCap",
      sortOrder: 7,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: LMS & Educational Integration Add-ons (${lmsAddonCatId})`);
  } else {
    lmsAddonCatId = lmsAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: lmsAddonCatId, name: "Native Mobile App (iOS & Android)", description: "Student & instructor mobile learning app.", pricingType: "fixed", price: 85000 },
    { categoryId: lmsAddonCatId, name: "AI Learning Assistant", description: "AI chatbot tutor for student Q&A assistance.", pricingType: "fixed", price: 30000 },
    { categoryId: lmsAddonCatId, name: "AI Quiz Generator", description: "Automated AI quiz & question creation tool.", pricingType: "fixed", price: 25000 },
    { categoryId: lmsAddonCatId, name: "Zoom / Google Meet Integration", description: "Automated live webinar & class creation.", pricingType: "fixed", price: 15000 },
    { categoryId: lmsAddonCatId, name: "SMS Gateway Integration", description: "Transactional student OTP & exam alert SMS.", pricingType: "fixed", price: 8000 },
    { categoryId: lmsAddonCatId, name: "Payment Gateway Integration", description: "Razorpay/Stripe automated course checkout.", pricingType: "fixed", price: 10000 },
    { categoryId: lmsAddonCatId, name: "Content Migration (per 50 courses)", description: "Migrate legacy videos & PDF course materials.", pricingType: "fixed", price: 20000 },
    { categoryId: lmsAddonCatId, name: "Course Creation & Design", description: "Custom course curriculum layout & slide formatting.", pricingType: "fixed", price: 25000 },
    { categoryId: lmsAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, security & backups.", pricingType: "fixed", price: 28000 },
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

  console.log("🎉 Successfully completed Learning Management System (LMS) Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
