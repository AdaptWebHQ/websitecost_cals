'use client';

import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Package, Feature, PriceConfig, Industry, Calculation } from '@/types';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import PdfDownloadButton from '../pdf-download-button';

interface SummaryStepProps {
  packages: Package[];
  features: Feature[];
  industries: Industry[];
  priceConfig: PriceConfig;
  isLoading: boolean;
  errorMessage: string | null;
  calcResult: Calculation | null;
  onFinalize: () => void;
}

export default function SummaryStep({
  packages,
  features,
  industries,
  priceConfig,
  isLoading,
  errorMessage,
  calcResult,
  onFinalize,
}: SummaryStepProps) {
  const router = useRouter();

  const {
    businessName,
    businessEmail,
    businessPhone,
    industryId,
    websiteType,
    packageId,
    pages,
    selectedFeatureIds,
    rushDelivery,
    customFeatures,
    prevStep,
    reset,
  } = useCalculatorStore();

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[0];
  const selectedIndustry = industries.find((i) => i.id === industryId) || industries[0];
  const selectedFeatures = features.filter((f) => selectedFeatureIds.includes(f.id));

  // Calculate pricing client-side for review
  const pricing = calculateQuotation(
    selectedPackage,
    selectedFeatures,
    pages,
    rushDelivery,
    priceConfig,
    customFeatures
  );

  if (calcResult) {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto py-8">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quotation Generated!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your quotation has been securely calculated, signed, and saved in database records.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted p-5 text-left border-dashed">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs">
            <span>Reference ID</span>
            <span className="font-mono">{calcResult.id}</span>
          </div>
          <div className="flex justify-between items-center text-slate-900 dark:text-white font-bold text-lg mt-3 pt-3 border-t border-border">
            <span>Total Cost</span>
            <span className="text-primary">{formatCurrency(calcResult.total)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button
            onClick={() => {
              reset();
              router.push('/public/estimates');
            }}
            className="bg-primary hover:bg-primary/95 text-white rounded-xl h-11 w-full gap-2 font-semibold"
          >
            Go to My Estimates
            <ChevronRight className="w-4 h-4" />
          </Button>
          <PdfDownloadButton calculationId={calcResult.id} businessName={calcResult.businessName} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quotation Summary</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your selection and final estimate details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Selection Details */}
        <div className="space-y-4 rounded-2xl border border-border bg-secondary/50 p-5">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Selected Options
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-slate-500">Business Name</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium text-right max-w-[200px] truncate">
                {businessName}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-slate-500">Industry Segment</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">{selectedIndustry.name}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-slate-500">Website Architectural Type</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium capitalize">{websiteType}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-slate-500">Quotation Baseline Tier</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-slate-500">Unique Pages</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">{pages} Pages</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Urgence</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">
                {rushDelivery ? 'Rush (Priority)' : 'Standard Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Calculations */}
        <div className="space-y-4 rounded-2xl border border-border bg-secondary/50 p-5">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Cost Computations
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Package Base Price</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">{formatCurrency(pricing.basePrice)}</span>
            </div>
            {pricing.featuresPrice > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Features & Integrations ({selectedFeatures.length + customFeatures.length})</span>
                <span className="text-slate-900 dark:text-slate-300 font-medium">{formatCurrency(pricing.featuresPrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 dark:text-white border-t border-border pt-2 font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            {pricing.rushMarkup > 0 && (
              <div className="flex justify-between text-amber-600 dark:text-amber-500">
                <span>Rush Markup ({priceConfig.rushDeliveryPercentage}%)</span>
                <span>{formatCurrency(pricing.rushMarkup)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>GST ({priceConfig.gstPercentage}%)</span>
              <span className="text-slate-900 dark:text-slate-300 font-medium">{formatCurrency(pricing.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white font-bold text-lg pt-3 border-t border-border">
              <span>Estimated Quote</span>
              <span className="text-primary">{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          onClick={prevStep}
          disabled={isLoading}
          variant="ghost"
          className="text-slate-500 hover:text-slate-900 dark:hover:text-white gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onFinalize}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/95 text-white rounded-xl h-11 px-8 font-medium gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Finalize & Generate Quotation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
