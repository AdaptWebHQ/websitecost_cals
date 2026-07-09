'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { formatCurrency } from '@/lib/utils';
import type { Package, Feature, PriceConfig } from '@/types';
import { ShieldCheck, Calendar, Wrench, Sparkles, AlertCircle } from 'lucide-react';

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
  } = useCalculatorStore();

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[0];
  const selectedFeatures = features.filter((f) => selectedFeatureIds.includes(f.id));

  if (!selectedPackage) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-center items-center text-center">
        <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Select a package to view live estimate.</p>
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

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm sticky top-6 transition-all duration-300 hover:border-primary/20">
      {/* Stripe-style product header */}
      <div className="space-y-1 pb-4 border-b border-border">
        <span className="text-xs font-bold text-primary tracking-widest uppercase font-mono">Agency Proposal</span>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          {formatCurrency(pricing.total)}
        </h2>
        <p className="text-xs text-muted-foreground">
          Estimated Project Total (incl. GST)
        </p>
      </div>

      {/* Breakdown details */}
      <div className="space-y-4 py-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Quotation Breakdown</span>
        <div className="space-y-3.5 text-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Base Package ({selectedPackage.name})</span>
            <span className="text-foreground font-semibold">{formatCurrency(pricing.basePrice)}</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Total Configured Pages</span>
            <span className="text-foreground font-semibold">{pages} Pages</span>
          </div>

          {(selectedFeatures.length > 0 || customFeatures.length > 0) && (
            <div className="flex justify-between items-start text-muted-foreground">
              <span>Features & Custom Modules ({selectedFeatures.length + customFeatures.length})</span>
              <span className="text-foreground font-semibold text-right">
                {formatCurrency(pricing.featuresPrice)}
              </span>
            </div>
          )}

          {rushDelivery && (
            <div className="flex justify-between items-center text-amber-600 dark:text-amber-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Rush Priority Delivery
              </span>
              <span className="font-bold">{formatCurrency(pricing.rushMarkup)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-muted-foreground">
            <span>GST ({priceConfig.gstPercentage}%)</span>
            <span className="text-foreground font-semibold">{formatCurrency(pricing.gstAmount)}</span>
          </div>
        </div>
      </div>

      {/* Meta stats like Timeline & Maintenance */}
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Timeline</span>
          </div>
          <p className="font-bold text-foreground">{totalDays} Business Days</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wrench className="w-3.5 h-3.5 text-primary" />
            <span>Maint. (Est.)</span>
          </div>
          <p className="font-bold text-foreground">{formatCurrency(maintenanceCost)}/mo</p>
        </div>
      </div>

      {/* Action CTA Button resembling Stripe checkout */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onFinalize}
          disabled={isLoading || currentStep < 6}
          className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : currentStep < 6 ? (
            <span>Complete Steps to Submit</span>
          ) : (
            <span>Submit Quotation Inquiry</span>
          )}
        </button>

        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          No credit card required. Agency representatives will follow up.
        </p>
      </div>
    </div>
  );
}
