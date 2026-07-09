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

  const data = snapshot.data();
  const name = data.name || "N/A";
  const companyName = data.companyName || "N/A";
  const email = data.email || "N/A";
  const phone = data.phone || "N/A";
  const budget = data.budget || "N/A";
  const message = data.message || "N/A";
  const calculationId = data.calculationId || null;

  try {
    // Fetch global price configuration doc to extract company contact email
    const priceConfigDoc = await db.collection("price_config").doc("global").get();
    const adminEmail = priceConfigDoc.data()?.companyEmail || process.env.ADMIN_NOTIFY_EMAIL || "admin@webcostpro.com";

    const emailSubject = `New CRM Lead Inquiry: ${companyName} (${name})`;
    const emailHtml = `
      <h2>New Calculator Lead Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background:#f1f5f9;padding:10px 15px;border-left:4px solid #6366f1;">
        ${message}
      </blockquote>
      ${calculationId ? `<p><strong>Linked Calculation ID:</strong> <a href="/dashboard/admin/calculations/${calculationId}">${calculationId}</a></p>` : ""}
      <p><a href="/dashboard/admin/inquiries/${snapshot.id}">Open Lead in CRM Portal</a></p>
    `;

    // Queue email in Firestore 'mail' collection for Trigger Email Extension
    await db.collection("mail").add({
      to: adminEmail,
      message: {
        subject: emailSubject,
        html: emailHtml,
      },
    });

    logger.info(`✅ Email notification queued successfully for inquiry ID: ${snapshot.id} to ${adminEmail}`);
  } catch (error) {
    logger.error("❌ Error queuing inquiry email notification:", error);
  }
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

  const beforeDoc = change.before;
  const afterDoc = change.after;

  // If the document was deleted, do nothing
  if (!afterDoc.exists) {
    return;
  }

  const userData = afterDoc.data();
  const email = userData?.email;
  const name = userData?.name || "User";
  const role = userData?.role || "public";

  // Only target public users as requested
  if (role !== "public" || !email) {
    return;
  }

  try {
    const isNewUser = !beforeDoc.exists;
    const beforeData = beforeDoc.exists ? beforeDoc.data() : null;

    // Convert lastLogin timestamps to numeric epoch time for safe comparison
    const lastLoginBefore = beforeData?.lastLogin?.toDate?.()?.getTime() || 0;
    const lastLoginAfter = userData?.lastLogin?.toDate?.()?.getTime() || 0;

    if (isNewUser) {
      // -------------------------------------------------------------
      // 1. Welcome Email (First Sign-In / Account Creation)
      // -------------------------------------------------------------
      const welcomeSubject = `Welcome to WebCost Pro, ${name}!`;
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Welcome to WebCost Pro!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for signing up for <strong>WebCost Pro</strong>. We are thrilled to have you join our community!</p>
          <p>With WebCost Pro, you can easily:</p>
          <ul style="line-height: 1.6;">
            <li>Calculate instant, dynamic price estimates for web development projects.</li>
            <li>Customize features, pages, tech stacks, and industries to get precise quotes.</li>
            <li>Save and track your quotes, PDF reports, and inquiries directly from your personal dashboard.</li>
          </ul>
          <p style="margin-top: 30px;">Get started now by creating your first project estimation:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://webcostpro.com/dashboard/public/calculator" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Launch Cost Calculator</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #64748b; line-height: 1.4;">
            This email was sent to ${email} as a registration confirmation. If you did not sign up for WebCost Pro, please ignore this email.
          </p>
        </div>
      `;

      await db.collection("mail").add({
        to: email,
        message: {
          subject: welcomeSubject,
          html: welcomeHtml,
        },
      });

      logger.info(`✅ Welcome email queued for new public user: ${email} (UID: ${event.params.userId})`);
    } else if (lastLoginAfter > lastLoginBefore) {
      // -------------------------------------------------------------
      // 2. Sign-In Notification Email (Subsequent Logins)
      // -------------------------------------------------------------
      const loginTime = userData.lastLogin ? userData.lastLogin.toDate().toLocaleString() : new Date().toLocaleString();
      const loginSubject = "Security Alert: New Sign-in to WebCost Pro";
      const loginHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #0f172a; margin-bottom: 20px;">New Sign-In Detected</h3>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your WebCost Pro account was recently accessed on <strong>${loginTime}</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Account:</strong></td>
              <td style="padding: 8px 0; color: #0f172a;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Time:</strong></td>
              <td style="padding: 8px 0; color: #0f172a;">${loginTime}</td>
            </tr>
          </table>

          <p>If this was you, no action is needed. You're ready to continue tracking and creating website cost estimates!</p>
          <p style="margin-top: 20px;">
            <a href="https://webcostpro.com/dashboard/public" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">Go to Dashboard</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
            If you did not authorize this access, please check your account immediately and consider updating your security credentials.
          </p>
        </div>
      `;

      await db.collection("mail").add({
        to: email,
        message: {
          subject: loginSubject,
          html: loginHtml,
        },
      });

      logger.info(`✅ Sign-in security alert email queued for user: ${email} (UID: ${event.params.userId})`);
    }
  } catch (error) {
    logger.error(`❌ Error queueing user sign-in/welcome email:`, error);
  }
});
