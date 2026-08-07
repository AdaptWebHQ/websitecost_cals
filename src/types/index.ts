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
// Service Category Types (Root Entity)
// ============================================================================

/**
 * Top-level service offering (e.g. Website Development, Ecommerce, Mobile App).
 * All quotation entities belong to exactly one service category.
 */
export interface ServiceCategory {
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

// ============================================================================
// Service Type Types (replaces Website Type)
// ============================================================================

/**
 * A specific type within a service category (e.g. Informational, E-Commerce, SaaS).
 * Scoped to a single service category.
 */
export interface ServiceType {
  id: string;
  serviceCategoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Package Types
// ============================================================================

/** Service package (e.g., Starter, Business, Premium, Enterprise) scoped to a service category */
export interface Package {
  id: string;
  serviceCategoryId: string;
  serviceTypeId: string;
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
  includedFeatureIds: string[];
  featureCategories?: (PackageFeatureCategory & { features: PackageFeature[] })[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Industry Types
// ============================================================================

/** Industry vertical scoped to a service category */
export interface Industry {
  id: string;
  serviceCategoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  recommendedPackageId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Package Feature Types
// ============================================================================

/** Category grouping for in-package features, scoped to a service category */
export interface PackageFeatureCategory {
  id: string;
  serviceCategoryId: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reusable in-package feature. Can belong to multiple packages via `packageIds`.
 * Scoped to a service category.
 */
export interface PackageFeature {
  id: string;
  serviceCategoryId: string;
  categoryId: string;
  packageIds: string[];
  name: string;
  description: string;
  displayOrder: number;
  isRequired: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Add-on Types
// ============================================================================

/** Add-on category scoped to a service category */
export interface AddonCategory {
  id: string;
  serviceCategoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** How an add-on feature's price is calculated */
export type PricingType = 'fixed' | 'per_page' | 'percentage';

/** Individual add-on feature scoped to a service category */
export interface AddonFeature {
  id: string;
  serviceCategoryId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  pricingType: PricingType;
  price: number;
  defaultSelected: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Price Configuration
// ============================================================================

/** Price configuration document scoped to a service category */
export interface PriceConfig {
  id: string;
  serviceCategoryId?: string;
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

export interface CalculatedFeature {
  featureId: string;
  featureName: string;
  categoryName?: string;
  unitPrice: number;
  pricingType: 'fixed' | 'per_page' | 'percentage';
  calculatedPrice: number;
}

/** A completed cost calculation/estimate — all entity references use IDs only */
export interface Calculation {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  serviceCategoryId: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  industryId: string;
  serviceTypeId: string;
  packageId: string;
  pages: number;
  selectedPackageFeatureIds: string[];
  selectedAddonFeatureIds: string[];
  selectedFeatures: CalculatedFeature[];
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
  websiteType?: string;
  packageName?: string;
  industryName?: string;
  status: CalculationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Inquiry / Lead Types
// ============================================================================

export type LeadTemperature = 'hot' | 'cold';

/** CRM lead status — follows the pipeline flow */
export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'proposal_sent'
  | 'converted'
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
  temperature?: LeadTemperature | null;
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
  /** @deprecated Renamed to `service_type` — retained for existing UI until calculator refactor */
  | 'website_type'
  | 'service_type'
  | 'package'
  | 'pages'
  | 'features'
  | 'review'
  | 'estimate';

/**
 * Form data collected across all calculator steps.
 * All entity selections use IDs — never display names or slugs.
 */
export interface CalculatorFormData {
  serviceCategoryId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  industryId: string;
  serviceTypeId: string;
  packageId: string;
  pages: number;
  selectedPackageFeatureIds: string[];
  selectedAddonFeatureIds: string[];
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

export interface CursorPageResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
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
