import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n').replace(/"/g, ''),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Graceful fallback config to prevent Next.js build-time errors when credentials are empty
      admin.initializeApp({
        projectId: projectId || 'webcost-pro-fallback-id',
      });
    }
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { admin, adminAuth, adminDb, adminStorage };
