import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Initialize Resend dynamically to support graceful fallback
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/** Send an email notification. Fails silently with a warning if credentials are empty to avoid crash. */
export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    if (!resend) {
      console.warn(`[Mail service fallback] Skipping email dispatch to: ${to}. Subject: ${subject}`);
      return true;
    }

    // Default sender domain provided by Resend sandbox
    const fromAddress = process.env.EMAIL_FROM || 'WebCost Pro <onboarding@resend.dev>';

    const response = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error('Resend Dispatch Error:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email Dispatch Exception:', error);
    return false;
  }
}
