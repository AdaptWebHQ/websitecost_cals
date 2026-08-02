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
  console.log("🔍 Inspecting Service Types and Packages in Firestore...");

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

  const categoryId = websiteCatDoc.id;
  console.log(`✅ Category ID: ${categoryId}`);

  // 2. Fetch all service types under Website Development
  const serviceTypesSnap = await db
    .collection("service_types")
    .where("serviceCategoryId", "==", categoryId)
    .get();

  console.log(`📋 Found ${serviceTypesSnap.docs.length} service types under category:`);
  serviceTypesSnap.docs.forEach((doc) => {
    console.log(`   - ID: ${doc.id} | Name: "${doc.data().name}" | Slug: "${doc.data().slug}"`);
  });

  // Find all service types named E-commerce Website
  const ecommerceTypes = serviceTypesSnap.docs.filter((d) =>
    d.data().name?.toLowerCase().trim().includes("e-commerce")
  );

  console.log(`🛒 Found ${ecommerceTypes.length} E-commerce service type docs.`);

  // 3. Find packages under Website Development
  const packagesSnap = await db
    .collection("packages")
    .where("serviceCategoryId", "==", categoryId)
    .get();

  console.log(`📦 Found ${packagesSnap.docs.length} packages total in Website Development:`);
  packagesSnap.docs.forEach((doc) => {
    console.log(`   - ID: ${doc.id} | Name: "${doc.data().name}" | ServiceTypeID: ${doc.data().serviceTypeId} | Price: ₹${doc.data().basePrice}`);
  });

  // Identify the target Service Type ID where "Starter Store" or "Professional Store" resides
  const existingStorePkgDoc = packagesSnap.docs.find(
    (d) =>
      d.data().name?.toLowerCase().includes("starter store") ||
      d.data().name?.toLowerCase().includes("professional store")
  );

  let targetServiceTypeId = "";

  if (existingStorePkgDoc) {
    targetServiceTypeId = existingStorePkgDoc.data().serviceTypeId;
    console.log(`🎯 Target E-commerce Service Type ID (from existing packages): ${targetServiceTypeId}`);
  } else if (ecommerceTypes.length > 0) {
    targetServiceTypeId = ecommerceTypes[0].id;
    console.log(`🎯 Target E-commerce Service Type ID: ${targetServiceTypeId}`);
  }

  if (!targetServiceTypeId) {
    console.error("❌ Target Service Type ID not found!");
    process.exit(1);
  }

  // 4. Update Business Store and Enterprise Store to targetServiceTypeId
  const targetPackages = packagesSnap.docs.filter(
    (d) =>
      d.data().name?.toLowerCase().includes("business store") ||
      d.data().name?.toLowerCase().includes("enterprise store")
  );

  for (const pkgDoc of targetPackages) {
    await db.collection("packages").doc(pkgDoc.id).update({
      serviceTypeId: targetServiceTypeId,
      updatedAt: new Date(),
    });
    console.log(`✅ Updated Package "${pkgDoc.data().name}" (${pkgDoc.id}) -> serviceTypeId: ${targetServiceTypeId}`);
  }

  // 5. Cleanup duplicate E-commerce Service Type if one was created with 0 packages
  if (ecommerceTypes.length > 1) {
    for (const typeDoc of ecommerceTypes) {
      if (typeDoc.id !== targetServiceTypeId) {
        const pkgs = packagesSnap.docs.filter((p) => p.data().serviceTypeId === typeDoc.id);
        if (pkgs.length === 0) {
          await db.collection("service_types").doc(typeDoc.id).delete();
          console.log(`🗑️ Deleted duplicate unused Service Type: ${typeDoc.id} ("${typeDoc.data().name}")`);
        }
      }
    }
  }

  console.log("🎉 Successfully linked Business Store and Enterprise Store packages to the active E-commerce Website tab!");
}

run().catch((err) => {
  console.error("❌ Script error:", err);
  process.exit(1);
});
