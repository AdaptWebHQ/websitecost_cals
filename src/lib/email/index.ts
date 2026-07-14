import nodemailer from 'nodemailer';
import { adminDb } from '@/firebase/admin';
import { COLLECTIONS } from '@/constants';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || 'WebCost Pro <noreply@webcostpro.com>';

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
    console.log('✅ Email sent successfully:', info.messageId);
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
    const adminEmail = priceConfigDoc.data()?.companyEmail || process.env.ADMIN_NOTIFY_EMAIL || 'founder@adapweb.in';

    const emailSubject = `New CRM Lead Inquiry: ${inquiry.companyName || 'N/A'} (${inquiry.name || 'N/A'})`;
    const emailHtml = `
      <h2>New Calculator Lead Received</h2>
      <p><strong>Name:</strong> ${inquiry.name || 'N/A'}</p>
      <p><strong>Company:</strong> ${inquiry.companyName || 'N/A'}</p>
      <p><strong>Email:</strong> ${inquiry.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
      <p><strong>Budget:</strong> ${inquiry.budget || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background:#f1f5f9;padding:10px 15px;border-left:4px solid #6366f1;">
        ${inquiry.message || 'N/A'}
      </blockquote>
      ${inquiry.calculationId ? `<p><strong>Linked Calculation ID:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/calculations/${inquiry.calculationId}">${inquiry.calculationId}</a></p>` : ""}
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/inquiries/${inquiry.id}">Open Lead in CRM Portal</a></p>
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
  const welcomeSubject = `Welcome to WebCost Pro, ${user.name}!`;
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; margin-bottom: 20px;">Welcome to WebCost Pro!</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Thank you for signing up for <strong>WebCost Pro</strong>. We are thrilled to have you join our community!</p>
      <p>With WebCost Pro, you can easily:</p>
      <ul style="line-height: 1.6;">
        <li>Calculate instant, dynamic price estimates for web development projects.</li>
        <li>Customize features, pages, tech stacks, and industries to get precise quotes.</li>
        <li>Save and track your quotes, PDF reports, and inquiries directly from your personal dashboard.</li>
      </ul>
      <p style="margin-top: 30px;">Get started now by creating your first project estimation:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://webcostpro.com'}/public/calculator" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Launch Cost Calculator</a>
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 12px; color: #64748b; line-height: 1.4;">
        This email was sent to ${user.email} as a registration confirmation. If you did not sign up for WebCost Pro, please ignore this email.
      </p>
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
  const loginSubject = "Security Alert: New Sign-in to WebCost Pro";
  const loginHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="color: #0f172a; margin-bottom: 20px;">New Sign-In Detected</h3>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your WebCost Pro account was recently accessed on <strong>${loginTime}</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Account:</strong></td>
          <td style="padding: 8px 0; color: #0f172a;">${user.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;"><strong>Time:</strong></td>
          <td style="padding: 8px 0; color: #0f172a;">${loginTime}</td>
        </tr>
      </table>

      <p>If this was you, no action is needed. You're ready to continue tracking and creating website cost estimates!</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://webcostpro.com'}/public" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">Go to Dashboard</a>
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
        If you did not authorize this access, please check your account immediately and consider updating your security credentials.
      </p>
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
    const emailSubject = `🚨 New Lead Assigned to You: ${inquiry.companyName || 'N/A'} (${inquiry.name || 'N/A'})`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 20px;">Lead Assigned Notification</h2>
        <p>Hi <strong>${assignee.name}</strong>,</p>
        <p>You have been assigned a new lead by <strong>${assignedBy}</strong>.</p>
        
        <div style="background:#f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <h3 style="margin-top:0; color:#0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Lead Details:</h3>
          <p><strong>Name:</strong> ${inquiry.name || 'N/A'}</p>
          <p><strong>Company:</strong> ${inquiry.companyName || 'N/A'}</p>
          <p><strong>Email:</strong> ${inquiry.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
          <p><strong>Budget:</strong> ${inquiry.budget || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background:#ffffff; padding:10px 15px; border-left:4px solid #4f46e5; margin: 10px 0; font-style: italic; border-radius: 4px;">
            ${inquiry.message || 'N/A'}
          </blockquote>
        </div>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/inquiries/${inquiry.id}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Open Lead in CRM Portal</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
          This is an automated CRM system notification. Please do not reply directly to this email.
        </p>
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
