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

// Initialize Firebase Admin with either service account file or fallback environment variables
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
  console.log("🚀 Starting database migration...");

  // ==========================================================================
  // 1. Migrate global categories feature_categories -> addon_categories
  // ==========================================================================
  console.log("📦 Migrating global feature_categories -> addon_categories...");
  const oldCatsSnap = await db.collection("feature_categories").get();
  console.log(`Found ${oldCatsSnap.size} global feature categories to migrate.`);

  let catCount = 0;
  for (const doc of oldCatsSnap.docs) {
    const data = doc.data();
    await db.collection("addon_categories").doc(doc.id).set(data);
    // Delete old doc
    await doc.ref.delete();
    catCount++;
  }
  console.log(`✅ Migrated and cleaned up ${catCount} global categories.`);

  // ==========================================================================
  // 2. Migrate global features features -> addon_features
  // ==========================================================================
  console.log("📦 Migrating global features -> addon_features...");
  const oldFeatsSnap = await db.collection("features").get();
  console.log(`Found ${oldFeatsSnap.size} global features to migrate.`);

  let featCount = 0;
  for (const doc of oldFeatsSnap.docs) {
    const data = doc.data();
    await db.collection("addon_features").doc(doc.id).set(data);
    // Delete old doc
    await doc.ref.delete();
    featCount++;
  }
  console.log(`✅ Migrated and cleaned up ${featCount} global features.`);

  // ==========================================================================
  // 3. Migrate package in-built features packages/{pkg}/features -> subcollections
  // ==========================================================================
  console.log("📦 Migrating package in-built features to nested collections...");
  const packagesSnap = await db.collection("packages").get();
  console.log(`Found ${packagesSnap.size} packages to inspect.`);

  // Default inbuilt categories template to write to packages
  const defaultCategories = [
    { id: "website", name: "Website Structure", sortOrder: 0 },
    { id: "design", name: "Design & Experience", sortOrder: 1 },
    { id: "seo", name: "SEO & Performance", sortOrder: 2 },
    { id: "support", name: "Support", sortOrder: 3 },
  ];

  let packageFeatureMigrated = 0;

  for (const pkgDoc of packagesSnap.docs) {
    const pkgId = pkgDoc.id;
    const pkgName = pkgDoc.data().name;
    console.log(`Inspecting package: ${pkgName} (${pkgId})...`);

    // Fetch old subcollection packages/{pkgId}/features
    const oldPkgFeaturesSnap = await db
      .collection("packages")
      .doc(pkgId)
      .collection("features")
      .get();

    if (oldPkgFeaturesSnap.empty) {
      console.log(`  No inbuilt features found in legacy location for package ${pkgName}. Seeding default categories anyway.`);
      
      // Let's seed default empty categories so the package edit screen is populated with the tabs!
      for (const cat of defaultCategories) {
        await db
          .collection("packages")
          .doc(pkgId)
          .collection("featureCategories")
          .doc(cat.id)
          .set({
            name: cat.name,
            sortOrder: cat.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }
      continue;
    }

    console.log(`  Found ${oldPkgFeaturesSnap.size} inbuilt features to classify.`);

    // 1. Ensure categories subcollection is seeded
    for (const cat of defaultCategories) {
      await db
        .collection("packages")
        .doc(pkgId)
        .collection("featureCategories")
        .doc(cat.id)
        .set({
          name: cat.name,
          sortOrder: cat.sortOrder,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }

    // 2. Classify and migrate features
    for (const featDoc of oldPkgFeaturesSnap.docs) {
      const featData = featDoc.data();
      const featName = featData.name || "";
      const lowerName = featName.toLowerCase();

      let targetCat = "website"; // default category

      if (
        lowerName.includes("page") ||
        lowerName.includes("sitemap") ||
        lowerName.includes("structure") ||
        lowerName.includes("about") ||
        lowerName.includes("gallery") ||
        lowerName.includes("contact")
      ) {
        targetCat = "website";
      } else if (
        lowerName.includes("ui") ||
        lowerName.includes("design") ||
        lowerName.includes("ux") ||
        lowerName.includes("responsive") ||
        lowerName.includes("animation") ||
        lowerName.includes("mockup") ||
        lowerName.includes("theme") ||
        lowerName.includes("aesthetics") ||
        lowerName.includes("cta") ||
        lowerName.includes("brand")
      ) {
        targetCat = "design";
      } else if (
        lowerName.includes("seo") ||
        lowerName.includes("analytics") ||
        lowerName.includes("google") ||
        lowerName.includes("tracking") ||
        lowerName.includes("metrics")
      ) {
        targetCat = "seo";
      } else if (
        lowerName.includes("support") ||
        lowerName.includes("revision") ||
        lowerName.includes("maintenance") ||
        lowerName.includes("sla") ||
        lowerName.includes("hour") ||
        lowerName.includes("month")
      ) {
        targetCat = "support";
      }

      // Write under packages/{pkgId}/featureCategories/{targetCat}/features/{featDoc.id}
      await db
        .collection("packages")
        .doc(pkgId)
        .collection("featureCategories")
        .doc(targetCat)
        .collection("features")
        .doc(featDoc.id)
        .set({
          name: featName,
          description: featData.description || "",
          sortOrder: featData.sortOrder || 0,
          createdAt: featData.createdAt || new Date(),
          updatedAt: new Date(),
        });

      // Delete the old flat package feature doc
      await featDoc.ref.delete();
      packageFeatureMigrated++;
    }

    console.log(`  Successfully migrated package ${pkgName} in-built features.`);
  }

  console.log(`🎉 Migration completed!`);
  console.log(`Summary:`);
  console.log(`- Global addon categories migrated: ${catCount}`);
  console.log(`- Global addon features migrated: ${featCount}`);
  console.log(`- Package in-built features migrated: ${packageFeatureMigrated}`);
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
