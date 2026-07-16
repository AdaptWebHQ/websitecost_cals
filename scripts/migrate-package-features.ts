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

// Helper to convert strings to clean URL slugs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

// Map category IDs to default premium Lucide icons
function getCategoryIcon(id: string) {
  switch (id) {
    case "website":
      return "Globe";
    case "design":
      return "Palette";
    case "seo":
      return "Search";
    case "support":
      return "Headphones";
    default:
      return "Layers";
  }
}

async function runMigration() {
  console.log("🚀 Starting Package Features Library Migration...");

  // 1. Fetch all packages
  const packagesSnap = await db.collection("packages").get();
  console.log(`Found ${packagesSnap.size} packages to migrate.`);

  // Keep track of created categories and features to prevent duplicates
  const globalCategoriesMap = new Map<string, any>();
  const globalFeaturesMap = new Map<string, string>(); // name lowercased -> global feature ID

  // Load existing global categories & features if run multiple times (idempotency)
  const existingCats = await db.collection("package_feature_categories").get();
  existingCats.docs.forEach((doc) => {
    globalCategoriesMap.set(doc.id, doc.data());
  });

  const existingFeats = await db.collection("package_features").get();
  existingFeats.docs.forEach((doc) => {
    const data = doc.data();
    globalFeaturesMap.set(data.name.toLowerCase().trim(), doc.id);
  });

  console.log(`Loaded ${globalCategoriesMap.size} existing global categories and ${globalFeaturesMap.size} features from Firestore.`);

  for (const pkgDoc of packagesSnap.docs) {
    const pkgId = pkgDoc.id;
    const pkgName = pkgDoc.data().name;
    console.log(`\n📦 Migrating package: ${pkgName} (${pkgId})...`);

    // Fetch old subcollection: packages/{pkgId}/featureCategories
    const oldCatsSnap = await db
      .collection("packages")
      .doc(pkgId)
      .collection("featureCategories")
      .get();

    if (oldCatsSnap.empty) {
      console.log(`  No nested subcollection features found in legacy path for package ${pkgName}. Skipping.`);
      continue;
    }

    const includedFeatureIds: string[] = [];

    // Migrate categories and features under this package
    for (const oldCatDoc of oldCatsSnap.docs) {
      const oldCatId = oldCatDoc.id;
      const oldCatData = oldCatDoc.data();

      // 1. Upsert Global Category
      if (!globalCategoriesMap.has(oldCatId)) {
        console.log(`  ➕ Creating global category: "${oldCatData.name}" (${oldCatId})`);
        const catPayload = {
          name: oldCatData.name,
          description: oldCatData.description || "",
          icon: getCategoryIcon(oldCatId),
          displayOrder: oldCatData.sortOrder !== undefined ? oldCatData.sortOrder : 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.collection("package_feature_categories").doc(oldCatId).set(catPayload);
        globalCategoriesMap.set(oldCatId, catPayload);
      }

      // 2. Fetch old nested features: packages/{pkgId}/featureCategories/{oldCatId}/features
      const oldFeatsSnap = await db
        .collection("packages")
        .doc(pkgId)
        .collection("featureCategories")
        .doc(oldCatId)
        .collection("features")
        .get();

      console.log(`    Found ${oldFeatsSnap.size} features under category "${oldCatData.name}".`);

      for (const oldFeatDoc of oldFeatsSnap.docs) {
        const oldFeatData = oldFeatDoc.data();
        const featName = oldFeatData.name.trim();
        const featNameKey = featName.toLowerCase();

        let globalFeatId = "";

        if (globalFeaturesMap.has(featNameKey)) {
          // Feature already created globally, reuse its ID
          globalFeatId = globalFeaturesMap.get(featNameKey)!;
          console.log(`    🔗 Reusing global feature: "${featName}" -> ID: ${globalFeatId}`);
        } else {
          // Create new global feature
          let slugId = slugify(featName);
          
          // Verify slug uniqueness in Firestore
          let uniqueId = slugId;
          let counter = 1;
          let conflict = true;
          
          while (conflict) {
            const check = await db.collection("package_features").doc(uniqueId).get();
            if (!check.exists) {
              conflict = false;
            } else {
              uniqueId = `${slugId}-${counter}`;
              counter++;
            }
          }

          globalFeatId = uniqueId;
          console.log(`    ➕ Creating global feature: "${featName}" -> ID: ${globalFeatId}`);

          const featPayload = {
            categoryId: oldCatId,
            name: featName,
            description: oldFeatData.description || "",
            displayOrder: oldFeatData.sortOrder !== undefined ? oldFeatData.sortOrder : 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.collection("package_features").doc(globalFeatId).set(featPayload);
          globalFeaturesMap.set(featNameKey, globalFeatId);
        }

        // Add to included list
        if (!includedFeatureIds.includes(globalFeatId)) {
          includedFeatureIds.push(globalFeatId);
        }
      }
    }

    // 3. Save includedFeatureIds inside the Package Document
    console.log(`  💾 Saving ${includedFeatureIds.length} features references in package: ${pkgName}...`);
    await db.collection("packages").doc(pkgId).update({
      includedFeatureIds,
      updatedAt: new Date(),
    });

    // 4. Safely clean up old package subcollections
    console.log(`  🧹 Cleaning up legacy nested subcollections for package: ${pkgName}...`);
    for (const oldCatDoc of oldCatsSnap.docs) {
      const oldCatId = oldCatDoc.id;
      
      const oldFeatsSnap = await db
        .collection("packages")
        .doc(pkgId)
        .collection("featureCategories")
        .doc(oldCatId)
        .collection("features")
        .get();

      // Delete features
      for (const featDoc of oldFeatsSnap.docs) {
        await featDoc.ref.delete();
      }

      // Delete category
      await oldCatDoc.ref.delete();
    }
    console.log(`  ✅ Cleaned up package ${pkgName}.`);
  }

  console.log("\n🎉 Package In-built Features Migration Completed Successfully!");
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
