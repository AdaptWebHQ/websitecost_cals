'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { formatCurrency } from '@/lib/utils';
import type { Package, Feature, PriceConfig } from '@/types';
import { 
  ShieldCheck, 
  Calendar, 
  Wrench, 
  Sparkles, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Mail,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface LiveSummaryProps {
  packages: Package[];
  features: Feature[];
  priceConfig: PriceConfig;
  onFinalize: () => void;
  isLoading: boolean;
  currentStep: number;
}

export default function LiveSummary({
  packages,
  features,
  priceConfig,
  onFinalize,
  isLoading,
  currentStep,
}: LiveSummaryProps) {
  const {
    packageId,
    pages,
    selectedFeatureIds,
    rushDelivery,
    customFeatures,
    businessName,
  } = useCalculatorStore();

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedFeatures = features.filter((f) => selectedFeatureIds.includes(f.id));

  if (!selectedPackage) {
    return (
      <div className="card-custom p-6 flex flex-col justify-center items-center text-center">
        <AlertCircle className="w-8 h-8 text-primary mb-3" />
        <h3 className="font-bold text-foreground text-sm">No Package Selected</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
          Select a baseline quotation tier to generate your live cost estimation.
        </p>
      </div>
    );
  }

  // Calculate pricing client-side
  const pricing = calculateQuotation(
    selectedPackage,
    selectedFeatures,
    pages,
    rushDelivery,
    priceConfig,
    customFeatures
  );

  // Determine timeline
  const baseDays = selectedPackage.deliveryDays;
  const pageMarkupDays = Math.ceil(Math.max(0, pages - selectedPackage.pagesIncluded) * 1.5);
  const totalDays = Math.max(3, rushDelivery ? Math.ceil((baseDays + pageMarkupDays) * 0.5) : (baseDays + pageMarkupDays));

  // Determine maintenance estimate (monthly)
  const maintenanceCost = Math.round(pricing.total * 0.02);

  // Calculate project complexity score
  const totalItemsCount = selectedFeatures.length + customFeatures.length + (pages > selectedPackage.pagesIncluded ? 1 : 0);
  const complexityScore = totalItemsCount <= 2 ? 'Standard' : totalItemsCount <= 6 ? 'Advanced' : 'Enterprise';

  // Calculate standard + custom modules price (excluding extra pages)
  const standardModulesPrice = selectedFeatures.reduce((acc, f) => {
    if (f.pricingType === 'fixed') return acc + f.price;
    if (f.pricingType === 'per_page') return acc + (f.price * pages);
    if (f.pricingType === 'percentage') return acc + Math.round((f.price / 100) * selectedPackage.basePrice);
    return acc;
  }, 0);
  const customModulesPrice = customFeatures.reduce((acc, cf) => acc + cf.price, 0);
  const modulesPrice = standardModulesPrice + customModulesPrice;

  const extraPagesCount = Math.max(0, pages - selectedPackage.pagesIncluded);
  const extraPagesCost = extraPagesCount * 1500;

  const shareText = encodeURIComponent(`Hi AdaptWeb team, I just estimated a website cost of ${formatCurrency(pricing.total)} for my business "${businessName || 'My Brand'}". I would love to discuss next steps!`);
  const whatsappUrl = `https://wa.me/919999999999?text=${shareText}`;
  const mailToUrl = `mailto:inquire@adaptweb.com?subject=Website Quotation Request - ${businessName || 'New Client'}&body=${shareText}`;

  return (
    <div className="card-custom p-4 flex flex-col gap-4 sticky top-6">
      
      {/* Stripe-style product header */}
      <div className="space-y-1.5 pb-4 border-b border-border">
        <span className="text-[9px] font-bold text-primary tracking-widest uppercase font-mono bg-primary/5 px-2 py-0.5 rounded w-fit">
          Live Estimate
        </span>
        <h2 aria-live="polite" className="text-3xl font-bold text-foreground tracking-tight">
          {formatCurrency(pricing.total)}
        </h2>
        <p className="text-[10px] text-muted-foreground leading-normal">
          Approximate project cost (including GST)
        </p>
      </div>

      {/* Progress meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase font-mono">
          <span>Config Progress</span>
          <span>{Math.round((currentStep / 7) * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Collapsible cost breakdown */}
      <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
        <button
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full px-3 py-2 flex items-center justify-between text-[10px] font-bold text-foreground/85 uppercase tracking-wider font-mono outline-none"
        >
          <span>Breakdown Details</span>
          {isAccordionOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {isAccordionOpen && (
          <div className="px-3 pb-3 space-y-2.5 text-xs border-t border-border pt-2.5 animate-in slide-in-from-top-1 duration-200">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Baseline ({selectedPackage.name})</span>
              <span className="text-foreground font-semibold">{formatCurrency(pricing.basePrice)}</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground">
              <span>Pages Included</span>
              <span className="text-foreground font-semibold">{selectedPackage.pagesIncluded} Pages</span>
            </div>

            {pricing.selectedFeatures.map((feat) => (
              <div key={feat.featureId} className="flex justify-between items-start text-muted-foreground gap-4">
                <span className="truncate max-w-[70%]">{feat.featureName}</span>
                <span className="text-foreground font-semibold shrink-0">{formatCurrency(feat.calculatedPrice)}</span>
              </div>
            ))}

            {rushDelivery && (
              <div className="flex justify-between items-center text-primary font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Priority Scheduling
                </span>
                <span>{formatCurrency(pricing.rushMarkup)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-muted-foreground">
              <span>GST ({priceConfig.gstPercentage}%)</span>
              <span className="text-foreground font-semibold">{formatCurrency(pricing.gstAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Meta stats like Timeline & Maintenance */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border text-[10px]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Timeline</span>
          </div>
          <p className="font-bold text-foreground">{totalDays} Days</p>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wrench className="w-3 h-3 text-primary" />
            <span>Maint. (Est)</span>
          </div>
          <p className="font-bold text-foreground">{formatCurrency(maintenanceCost)}/mo</p>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Compass className="w-3 h-3 text-primary" />
            <span>Complexity</span>
          </div>
          <p className="font-bold text-foreground">{complexityScore}</p>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={onFinalize}
          disabled={isLoading || currentStep < 6}
          className="w-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg h-10 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : currentStep < 6 ? (
            <span>Complete Steps to Submit</span>
          ) : (
            <span>Finalize Quotation Inquiry</span>
          )}
        </button>

        {/* Dynamic inquiry routing channels */}
        {currentStep >= 6 && (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border border-border hover:bg-muted text-foreground text-[11px] font-semibold rounded-lg h-9 transition-colors"
            >
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              WhatsApp
            </a>
            <a
              href={mailToUrl}
              className="flex items-center justify-center gap-1.5 border border-border hover:bg-muted text-foreground text-[11px] font-semibold rounded-lg h-9 transition-colors"
            >
              <Mail className="w-3 h-3 text-blue-500" />
              Email Inquiry
            </a>
          </div>
        )}

        <p className="text-[9px] text-muted-foreground text-center flex items-center justify-center gap-1 pt-0.5">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          Securely locked proposal terms. No obligations.
        </p>
      </div>
    </div>
  );
}
