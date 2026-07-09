import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || 'WebCost Pro <noreply@webcostpro.com>';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPass ? {
    user: smtpUser,
    pass: smtpPass,
  } : undefined,
});

async function main() {
  const target = process.env.ADMIN_NOTIFY_EMAIL || 'founder@adaptweb.in';
  console.log(`Sending test email to ${target} via ${smtpHost} (${smtpUser})...`);
  
  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: target,
      subject: 'Test Email Trigger - WebCost Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Test Successful!</h2>
          <p>If you received this email, the Nodemailer configuration in your <code>.env</code> is working perfectly.</p>
          <p><strong>Configured Sender:</strong> ${smtpFrom}</p>
          <p><strong>Destination Admin:</strong> ${target}</p>
        </div>
      `
    });
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

main();
