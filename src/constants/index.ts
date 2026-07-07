import type { InquiryStatus, CalculatorStep, UserRole, NavItem } from '@/types';

// ============================================================================
// Inquiry Status Configuration
// ============================================================================

export const INQUIRY_STATUSES: Record<
  InquiryStatus,
  { label: string; color: string; bgColor: string; order: number }
> = {
  new: { label: 'New', color: 'text-blue-600', bgColor: 'bg-blue-100', order: 0 },
  inquired: { label: 'Inquired', color: 'text-purple-600', bgColor: 'bg-purple-100', order: 1 },
  contacted: { label: 'Contacted', color: 'text-yellow-600', bgColor: 'bg-yellow-100', order: 2 },
  proposal_sent: { label: 'Proposal Sent', color: 'text-orange-600', bgColor: 'bg-orange-100', order: 3 },
  negotiation: { label: 'Negotiation', color: 'text-indigo-600', bgColor: 'bg-indigo-100', order: 4 },
  booked: { label: 'Booked', color: 'text-green-600', bgColor: 'bg-green-100', order: 5 },
  lost: { label: 'Lost', color: 'text-red-600', bgColor: 'bg-red-100', order: 6 },
};

// ============================================================================
// Calculator Steps
// ============================================================================

export const CALCULATOR_STEPS: {
  step: CalculatorStep;
  label: string;
  description: string;
}[] = [
  { step: 'business', label: 'Business Details', description: 'Tell us about your business' },
  { step: 'industry', label: 'Industry', description: 'Select your industry' },
  { step: 'website_type', label: 'Website Type', description: 'Choose your website type' },
  { step: 'package', label: 'Package', description: 'Select a package' },
  { step: 'pages', label: 'Pages', description: 'How many pages do you need?' },
  { step: 'features', label: 'Features', description: 'Select additional features' },
  { step: 'review', label: 'Review', description: 'Review your selections' },
  { step: 'estimate', label: 'Estimate', description: 'Your estimated cost' },
];

// ============================================================================
// Sidebar Navigation
// ============================================================================

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: 'LayoutDashboard' },
  { label: 'Packages', href: '/dashboard/admin/packages', icon: 'Package' },
  { label: 'Feature Categories', href: '/dashboard/admin/feature-categories', icon: 'FolderTree' },
  { label: 'Features', href: '/dashboard/admin/features', icon: 'Puzzle' },
  { label: 'Industries', href: '/dashboard/admin/industries', icon: 'Building2' },
  { label: 'Price Config', href: '/dashboard/admin/price-config', icon: 'IndianRupee' },
  { label: 'Calculations', href: '/dashboard/admin/calculations', icon: 'Calculator' },
  { label: 'Inquiries', href: '/dashboard/admin/inquiries', icon: 'MessageSquare' },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: 'Settings' },
  { label: 'Profile', href: '/dashboard/admin/profile', icon: 'UserCircle' },
];

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/public', icon: 'LayoutDashboard' },
  { label: 'Calculator', href: '/dashboard/public/calculator', icon: 'Calculator' },
  { label: 'My Estimates', href: '/dashboard/public/estimates', icon: 'FileText' },
  { label: 'Profile', href: '/dashboard/public/profile', icon: 'UserCircle' },
];

// ============================================================================
// Website Types
// ============================================================================

export const WEBSITE_TYPES = [
  { value: 'informational', label: 'Informational', description: 'Company website with info pages' },
  { value: 'ecommerce', label: 'E-Commerce', description: 'Online store with product listings' },
  { value: 'portfolio', label: 'Portfolio', description: 'Showcase your work and projects' },
  { value: 'booking', label: 'Booking / Appointment', description: 'Schedule and manage appointments' },
  { value: 'blog', label: 'Blog / Content', description: 'Content-focused publishing platform' },
  { value: 'saas', label: 'SaaS / Web App', description: 'Software as a service application' },
  { value: 'custom', label: 'Custom', description: 'Fully custom solution' },
] as const;

// ============================================================================
// Recommended Tech Stack
// ============================================================================

export const TECH_STACK = {
  frontend: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
  backend: ['Node.js', 'Firebase', 'REST API'],
  database: ['Firebase Firestore'],
  hosting: ['Vercel', 'Firebase Hosting'],
  additional: ['Google Analytics', 'Cloudflare CDN'],
} as const;

// ============================================================================
// Default Price Configuration (fallback only — real values from Firestore)
// ============================================================================

export const DEFAULT_PRICE_CONFIG = {
  currency: 'INR',
  currencySymbol: '₹',
  gstPercentage: 18,
  minimumProjectPrice: 10000,
  rushDeliveryPercentage: 25,
  quotationValidityDays: 15,
  defaultDeliveryDays: 30,
} as const;

// ============================================================================
// Label Mappings
// ============================================================================

export const PRICING_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixed Price',
  per_page: 'Per Page',
  percentage: 'Percentage of Base',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  public: 'Public User',
  admin: 'Administrator',
  super_admin: 'Super Administrator',
};

export const CALCULATION_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  completed: 'Completed',
  converted: 'Converted',
};

// ============================================================================
// Inquiry Sources & Budget Ranges
// ============================================================================

export const INQUIRY_SOURCES = [
  'Calculator',
  'Contact Form',
  'Referral',
  'Social Media',
  'Direct',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,50,000',
  '₹2,50,000 – ₹5,00,000',
  'Above ₹5,00,000',
] as const;

// ============================================================================
// Feature Category Icons (Lucide icon names)
// ============================================================================

export const CATEGORY_ICONS = [
  'Layers', 'Shield', 'ShoppingCart', 'Megaphone', 'Search',
  'Server', 'Headphones', 'Plug', 'BarChart', 'Brain',
  'Globe', 'Mail', 'CreditCard', 'Users', 'FileText',
] as const;

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = [
  '#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#14B8A6', '#F97316', '#3B82F6',
] as const;

// ============================================================================
// Application Metadata
// ============================================================================

export const APP_NAME = 'WebCost Pro';
export const APP_DESCRIPTION =
  'Dynamic Website Cost Calculator — Get instant estimates for your web development project';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ============================================================================
// Firestore Collection Names
// ============================================================================

export const COLLECTIONS = {
  USERS: 'users',
  PACKAGES: 'packages',
  FEATURE_CATEGORIES: 'feature_categories',
  FEATURES: 'features',
  INDUSTRIES: 'industries',
  PRICE_CONFIG: 'price_config',
  CALCULATIONS: 'calculations',
  INQUIRIES: 'inquiries',
  INQUIRY_ACTIVITIES: 'inquiry_activities',
  PDF_REPORTS: 'pdf_reports',
} as const;

/** Singleton document ID for price_config collection */
export const PRICE_CONFIG_DOC_ID = 'global';
