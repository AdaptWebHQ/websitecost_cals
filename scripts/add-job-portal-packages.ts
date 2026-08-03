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
  console.log("🚀 Starting Job Portal Packages Migration...");

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

  // 2. Find Job Portal Service Type
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let jobTypeDoc = serviceTypesSnap.docs.find((d) =>
    d.data().name?.toLowerCase().includes("job") ||
    d.data().slug?.includes("job")
  );

  let serviceTypeId = "";

  if (!jobTypeDoc) {
    console.log("Creating 'Job Portal' Service Type...");
    const typeRef = db.collection("service_types").doc();
    serviceTypeId = typeRef.id;
    await typeRef.set({
      serviceCategoryId,
      name: "Job Portal",
      slug: "job-portal",
      description: "Connects employers and job seekers with job postings, resumes, applications, and hiring workflows.",
      icon: "Briefcase",
      sortOrder: 11,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created Job Portal Service Type (${serviceTypeId})`);
  } else {
    serviceTypeId = jobTypeDoc.id;
    console.log(`✅ Found Job Portal Service Type: ${jobTypeDoc.data().name} (${serviceTypeId})`);
  }

  // 3. Ensure Feature Categories Exist
  const categoryNames = [
    "Website Structure",
    "Design & Experience",
    "Job Portal",
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
        icon: "Briefcase",
        displayOrder: i + 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      featureCategoryMap[catName] = catRef.id;
      console.log(`✅ Created Category: ${catName} (${catRef.id})`);
    }
  }

  // 4. Exact Features for each Job Portal Package
  const proFeatureDefs: { cat: string; name: string }[] = [
    // Website Structure
    { cat: "Website Structure", name: "Home" },
    { cat: "Website Structure", name: "Jobs" },
    { cat: "Website Structure", name: "Job Details" },
    { cat: "Website Structure", name: "Companies" },
    { cat: "Website Structure", name: "About" },
    { cat: "Website Structure", name: "Contact" },
    { cat: "Website Structure", name: "Privacy Policy" },
    { cat: "Website Structure", name: "Terms & Conditions" },
    { cat: "Website Structure", name: "404 Page" },
    // Job Portal
    { cat: "Job Portal", name: "Job Posting" },
    { cat: "Job Portal", name: "Job Categories" },
    { cat: "Job Portal", name: "Job Search" },
    { cat: "Job Portal", name: "Advanced Filters" },
    { cat: "Job Portal", name: "Employer Dashboard" },
    { cat: "Job Portal", name: "Candidate Dashboard" },
    { cat: "Job Portal", name: "Resume Upload" },
    { cat: "Job Portal", name: "Apply for Jobs" },
    { cat: "Job Portal", name: "Saved Jobs" },
    { cat: "Job Portal", name: "Application Tracking" },
    // Authentication
    { cat: "Authentication", name: "Candidate Registration" },
    { cat: "Authentication", name: "Employer Registration" },
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
    { cat: "Support", name: "6 Months Support" },
  ];

  const busFeatureDefs: { cat: string; name: string }[] = [
    // Job Portal
    { cat: "Job Portal", name: "Resume Builder" },
    { cat: "Job Portal", name: "Featured Jobs" },
    { cat: "Job Portal", name: "Featured Employers" },
    { cat: "Job Portal", name: "Interview Scheduling" },
    { cat: "Job Portal", name: "Email Notifications" },
    { cat: "Job Portal", name: "Shortlisting" },
    { cat: "Job Portal", name: "Applicant Notes" },
    { cat: "Job Portal", name: "Company Profiles" },
    // Business Features
    { cat: "Business Features", name: "Admin Dashboard" },
    { cat: "Business Features", name: "Recruiter Dashboard" },
    { cat: "Business Features", name: "Reports Dashboard" },
    { cat: "Business Features", name: "Subscription Plans" },
    // Authentication
    { cat: "Authentication", name: "Role-Based Access" },
    // Analytics
    { cat: "Analytics", name: "Job Analytics" },
    { cat: "Reports", name: "Recruitment Reports" },
    { cat: "Reports", name: "Candidate Reports" },
    // SEO & Support
    { cat: "SEO & Performance", name: "Schema" },
    { cat: "SEO & Performance", name: "Core Web Vitals" },
    { cat: "Support", name: "Source Code" },
    { cat: "Support", name: "Priority Support" },
    { cat: "Support", name: "Admin Training" },
  ];

  const entFeatureDefs: { cat: string; name: string }[] = [
    // Job Portal
    { cat: "Job Portal", name: "AI Job Matching" },
    { cat: "Job Portal", name: "AI Resume Screening" },
    { cat: "Job Portal", name: "Multi-company Management" },
    { cat: "Job Portal", name: "Multi-language" },
    { cat: "Job Portal", name: "Multi-currency" },
    { cat: "Job Portal", name: "Assessment Tests" },
    { cat: "Job Portal", name: "Video Interviews" },
    { cat: "Job Portal", name: "Offer Management" },
    { cat: "Job Portal", name: "API Integrations" },
    { cat: "Job Portal", name: "Workflow Automation" },
    // Enterprise Features
    { cat: "Enterprise Features", name: "ATS Integration" },
    { cat: "Enterprise Features", name: "HRMS Integration" },
    { cat: "Enterprise Features", name: "ERP Integration" },
    { cat: "Enterprise Features", name: "Single Sign-On (SSO)" },
    // Analytics
    { cat: "Analytics", name: "Business Intelligence" },
    { cat: "Analytics", name: "Custom Reports" },
    { cat: "Analytics", name: "Hiring Performance Dashboard" },
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
        description: `${fDef.name} for job portal platform.`,
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

  // 5. Ensure all 3 Job Portal Packages Exist under serviceTypeId
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

  const proPkgId = await ensurePackage("Professional Job Portal", "professional-job-portal", 149999, 28, 25, 5, true, 1, "Best for recruitment agencies, company career portals, and startup job boards.");
  const busPkgId = await ensurePackage("Business Job Portal", "business-job-portal", 299999, 45, 50, 10, false, 2, "Everything in Professional + Resume Builder, Featured Jobs/Employers, Shortlisting, Recruiter Portal & Source Code.");
  const entPkgId = await ensurePackage("Enterprise Job Portal", "enterprise-job-portal", 599999, 75, -1, 99, false, 3, "Everything in Business + AI Job Matching, AI Resume Screening, Video Interviews, ATS/HRMS/ERP Sync & BI.");

  const proFeatureIds = Array.from(new Set(proFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)));
  const busFeatureIds = Array.from(new Set([...proFeatureIds, ...busFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));
  const entFeatureIds = Array.from(new Set([...busFeatureIds, ...entFeatureDefs.map((f) => featureIdMap[f.name]).filter(Boolean)]));

  await db.collection("packages").doc(proPkgId).update({
    includedFeatureIds: proFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Professional Job Portal (${proPkgId}) with ${proFeatureIds.length} features.`);

  await db.collection("packages").doc(busPkgId).update({
    includedFeatureIds: busFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Business Job Portal (${busPkgId}) with ${busFeatureIds.length} features.`);

  await db.collection("packages").doc(entPkgId).update({
    includedFeatureIds: entFeatureIds,
    updatedAt: now,
  });
  console.log(`✅ Updated Enterprise Job Portal (${entPkgId}) with ${entFeatureIds.length} features.`);

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

  // 7. Ensure Job Portal Paid Add-ons Exist
  console.log("Checking Add-on Categories for Job Portal add-ons...");
  const existingAddonCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  let jobAddonCatDoc = existingAddonCatsSnap.docs.find(
    (d) => d.data().name?.toLowerCase().includes("job") || d.data().name?.toLowerCase().includes("recruitment")
  );

  let jobAddonCatId = "";
  if (!jobAddonCatDoc) {
    const catRef = db.collection("addon_categories").doc();
    jobAddonCatId = catRef.id;
    await catRef.set({
      serviceCategoryId,
      name: "Job Portal & Recruitment Add-ons",
      icon: "Briefcase",
      sortOrder: 11,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Created Add-on Category: Job Portal & Recruitment Add-ons (${jobAddonCatId})`);
  } else {
    jobAddonCatId = jobAddonCatDoc.id;
  }

  const addonDefs = [
    { categoryId: jobAddonCatId, name: "Native Mobile App (iOS & Android)", description: "Employer & candidate mobile job app.", pricingType: "fixed", price: 85000 },
    { categoryId: jobAddonCatId, name: "WhatsApp Business API", description: "Job alerts & interview schedule notifications via WhatsApp.", pricingType: "fixed", price: 12000 },
    { categoryId: jobAddonCatId, name: "SMS Gateway Integration", description: "OTP authentication & candidate SMS alerts.", pricingType: "fixed", price: 8000 },
    { categoryId: jobAddonCatId, name: "Background Verification Integration", description: "Automated candidate background check API.", pricingType: "fixed", price: 25000 },
    { categoryId: jobAddonCatId, name: "Third-party ATS Integration", description: "Sync candidates with Greenhouse/Lever/Workday.", pricingType: "fixed", price: 30000 },
    { categoryId: jobAddonCatId, name: "Premium Email Service", description: "Transactional bulk email server for candidate blasts.", pricingType: "fixed", price: 15000 },
    { categoryId: jobAddonCatId, name: "AI Interview Assistant", description: "Automated AI video/chat interview screener.", pricingType: "fixed", price: 35000 },
    { categoryId: jobAddonCatId, name: "Annual Maintenance Contract (AMC)", description: "Yearly server maintenance, security & backups.", pricingType: "fixed", price: 36000 },
    { categoryId: jobAddonCatId, name: "Digital Marketing & SEO Push", description: "Employer lead generation & SEO push.", pricingType: "fixed", price: 25000 },
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

  console.log("🎉 Successfully completed Job Portal Packages Migration!");
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
