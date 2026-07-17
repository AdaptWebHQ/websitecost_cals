import nodemailer from 'nodemailer';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || 'AdaptWeb Cost Calculator <noreply@adaptweb.in>';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure, // true for 465, false for other ports
  auth: smtpUser && smtpPass ? {
    user: smtpUser,
    pass: smtpPass,
  } : undefined,
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Escape user-supplied strings before embedding in HTML email templates.
 * Prevents XSS via HTML injection in admin-facing emails.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends a raw email using the configured SMTP transporter
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });
    // Using console.info to avoid leaking internal IDs at console.log level
    console.info('Email dispatched, messageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email via Nodemailer:', error);
    return { success: false, error };
  }
}

/**
 * Send an email notification for a new CRM Inquiry to the Admin
 */
export async function sendInquiryEmail(inquiry: {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  calculationId?: string | null;
}) {
  try {
    const priceConfigDoc = await adminDb.collection(COLLECTIONS.PRICE_CONFIG).doc('global').get();
    const adminEmail = priceConfigDoc.data()?.companyEmail || process.env.ADMIN_NOTIFY_EMAIL || 'founder@adaptweb.in';

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inquiryUrl = `${appUrl}/admin/inquiries/${escapeHtml(inquiry.id)}`;
    const calcUrl = inquiry.calculationId
      ? `${appUrl}/admin/calculations/${escapeHtml(inquiry.calculationId)}`
      : null;

    const emailSubject = `New Lead Inquiry: ${escapeHtml(inquiry.companyName || 'N/A')} - ${escapeHtml(inquiry.name || 'N/A')}`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e293b; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">New Lead Inquiry</h2>
        </div>
        <div style="padding: 32px;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0;">A new inquiry has been submitted via the cost calculator. Please review the details below:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 30%;"><strong>Contact Name</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(inquiry.name || 'N/A')}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Company</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(inquiry.companyName || 'N/A')}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email Address</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="mailto:${escapeHtml(inquiry.email || '')}" style="color: #2563eb; text-decoration: none;">${escapeHtml(inquiry.email || 'N/A')}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Phone Number</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(inquiry.phone || 'N/A')}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Estimated Budget</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(inquiry.budget || 'N/A')}</td>
            </tr>
            ${calcUrl ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Calculation Data</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="${calcUrl}" style="color: #2563eb; text-decoration: none;">View Attached Estimate</a></td>
            </tr>
            ` : ''}
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #64748b; font-size: 15px; margin-bottom: 8px;"><strong>Additional Message:</strong></p>
            <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #2563eb; border-radius: 0 4px 4px 0; color: #334155; font-size: 15px; line-height: 1.6;">
              ${escapeHtml(inquiry.message || 'No additional message provided.')}
            </div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${inquiryUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; font-size: 16px;">Review Lead in CRM</a>
          </div>
        </div>
      </div>
    `;

    return await sendMail({
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Failed to send inquiry email:', error);
    return { success: false, error };
  }
}

/**
 * Send a welcome email to a newly registered public user
 */
export async function sendWelcomeEmail(user: { name: string; email: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adaptweb.in';
  const welcomeSubject = `Welcome to AdaptWeb Cost Calculator`;
  const welcomeHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="padding: 40px 32px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 600;">Welcome to AdaptWeb</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Dear <strong>${escapeHtml(user.name)}</strong>,</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for registering with the AdaptWeb Cost Calculator. We are pleased to provide you with a streamlined platform for your web development estimations.</p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 24px;">Your account grants you access to a suite of tools designed to simplify project planning:</p>
        <ul style="color: #475569; font-size: 15px; line-height: 1.8; padding-left: 20px;">
          <li>Generate precise, dynamic cost estimates tailored to your project requirements.</li>
          <li>Customize technology stacks, feature sets, and page structures.</li>
          <li>Securely save, track, and export your professional PDF proposals.</li>
        </ul>

        <div style="text-align: left; margin: 36px 0;">
          <a href="${appUrl}/public/calculator" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; font-size: 16px;">Access Your Calculator</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
          This email confirms your recent registration at AdaptWeb. If this account was created in error, please contact our support team.
        </p>
      </div>
    </div>
  `;
  return await sendMail({
    to: user.email,
    subject: welcomeSubject,
    html: welcomeHtml,
  });
}

/**
 * Send a sign-in security alert to a public user
 */
export async function sendSecurityAlertEmail(user: { name: string; email: string }, loginTime: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adaptweb.in';
  const loginSubject = 'Security Notice: New Account Sign-in';
  const loginHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="padding: 32px;">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 600;">New Account Sign-in</h3>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Dear <strong>${escapeHtml(user.name)}</strong>,</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">We noticed a recent sign-in to your AdaptWeb Cost Calculator account. Please review the details below:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 100px;"><strong>Account:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(user.email)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Timestamp:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(loginTime)}</td>
            </tr>
          </table>
        </div>

        <p style="color: #475569; font-size: 15px; line-height: 1.6;">If you authorized this sign-in, you may disregard this notice. <a href="${appUrl}/public" style="color: #2563eb; text-decoration: none; font-weight: 500;">Continue to Dashboard &rarr;</a></p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
          <strong>Security Protocol:</strong> If you do not recognize this activity, we advise you to immediately secure your account and update your credentials.
        </p>
      </div>
    </div>
  `;
  return await sendMail({
    to: user.email,
    subject: loginSubject,
    html: loginHtml,
  });
}

/**
 * Send an email notification to the assignee when a lead is assigned to them
 */
export async function sendLeadAssignmentEmail(
  assignee: { name: string; email: string },
  inquiry: {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    budget: string;
    message: string;
  },
  assignedBy: string
) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inquiryUrl = `${appUrl}/admin/inquiries/${escapeHtml(inquiry.id)}`;

    const emailSubject = `Action Required: New Lead Assignment - ${escapeHtml(inquiry.companyName || 'N/A')}`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 24px; border-bottom: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 600;">Lead Assignment Notification</h2>
        </div>
        <div style="padding: 32px;">
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello <strong>${escapeHtml(assignee.name)}</strong>,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">You have been assigned a new lead by <strong>${escapeHtml(assignedBy)}</strong>. Please review the prospective client's details below and proceed with standard outreach protocol.</p>
          
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 24px; margin: 28px 0;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Client Information</h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 35%;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(inquiry.name || 'N/A')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Company:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(inquiry.companyName || 'N/A')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${escapeHtml(inquiry.email || '')}" style="color: #2563eb; text-decoration: none;">${escapeHtml(inquiry.email || 'N/A')}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(inquiry.phone || 'N/A')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Stated Budget:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${escapeHtml(inquiry.budget || 'N/A')}</td>
              </tr>
            </table>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;"><strong>Inquiry Message:</strong></p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0;">
                <em>"${escapeHtml(inquiry.message || 'N/A')}"</em>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${inquiryUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; font-size: 16px;">Access Lead Profile</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0; text-align: center;">
            This is an automated system notification from the AdaptWeb CRM portal.
          </p>
        </div>
      </div>
    `;

    return await sendMail({
      to: assignee.email,
      subject: emailSubject,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Failed to send lead assignment email:', error);
    return { success: false, error };
  }
}