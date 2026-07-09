// ============================================================================
// User Types
// ============================================================================

/** Supported user roles */
export type UserRole = 'public' | 'admin' | 'super_admin';

/** User document stored in Firestore `users` collection */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Package Types
// ============================================================================

/** Website package (e.g., Starter, Business, Premium, Enterprise) */
export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  deliveryDays: number;
  revisions: number;
  pagesIncluded: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Feature Types
// ============================================================================

/** Feature category (e.g., Core Features, Authentication, Marketing) */
export interface FeatureCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** How a feature's price is calculated */
export type PricingType = 'fixed' | 'per_page' | 'percentage';

/** Individual feature belonging to a category */
export interface Feature {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  pricingType: PricingType;
  price: number;
  defaultSelected: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Industry Types
// ============================================================================

/** Industry vertical (e.g., Salon, Restaurant, Hospital) */
export interface Industry {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  recommendedPackageId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Price Configuration
// ============================================================================

/** Singleton global price configuration document */
export interface PriceConfig {
  id: string;
  currency: string;
  currencySymbol: string;
  gstPercentage: number;
  minimumProjectPrice: number;
  rushDeliveryPercentage: number;
  quotationValidityDays: number;
  defaultDeliveryDays: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo?: string;
  pdfFooter: string;
  termsAndConditions: string;
  privacyPolicy: string;
  isCalculatorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Calculation Types
// ============================================================================

/** Status of a cost calculation */
export type CalculationStatus = 'draft' | 'completed' | 'converted';

/** A feature selection stored within a Calculation */
export interface SelectedFeature {
  featureId: string;
  featureName: string;
  categoryName?: string;
  pricingType: PricingType;
  unitPrice: number;
  calculatedPrice: number;
}

/** A completed cost calculation/estimate */
export interface Calculation {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  packageId: string;
  packageName: string;
  industryId: string;
  industryName: string;
  websiteType: string;
  pages: number;
  selectedFeatures: SelectedFeature[];
  basePrice?: number;
  featuresPrice?: number;
  rushMarkup?: number;
  subtotal: number;
  netTotal?: number;
  gstAmount: number;
  total: number;
  estimatedDays?: number;
  isRushDelivery?: boolean;
  rushDeliveryCharge?: number;
  recommendedTechStack?: string[];
  pdfUrl?: string;
  status: CalculationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Inquiry / Lead Types
// ============================================================================

/** CRM lead status — follows the pipeline flow */
export type InquiryStatus =
  | 'new'
  | 'inquired'
  | 'contacted'
  | 'proposal_sent'
  | 'negotiation'
  | 'booked'
  | 'lost';

/** An inquiry/lead linked to a calculation */
export interface Inquiry {
  id: string;
  calculationId?: string | null;
  userId?: string | null;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  source?: string | null;
  status: InquiryStatus;
  assignedTo?: string | null;
  followUpDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Activity log entry for an inquiry */
export interface InquiryActivity {
  id: string;
  inquiryId: string;
  action: string;
  note: string;
  createdBy: string;
  createdAt: Date;
}

// ============================================================================
// PDF Report Types
// ============================================================================

/** A generated PDF report stored in Firebase Storage */
export interface PdfReport {
  id: string;
  calculationId: string;
  version: number;
  fileUrl: string;
  createdAt: Date;
}

// ============================================================================
// Dashboard / Analytics Types
// ============================================================================

/** Summary statistics for the admin dashboard */
export interface DashboardStats {
  totalCalculations: number;
  todayCalculations: number;
  totalLeads: number;
  bookedProjects: number;
  conversionRate: number;
  averageProjectValue: number;
  revenuePipeline: number;
  averageQuoteValue: number;
  convertedLeads: number;
  hotLeads: number;
  coldLeads: number;
}

/** Generic data point for charts */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/** Monthly aggregated data for time-series charts */
export interface MonthlyData {
  month: string;
  count: number;
  revenue: number;
}

// ============================================================================
// Calculator UI Types
// ============================================================================

/** Steps in the multi-step calculator wizard */
export type CalculatorStep =
  | 'business'
  | 'industry'
  | 'website_type'
  | 'package'
  | 'pages'
  | 'features'
  | 'review'
  | 'estimate';

/** Form data collected across all calculator steps */
export interface CalculatorFormData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  industryId: string;
  websiteType: string;
  packageId: string;
  pages: number;
  selectedFeatureIds: string[];
  rushDelivery: boolean;
}

// ============================================================================
// Firestore Helper Types
// ============================================================================

/** Raw Firestore Timestamp shape (before conversion) */
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// ============================================================================
// API / Data Response Types
// ============================================================================

/** Standardized API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Pagination request parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated result set */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Navigation Types
// ============================================================================

/** Sidebar navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
