import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

// Attempt to load service account file
let serviceAccount: any = null;
const serviceAccountPath = path.resolve(process.cwd(), "secrets/firebase-admin.json");

if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } catch (err) {
    console.error("❌ Failed to parse secrets/firebase-admin.json:", err);
  }
}

// Initialize Firebase Admin
if (serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
  });
  console.log("ℹ️ Initialized Firebase Admin using secrets/firebase-admin.json credentials.");
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
  console.log("ℹ️ Initialized Firebase Admin using environment variables.");
} else {
  console.error("❌ Error: Firebase Admin credentials not found.");
  process.exit(1);
}

const db = getFirestore();

async function runMigration() {
  console.log("🚀 Starting package-service-type mapping migration...");

  // 1. Ensure target service types exist
  const serviceTypesColl = db.collection("service_types");
  
  // Find or create "Landing Page"
  let landingPageId = "";
  const lpSnap = await serviceTypesColl.where("slug", "==", "landing-page").get();
  if (!lpSnap.empty) {
    landingPageId = lpSnap.docs[0].id;
    console.log(`ℹ️ Found existing Landing Page service type: ${landingPageId}`);
  } else {
    // Check if Informational Website exists
    const infoSnap = await serviceTypesColl.where("slug", "==", "informational-website").get();
    if (!infoSnap.empty) {
      landingPageId = infoSnap.docs[0].id;
      console.log(`ℹ️ Mapping Landing Page to existing Informational Website service type: ${landingPageId}`);
    } else {
      const lpDoc = serviceTypesColl.doc("st-landing-page");
      await lpDoc.set({
        serviceCategoryId: "sc-website",
        name: "Landing Page",
        slug: "landing-page",
        description: "Single page sales funnel and landing pages.",
        icon: "Sparkles",
        sortOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      landingPageId = lpDoc.id;
      console.log(`✅ Created Landing Page service type: ${landingPageId}`);
    }
  }

  // Find or create "Business Website"
  let businessWebId = "";
  const bwSnap = await serviceTypesColl.where("slug", "==", "business-website").get();
  if (!bwSnap.empty) {
    businessWebId = bwSnap.docs[0].id;
    console.log(`ℹ️ Found existing Business Website service type: ${businessWebId}`);
  } else {
    // Check if Informational Website exists (as fallback)
    const infoSnap = await serviceTypesColl.where("slug", "==", "informational-website").get();
    if (!infoSnap.empty && infoSnap.docs[0].id !== landingPageId) {
      businessWebId = infoSnap.docs[0].id;
      console.log(`ℹ️ Mapping Business Website to existing Informational Website service type: ${businessWebId}`);
    } else {
      const bwDoc = serviceTypesColl.doc("st-business-website");
      await bwDoc.set({
        serviceCategoryId: "sc-website",
        name: "Business Website",
        slug: "business-website",
        description: "Corporate, business, and informational websites.",
        icon: "Briefcase",
        sortOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      businessWebId = bwDoc.id;
      console.log(`✅ Created Business Website service type: ${businessWebId}`);
    }
  }

  // 2. Fetch all packages and assign serviceTypeId
  const packagesColl = db.collection("packages");
  const packagesSnap = await packagesColl.get();
  console.log(`Found ${packagesSnap.size} packages to migrate.`);

  let migratedCount = 0;
  for (const doc of packagesSnap.docs) {
    const data = doc.data();
    const name = (data.name || "").toLowerCase();
    const slug = (data.slug || "").toLowerCase();
    let serviceTypeId = "";

    if (name.includes("single page") || slug.includes("portfolio") || name.includes("landing")) {
      serviceTypeId = landingPageId;
      console.log(`📦 Mapping package "${data.name}" -> Landing Page (${landingPageId})`);
    } else {
      serviceTypeId = businessWebId;
      console.log(`📦 Mapping package "${data.name}" -> Business Website (${businessWebId})`);
    }

    await doc.ref.update({
      serviceTypeId,
      updatedAt: new Date(),
    });
    migratedCount++;
  }

  console.log(`🎉 Packages migration completed! Migrated: ${migratedCount}`);
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
