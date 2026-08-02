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

interface AddonDef {
  name: string;
  price: number;
  description: string;
}

interface CategoryDef {
  name: string;
  icon: string;
  addons: AddonDef[];
}

const masterAddonLibrary: CategoryDef[] = [
  {
    name: "Branding & Design",
    icon: "Palette",
    addons: [
      { name: "Logo Design", price: 15000, description: "Professional custom logo design with source files." },
      { name: "Brand Identity Kit", price: 35000, description: "Complete brand kit including logos, typography & color palettes." },
      { name: "Brand Guidelines", price: 20000, description: "Brand style guide & visual usage documentation." },
      { name: "Business Card Design", price: 3500, description: "Print-ready business card layout." },
      { name: "Letterhead Design", price: 2500, description: "Official corporate letterhead template." },
      { name: "Email Signature Design", price: 2500, description: "HTML email signature for corporate accounts." },
      { name: "Flyer Design", price: 5000, description: "Marketing flyer design for print & digital." },
      { name: "Brochure Design", price: 12000, description: "Multi-page company brochure layout." },
      { name: "Catalogue Design", price: 25000, description: "Product catalog design for print & PDF." },
      { name: "Social Media Post Design", price: 7500, description: "Set of 10 custom social media graphic templates." },
      { name: "Banner Design", price: 5000, description: "Digital ad & website hero banner graphics." },
      { name: "Custom UI/UX Design", price: 45000, description: "Tailored Figma UI/UX design prototype." },
      { name: "Premium Illustrations", price: 18000, description: "Custom vector illustrations for landing pages." },
      { name: "Custom Icons", price: 12000, description: "Unique brand icon set." },
    ],
  },
  {
    name: "Content",
    icon: "FileText",
    addons: [
      { name: "Website Content Writing", price: 12000, description: "Professional content writing for primary pages." },
      { name: "SEO Content Writing", price: 15000, description: "Keyword-optimized website content." },
      { name: "Product Description Writing", price: 10000, description: "Engaging sales copy for products (up to 50 items)." },
      { name: "Product Data Entry", price: 8000, description: "Manual data entry & upload of product listings." },
      { name: "Blog Writing", price: 12000, description: "Set of 4 SEO blog posts (1000 words each)." },
      { name: "Landing Page Copywriting", price: 15000, description: "High-converting sales copy for landing pages." },
      { name: "Legal Pages Content", price: 7500, description: "Drafting Privacy, Terms, and Disclaimer pages." },
      { name: "FAQ Creation", price: 5000, description: "Structured FAQ content creation." },
      { name: "Translation Services", price: 18000, description: "Multi-language professional content translation." },
      { name: "Content Migration", price: 15000, description: "Migration of existing articles/media from legacy sites." },
    ],
  },
  {
    name: "Photography & Media",
    icon: "Camera",
    addons: [
      { name: "Product Photography", price: 25000, description: "High-resolution catalog product photos." },
      { name: "Corporate Photography", price: 30000, description: "Office & executive corporate photo shoot." },
      { name: "Team Photography", price: 20000, description: "Professional team portrait sessions." },
      { name: "Food Photography", price: 25000, description: "High-end food & restaurant dish photography." },
      { name: "Drone Photography", price: 35000, description: "Aerial video & photo shoot for real estate & campuses." },
      { name: "Promotional Video", price: 45000, description: "60-second marketing video production." },
      { name: "Corporate Video", price: 60000, description: "Full corporate overview video with voiceover." },
      { name: "Product Demo Video", price: 35000, description: "Video demonstration of SaaS/physical products." },
      { name: "Video Editing", price: 20000, description: "Professional post-production video editing." },
      { name: "Motion Graphics", price: 25000, description: "Custom 2D/3D animated motion graphics." },
    ],
  },
  {
    name: "AI Features",
    icon: "Sparkles",
    addons: [
      { name: "AI Chatbot", price: 25000, description: "Custom trained AI chatbot for automated Q&A." },
      { name: "AI Customer Support", price: 30000, description: "24/7 AI ticket resolution assistant." },
      { name: "AI Live Assistant", price: 35000, description: "Real-time AI helper for web apps." },
      { name: "AI Search", price: 30000, description: "Semantic vector AI search engine." },
      { name: "AI Product Recommendation", price: 35000, description: "Personalized AI e-commerce product recommendations." },
      { name: "AI Lead Qualification", price: 25000, description: "Automated AI lead scoring & qualification." },
      { name: "AI Appointment Assistant", price: 25000, description: "Voice/Chat AI booking assistant." },
      { name: "AI Content Generator", price: 25000, description: "Automated draft & copy generation tool." },
      { name: "AI Blog Generator", price: 20000, description: "AI automated blog outline & draft writer." },
      { name: "AI SEO Assistant", price: 20000, description: "AI meta tags & keyword optimizer." },
      { name: "AI Analytics", price: 35000, description: "Predictive AI business insights dashboard." },
      { name: "AI Workflow Automation", price: 40000, description: "AI-driven decision routing & task automation." },
      { name: "AI Document Summarisation", price: 25000, description: "Automatic summarization for PDFs & docs." },
    ],
  },
  {
    name: "Mobile Applications",
    icon: "Smartphone",
    addons: [
      { name: "Android App", price: 75000, description: "Native Android app published on Play Store." },
      { name: "iOS App", price: 85000, description: "Native iOS app published on App Store." },
      { name: "Flutter App", price: 95000, description: "Cross-platform Flutter iOS & Android application." },
      { name: "React Native App", price: 95000, description: "Cross-platform React Native mobile app." },
      { name: "Progressive Web App (PWA)", price: 35000, description: "Installable web application with offline support." },
    ],
  },
  {
    name: "Payment & Commerce",
    icon: "CreditCard",
    addons: [
      { name: "Additional Payment Gateway", price: 10000, description: "Integration of secondary payment processor." },
      { name: "Razorpay Integration", price: 10000, description: "Seamless Razorpay checkout & subscription setup." },
      { name: "Cashfree Integration", price: 10000, description: "Cashfree payment gateway integration." },
      { name: "PhonePe Integration", price: 10000, description: "PhonePe UPI & card payment gateway." },
      { name: "Subscription Billing", price: 18000, description: "Automated recurring subscription billing system." },
      { name: "EMI Payment", price: 12000, description: "Credit/Debit card EMI checkout option." },
      { name: "Wallet System", price: 25000, description: "In-app digital customer wallet balance." },
      { name: "Gift Cards", price: 15000, description: "Digital gift card purchasing & redemption." },
      { name: "Loyalty Program", price: 20000, description: "Customer reward points & cashback engine." },
    ],
  },
  {
    name: "Shipping & Logistics",
    icon: "Truck",
    addons: [
      { name: "Shiprocket Integration", price: 12000, description: "Automated Shiprocket courier dispatch & tracking." },
      { name: "Delhivery Integration", price: 12000, description: "Direct Delhivery courier API sync." },
      { name: "Blue Dart Integration", price: 15000, description: "Blue Dart express logistics integration." },
      { name: "DTDC Integration", price: 12000, description: "DTDC courier API integration." },
      { name: "India Post Integration", price: 12000, description: "India Post Speed Post tracking sync." },
      { name: "Live Shipment Tracking", price: 15000, description: "Real-time customer shipment tracking page." },
      { name: "Shipping Label Generation", price: 10000, description: "One-click PDF shipping label & invoice printing." },
      { name: "Courier API Integration", price: 18000, description: "Custom logistics courier REST API connector." },
      { name: "Delivery Partner Integration", price: 20000, description: "Third-party hyper-local delivery fleet API." },
    ],
  },
  {
    name: "Communication",
    icon: "MessageSquare",
    addons: [
      { name: "WhatsApp Business API", price: 12000, description: "Automated WhatsApp messages, alerts & notifications." },
      { name: "SMS Gateway", price: 8000, description: "Transactional SMS OTP & alert gateway setup." },
      { name: "Bulk SMS", price: 10000, description: "Promotional bulk SMS campaign system." },
      { name: "Email Marketing Setup", price: 12000, description: "Mailchimp/Sendinblue newsletter automation." },
      { name: "Push Notifications", price: 15000, description: "Web & mobile push notification engine." },
      { name: "Live Chat", price: 10000, description: "Tawk.to/Crisp live customer support chat." },
      { name: "Chat Widget", price: 5000, description: "WhatsApp & quick click-to-call floating widget." },
      { name: "Newsletter Integration", price: 8000, description: "Automated lead capture newsletter form." },
    ],
  },
  {
    name: "Booking & Meetings",
    icon: "Calendar",
    addons: [
      { name: "Google Calendar Integration", price: 10000, description: "Two-way Google Calendar event sync." },
      { name: "Outlook Calendar Integration", price: 10000, description: "Microsoft Outlook calendar sync." },
      { name: "Zoom Integration", price: 15000, description: "Automatic Zoom video meeting link creation." },
      { name: "Google Meet Integration", price: 15000, description: "Google Meet video link generation." },
      { name: "Microsoft Teams Integration", price: 18000, description: "MS Teams automated meeting setup." },
      { name: "Telemedicine Module", price: 35000, description: "E-prescriptions & virtual patient consultations." },
    ],
  },
  {
    name: "Marketing",
    icon: "TrendingUp",
    addons: [
      { name: "SEO Optimisation", price: 20000, description: "Complete on-page SEO optimization package." },
      { name: "Local SEO", price: 15000, description: "Google Business Profile optimization & local citations." },
      { name: "Technical SEO Audit", price: 12000, description: "In-depth site audit, speed & broken link fixes." },
      { name: "Google Analytics Setup", price: 5000, description: "GA4 property setup & event tracking." },
      { name: "Google Tag Manager", price: 6000, description: "GTM container setup & custom triggers." },
      { name: "Google Search Console", price: 4000, description: "Search console indexing & sitemap submission." },
      { name: "Meta Pixel Setup", price: 5000, description: "Facebook & Instagram conversion tracking pixel." },
      { name: "Google Ads Setup", price: 15000, description: "Google Search & Display Ads campaign launch." },
      { name: "Meta Ads Setup", price: 15000, description: "Facebook & Instagram ad campaign setup." },
      { name: "LinkedIn Ads Setup", price: 18000, description: "B2B LinkedIn sponsored ad campaigns." },
      { name: "Email Marketing", price: 15000, description: "Drip campaign copy & template design." },
      { name: "Social Media Marketing", price: 25000, description: "Monthly social content management." },
      { name: "Performance Marketing", price: 35000, description: "ROI-driven PPC & lead generation ads." },
    ],
  },
  {
    name: "Third-Party Integrations",
    icon: "Puzzle",
    addons: [
      { name: "CRM Integration", price: 25000, description: "Salesforce/HubSpot CRM sync." },
      { name: "ERP Integration", price: 45000, description: "SAP/Oracle/Tally ERP sync API." },
      { name: "HRMS Integration", price: 35000, description: "HR software employee sync." },
      { name: "POS Integration", price: 30000, description: "Point of sale inventory & bill sync." },
      { name: "Accounting Software Integration", price: 25000, description: "Zoho Books/QuickBooks sync." },
      { name: "Inventory Software Integration", price: 25000, description: "Warehouse inventory management API sync." },
      { name: "WhatsApp Integration", price: 12000, description: "WhatsApp notification webhooks." },
      { name: "Payment Gateway Integration", price: 10000, description: "Payment gateway webhook setup." },
      { name: "Custom API Integration", price: 30000, description: "Custom REST/GraphQL API integration." },
      { name: "Webhook Integration", price: 15000, description: "Real-time external event webhooks." },
    ],
  },
  {
    name: "Security",
    icon: "ShieldCheck",
    addons: [
      { name: "Two-Factor Authentication (2FA)", price: 18000, description: "SMS/Authenticator 2FA login verification." },
      { name: "Single Sign-On (SSO)", price: 35000, description: "Google Workspace / SAML SSO integration." },
      { name: "IP Restriction", price: 12000, description: "Admin panel access restricted to specific IP addresses." },
      { name: "Security Audit", price: 25000, description: "Comprehensive vulnerability & code audit." },
      { name: "Penetration Testing", price: 45000, description: "Ethical hacking & penetration testing." },
      { name: "Malware Protection", price: 15000, description: "Automated daily malware scan & firewall." },
      { name: "Advanced Backup Solution", price: 18000, description: "Automated daily off-site cloud backups." },
    ],
  },
  {
    name: "Enterprise Features",
    icon: "Building2",
    addons: [
      { name: "Multi-language", price: 25000, description: "Multi-language site switcher & localization." },
      { name: "Multi-currency", price: 20000, description: "Real-time auto currency converter." },
      { name: "Multi-location", price: 30000, description: "Multi-branch store location management." },
      { name: "White Label Solution", price: 60000, description: "Complete re-branding and white-labeling." },
      { name: "Multi-Tenant Architecture", price: 95000, description: "Isolated SaaS multi-tenant database setup." },
      { name: "Workflow Automation", price: 40000, description: "Custom automated business process workflows." },
      { name: "Approval Engine", price: 30000, description: "Multi-tier manager approval system." },
    ],
  },
  {
    name: "Infrastructure & DevOps",
    icon: "Server",
    addons: [
      { name: "Cloud Server Setup", price: 25000, description: "AWS/GCP/DigitalOcean server setup & hardening." },
      { name: "Server Management", price: 30000, description: "Yearly server monitoring, patches & optimization." },
      { name: "CDN Setup", price: 12000, description: "Cloudflare global CDN asset acceleration." },
      { name: "Load Balancer", price: 35000, description: "High-traffic NGINX/AWS load balancer configuration." },
      { name: "Auto Scaling", price: 40000, description: "Dynamic server auto-scaling rules." },
      { name: "Staging Environment", price: 15000, description: "Isolated development staging server." },
      { name: "CI/CD Pipeline", price: 25000, description: "GitHub Actions automated deployment pipeline." },
      { name: "Performance Monitoring", price: 18000, description: "New Relic / Datadog APM tracing setup." },
      { name: "Error Monitoring", price: 12000, description: "Sentry real-time error tracking." },
      { name: "Cloud Migration", price: 45000, description: "Migration to cloud infrastructure with 0 downtime." },
    ],
  },
  {
    name: "Reports & Analytics",
    icon: "BarChart3",
    addons: [
      { name: "Custom Dashboard", price: 30000, description: "Tailored metric cards & visual charts." },
      { name: "Executive Dashboard", price: 35000, description: "C-level high-level business KPI dashboard." },
      { name: "Business Intelligence Dashboard", price: 50000, description: "Interactive BI data warehouse visualization." },
      { name: "Custom Report Builder", price: 35000, description: "Exportable PDF/Excel custom report builder." },
      { name: "Advanced Analytics", price: 30000, description: "Deep user retention & cohort analytics." },
      { name: "Sales Dashboard", price: 25000, description: "Real-time sales performance graphs." },
      { name: "Revenue Dashboard", price: 25000, description: "Financial revenue & recurring revenue charts." },
    ],
  },
  {
    name: "Data Services",
    icon: "Database",
    addons: [
      { name: "Data Migration", price: 25000, description: "Secure transfer of database records." },
      { name: "Bulk Data Import", price: 15000, description: "Bulk CSV/Excel data upload tools." },
      { name: "Excel Import/Export", price: 10000, description: "Custom Excel data import/export functionality." },
      { name: "Legacy System Migration", price: 45000, description: "Complete migration from legacy platforms." },
      { name: "Database Optimisation", price: 20000, description: "Database indexing, query tuning & cleanup." },
    ],
  },
  {
    name: "Maintenance & Support",
    icon: "LifeBuoy",
    addons: [
      { name: "Annual Maintenance Contract (AMC)", price: 36000, description: "Yearly server maintenance, security & backups." },
      { name: "Monthly Maintenance", price: 5000, description: "Monthly health check & plugin updates." },
      { name: "Quarterly Maintenance", price: 12000, description: "Quarterly audit & speed optimization." },
      { name: "Priority Support", price: 18000, description: "2-hour priority ticket response SLA." },
      { name: "Dedicated Support Engineer", price: 45000, description: "Assigned technical engineer for 1 year." },
      { name: "Security Updates", price: 15000, description: "Regular security patches & vulnerability fixes." },
      { name: "Performance Optimisation", price: 20000, description: "Speed optimization to achieve 90+ PageSpeed." },
      { name: "Feature Enhancements", price: 25000, description: "Minor feature additions & layout tweaks." },
      { name: "Technical Training", price: 15000, description: "Live video training session for staff." },
    ],
  },
  {
    name: "Compliance & Legal",
    icon: "ShieldAlert",
    addons: [
      { name: "Privacy Policy Drafting", price: 5000, description: "Legally compliant Privacy Policy document." },
      { name: "Terms & Conditions Drafting", price: 5000, description: "Terms of Service & legal conditions." },
      { name: "Cookie Policy", price: 3500, description: "Custom Cookie Policy document." },
      { name: "GDPR Compliance", price: 18000, description: "GDPR data privacy & user deletion compliance." },
      { name: "Cookie Consent Banner", price: 4000, description: "Interactive cookie consent banner." },
    ],
  },
  {
    name: "Domain & Email",
    icon: "Globe",
    addons: [
      { name: "Domain Registration", price: 1500, description: "1-year domain name registration (.com/.in)." },
      { name: "Domain Transfer", price: 1500, description: "Domain DNS & registrar transfer." },
      { name: "Professional Business Email Setup", price: 4000, description: "Google Workspace / Zoho Mail business email setup." },
      { name: "DNS Management", price: 2500, description: "DNS record configuration & SPF/DKIM/DMARC setup." },
      { name: "SSL Certificate Upgrade", price: 5000, description: "Wildcard / EV SSL certificate installation." },
    ],
  },
];

