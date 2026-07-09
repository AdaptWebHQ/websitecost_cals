import type { Package, Feature, PriceConfig } from '@/types';

interface CalculatedFeature {
  featureId: string;
  featureName: string;
  categoryName?: string;
  unitPrice: number;
  pricingType: 'fixed' | 'per_page' | 'percentage';
  calculatedPrice: number;
}

interface QuotationResult {
  basePrice: number;
  featuresPrice: number;
  subtotal: number;
  rushMarkup: number;
  netTotal: number;
  gstAmount: number;
  total: number;
  selectedFeatures: CalculatedFeature[];
}

/** Recalculate quotation quote values server-side using current DB pricing and package options */
export function calculateQuotation(
  selectedPackage: Package,
  selectedFeatures: Feature[],
  pagesCount: number,
  isRushDelivery: boolean,
  priceConfig: PriceConfig,
  customFeatures: { id: string; name: string; price: number }[] = []
): QuotationResult {
  const basePrice = selectedPackage.basePrice;
  let featuresPrice = 0;

  // Process features list and calculate cost contribution
  const processedFeatures: CalculatedFeature[] = selectedFeatures.map((f) => {
    let cost = 0;
    if (f.pricingType === 'fixed') {
      cost = f.price;
    } else if (f.pricingType === 'per_page') {
      cost = f.price * pagesCount;
    } else if (f.pricingType === 'percentage') {
      cost = Math.round((f.price / 100) * basePrice);
    }

    featuresPrice += cost;

    return {
      featureId: f.id,
      featureName: f.name,
      categoryName: 'Standard',
      unitPrice: f.price,
      pricingType: f.pricingType,
      calculatedPrice: cost,
    };
  });

  // Process custom features
  const processedCustomFeatures: CalculatedFeature[] = customFeatures.map((cf) => {
    featuresPrice += cf.price;
    return {
      featureId: cf.id,
      featureName: cf.name,
      categoryName: 'Custom Request',
      unitPrice: cf.price,
      pricingType: 'fixed',
      calculatedPrice: cf.price,
    };
  });

  // Price additional pages beyond the package inclusion
  const extraPages = Math.max(0, pagesCount - selectedPackage.pagesIncluded);
  const extraPagesCost = extraPages * 1500; // 1,500 INR/unit per extra page
  featuresPrice += extraPagesCost;

  const allProcessedFeatures = [...processedFeatures, ...processedCustomFeatures];

  if (extraPages > 0) {
    allProcessedFeatures.push({
      featureId: 'extra_pages',
      featureName: `Extra Pages (${extraPages} additional)`,
      categoryName: 'Pages',
      unitPrice: 1500,
      pricingType: 'per_page',
      calculatedPrice: extraPagesCost,
    });
  }

  const subtotal = basePrice + featuresPrice;

  // Rush Delivery markup
  let rushMarkup = 0;
  if (isRushDelivery) {
    rushMarkup = Math.round((priceConfig.rushDeliveryPercentage / 100) * subtotal);
  }

  const netTotal = subtotal + rushMarkup;
  const gstAmount = Math.round((priceConfig.gstPercentage / 100) * netTotal);
  
  // Total quote value must be at least minimumProjectPrice
  const totalRaw = netTotal + gstAmount;
  const total = totalRaw;

  return {
    basePrice,
    featuresPrice,
    subtotal,
    rushMarkup,
    netTotal,
    gstAmount,
    total,
    selectedFeatures: allProcessedFeatures,
  };
}
