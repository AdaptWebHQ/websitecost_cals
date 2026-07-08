import type { Package, Feature, PriceConfig } from '@/types';

interface CalculatedFeature {
  featureId: string;
  featureName: string;
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
  priceConfig: PriceConfig
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
      unitPrice: f.price,
      pricingType: f.pricingType,
      calculatedPrice: cost,
    };
  });

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
  const total = Math.max(totalRaw, priceConfig.minimumProjectPrice);

  return {
    basePrice,
    featuresPrice,
    subtotal,
    rushMarkup,
    netTotal,
    gstAmount,
    total,
    selectedFeatures: processedFeatures,
  };
}