async function run() {
  console.log("🚀 Seeding Master Add-on Library (19 Categories, 120+ Add-ons)...");

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

  const serviceCategoryId = websiteCatDoc.id;
  console.log(`✅ Target Service Category: ${websiteCatDoc.data().name} (${serviceCategoryId})`);

  // 2. Fetch existing Add-on Categories & Features
  const existingCatsSnap = await db
    .collection("addon_categories")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const existingAddonsSnap = await db
    .collection("addon_features")
    .where("serviceCategoryId", "==", serviceCategoryId)
    .get();

  const now = new Date();
  let totalCategoriesCreated = 0;
  let totalAddonsCreated = 0;

  let batch = db.batch();
  let batchCount = 0;

  async function checkCommitBatch(force = false) {
    if (batchCount >= 400 || (force && batchCount > 0)) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  for (let catIdx = 0; catIdx < masterAddonLibrary.length; catIdx++) {
    const catDef = masterAddonLibrary[catIdx];

    let catDoc = existingCatsSnap.docs.find(
      (d) => d.data().name.toLowerCase().trim() === catDef.name.toLowerCase().trim()
    );

    let categoryId = "";

    if (catDoc) {
      categoryId = catDoc.id;
    } else {
      const catRef = db.collection("addon_categories").doc();
      categoryId = catRef.id;
      batch.set(catRef, {
        serviceCategoryId,
        name: catDef.name,
        icon: catDef.icon,
        sortOrder: catIdx + 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      batchCount++;
      totalCategoriesCreated++;
      console.log(`✅ Queued Add-on Category [${catIdx + 1}/19]: ${catDef.name} (${categoryId})`);
      await checkCommitBatch();
    }

    for (let addIdx = 0; addIdx < catDef.addons.length; addIdx++) {
      const addon = catDef.addons[addIdx];
      const existingAddon = existingAddonsSnap.docs.find(
        (d) => d.data().name.toLowerCase().trim() === addon.name.toLowerCase().trim()
      );

      if (!existingAddon) {
        const addRef = db.collection("addon_features").doc();
        batch.set(addRef, {
          serviceCategoryId,
          categoryId,
          name: addon.name,
          description: addon.description,
          pricingType: "fixed",
          price: addon.price,
          unitName: "",
          isActive: true,
          sortOrder: addIdx + 1,
          createdAt: now,
          updatedAt: now,
        });
        batchCount++;
        totalAddonsCreated++;
        await checkCommitBatch();
      }
    }
  }

  await checkCommitBatch(true);

  console.log(`🎉 Master Add-on Library Seeding Complete!`);
  console.log(`📊 Total Categories Created: ${totalCategoriesCreated} | Total Add-ons Created: ${totalAddonsCreated}`);
}

run().catch((err) => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
