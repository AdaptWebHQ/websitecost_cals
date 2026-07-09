import { adminDb } from "@/firebase/admin";

/**
 * Send an email notification by writing a document to the Firestore `mail` collection.
 * This triggers the Firebase "Trigger Email" cloud extension/function.
 */
export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    // Schema matching the Firebase Trigger Email Extension expectations:
    // https://extensions.dev/extensions/firebase/firestore-send-email
    await adminDb.collection("mail").add({
      to: to,
      message: {
        subject: subject,
        html: html,
      },
    });

    console.log(`✅ Email dispatch triggered via Firestore 'mail' collection for: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Error queuing email in Firestore 'mail' collection:", error);
    return false;
  }
}
