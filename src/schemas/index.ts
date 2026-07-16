import { z } from 'zod';

// ============================================================================
// Package Schemas
// ============================================================================

export const packageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  basePrice: z.coerce.number().min(0, 'Price must be positive'),
  deliveryDays: z.coerce.number().min(1, 'Delivery days must be at least 1').max(365),
  revisions: z.coerce.number().min(0).max(999),
  pagesIncluded: z.coerce.number().min(1, 'Must include at least 1 page').max(100),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
  includedFeatureIds: z.array(z.string()).default([]),
});

export type PackageFormData = z.infer<typeof packageSchema>;

// ============================================================================
// Package In-built Feature & Category Schemas
// ============================================================================

export const packageFeatureCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).default(''),
  icon: z.string().min(1, 'Icon is required'),
  displayOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type PackageFeatureCategoryFormData = z.infer<typeof packageFeatureCategorySchema>;

export const packageFeatureSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).default(''),
  displayOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type PackageFeatureFormData = z.infer<typeof packageFeatureSchema>;

// ============================================================================
// Addon Category Schemas
// ============================================================================

export const addonCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).default(''),
  icon: z.string().min(1, 'Icon is required'),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type AddonCategoryFormData = z.infer<typeof addonCategorySchema>;

// ============================================================================
// Addon Feature Schemas
// ============================================================================

export const addonFeatureSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).default(''),
  pricingType: z.enum(['fixed', 'per_page', 'percentage']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  defaultSelected: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type AddonFeatureFormData = z.infer<typeof addonFeatureSchema>;



// ============================================================================
// Industry Schemas
// ============================================================================

export const industrySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500), // <-- ADDED THIS FIELD WITH VALIDATION
  basePrice: z.coerce.number().min(0, 'Price must be positive'),
  recommendedPackageId: z.string().min(1, 'Recommended package is required'),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type IndustryFormData = z.infer<typeof industrySchema>;

// ============================================================================
// Price Configuration Schemas
// ============================================================================

export const priceConfigSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  gstPercentage: z.coerce.number().min(0).max(100),
  minimumProjectPrice: z.coerce.number().min(0),
  rushDeliveryPercentage: z.coerce.number().min(0).max(100),
  quotationValidityDays: z.coerce.number().min(1).max(365),
  defaultDeliveryDays: z.coerce.number().min(1).max(365),
  companyName: z.string().min(2, 'Company name is required'),
  companyEmail: z.string().email('Valid email is required'),
  companyPhone: z.string().min(10, 'Valid phone number is required'),
  companyAddress: z.string().min(5, 'Address is required'),
  pdfFooter: z.string().max(500).default(''),
  termsAndConditions: z.string().default(''),
  privacyPolicy: z.string().default(''),
  isCalculatorEnabled: z.boolean().default(true),
});

export type PriceConfigFormData = z.infer<typeof priceConfigSchema>;

// ============================================================================
// Calculator Step Schemas
// ============================================================================

export const businessDetailsSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessEmail: z.string().email('Valid email is required'),
  businessPhone: z.string()
    .min(10, 'Valid phone number must be at least 10 digits')
    .regex(/^[+]?[0-9\s-()]{10,20}$/, 'Invalid phone number format'),
});

export type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;

export const industrySelectionSchema = z.object({
  industryId: z.string().min(1, 'Please select an industry'),
});

export type IndustrySelectionData = z.infer<typeof industrySelectionSchema>;

export const websiteTypeSchema = z.object({
  websiteType: z.string().min(1, 'Please select a website type'),
});

export type WebsiteTypeData = z.infer<typeof websiteTypeSchema>;

export const packageSelectionSchema = z.object({
  packageId: z.string().min(1, 'Please select a package'),
});

export type PackageSelectionData = z.infer<typeof packageSelectionSchema>;

export const pagesSchema = z.object({
  pages: z.coerce.number().min(1, 'At least 1 page is required').max(200, 'Maximum 200 pages'),
});

export type PagesData = z.infer<typeof pagesSchema>;

export const featuresSelectionSchema = z.object({
  selectedFeatureIds: z.array(z.string()).default([]),
});

export type FeaturesSelectionData = z.infer<typeof featuresSelectionSchema>;

/** Full calculator submission — used for server-side recalculation & validation */
export const calculatorSubmissionSchema = z.object({
  businessName: z.string().min(2),
  businessEmail: z.string().email(),
  businessPhone: z.string().min(10),
  industryId: z.string().min(1),
  websiteType: z.string().min(1),
  packageId: z.string().min(1),
  pages: z.coerce.number().min(1).max(200),
  selectedFeatureIds: z.array(z.string()),
  rushDelivery: z.boolean().default(false),
  customFeatures: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      price: z.coerce.number().min(0),
    })
  ).optional().default([]),
});

export type CalculatorSubmissionData = z.infer<typeof calculatorSubmissionSchema>;



// ============================================================================
// Contact / Inquiry Schemas
// ============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(1, 'Company name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Admin-side inquiry update */
export const inquiryUpdateSchema = z.object({
  status: z.enum([
    'new',
    'contacted',
    'proposal_sent',
    'converted',
    'lost',
  ]),
  temperature: z.enum(['hot', 'cold']).optional(),
  assignedTo: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  note: z.string().optional(),
});

export type InquiryUpdateData = z.infer<typeof inquiryUpdateSchema>;

/** Inquiry activity log entry */
export const inquiryActivitySchema = z.object({
  inquiryId: z.string().min(1),
  action: z.string().min(1),
  note: z.string().default(''),
});

export type InquiryActivityData = z.infer<typeof inquiryActivitySchema>;

// ============================================================================
// Settings & Profile Schemas
// ============================================================================

export const settingsSchema = z.object({
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  companyPhone: z.string().min(10),
  companyAddress: z.string().min(5),
  termsAndConditions: z.string(),
  privacyPolicy: z.string(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
