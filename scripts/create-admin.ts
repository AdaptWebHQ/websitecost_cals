import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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
  console.error("Please place your Firebase admin key at secrets/firebase-admin.json or define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file.");
  process.exit(1);
}

const auth = getAuth();
const db = getFirestore();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email) {
    throw new Error("ADMIN_EMAIL is required in the environment (.env file)");
  }

  let user;

  try {
    user = await auth.getUserByEmail(email);
    console.log("✅ Admin already exists in Firebase Auth");
  } catch {
    user = await auth.createUser({
      email,
      emailVerified: true,
    });

    console.log("✅ Admin created in Firebase Auth");
  }

  const userRef = db.collection("users").doc(user.uid);
  const snapshot = await userRef.get();

  if (snapshot.exists) {
    console.log("✅ Admin already exists in Firestore");
    return;
  }

  // Save the admin document. We include both lowercase 'admin' for project compatibility
  // and the requested fields (invited_by, status, etc.) to ensure complete coverage.
  await userRef.set({
    uid: user.uid,
    email,
    name,
    role: "admin",           // Lowercase 'admin' is required for the project's UserRole type and permission checks
    status: "ACTIVE",        // Saved for compatibility with your schema
    isActive: true,          // Used by the dashboard check: user.isActive
    team_id: null,
    invited_by: "SYSTEM",
    invited_at: FieldValue.serverTimestamp(),
    joined_at: FieldValue.serverTimestamp(),
    created_time: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(), // Used by the codebase types
    updatedAt: FieldValue.serverTimestamp(), // Used by the codebase types
  });

  console.log("✅ Admin user successfully created in Firestore");
}

createAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  });
