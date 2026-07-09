import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK if not already initialized
if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

/**
 * Cloud Function triggered on new inquiry document creation in Firestore.
 * Automatically sends/queues an email notification to the administrator.
 */
export const onInquiryCreated = onDocumentCreated("inquiries/{inquiryId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No inquiry data found in the event payload");
    return;
  }

  logger.info(`ℹ️ Email dispatch for inquiry ID: ${snapshot.id} bypassed. Handled directly via Next.js Server Actions.`);
  return;
});

/**
 * Cloud Function triggered when a user document is created or updated in Firestore.
 * Automatically sends:
 * 1. A welcome email to public users upon registration (creation).
 * 2. A sign-in notification email to public users upon subsequent logins (updates).
 */
export const onUserSignIn = onDocumentWritten("users/{userId}", async (event) => {
  const change = event.data;
  if (!change) {
    logger.error("No user change data found in the event payload");
    return;
  }

  const afterDoc = change.after;
  if (!afterDoc.exists) {
    return;
  }

  logger.info(`ℹ️ Email dispatch for user ID: ${afterDoc.id} bypassed. Handled directly via Next.js Server Actions.`);
  return;
});
