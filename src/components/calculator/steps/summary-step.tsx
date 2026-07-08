'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { createCalculationAction } from '@/actions/calculations';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Package, Feature, PriceConfig, Industry, Calculation } from '@/types';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface SummaryStepProps {
  packages: Package[];
  features: Feature[];
  industries: Industry[];
  priceConfig: PriceConfig;
}

export default function SummaryStep({
  packages,
  features,
  industries,
  priceConfig,
}: SummaryStepProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calcResult, setCalcResult] = useState<Calculation | null>(null); // For successful finish screen

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
    prevStep,
    reset,
  } = useCalculatorStore();

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedIndustry = industries.find((i) => i.id === industryId);
  const selectedFeatures = features.filter((f) => selectedFeatureIds.includes(f.id));

  if (!selectedPackage || !selectedIndustry) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
        Error: Package or industry selection is missing. Please go back.
        <Button onClick={prevStep} className="mt-4 block bg-slate-900 border border-slate-800">
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate pricing client-side for review
  const pricing = calculateQuotation(
    selectedPackage,
    selectedFeatures,
    pages,
    rushDelivery,
    priceConfig
  );

  const handleFinalize = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await createCalculationAction({
        businessName,
        businessEmail,
        businessPhone,
        industryId,
        websiteType,
        packageId,
        pages,
        selectedFeatureIds,
        rushDelivery,
      });

      if (response.success && response.data) {
        setCalcResult(response.data);
      } else {
        setErrorMessage(response.error || 'Failed to register quotation.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An unexpected error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  if (calcResult) {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto py-8">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Quotation Generated!</h2>
          <p className="text-sm text-slate-400">
            Your quotation has been securely calculated, signed, and saved in database records.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-500/10 bg-indigo-950/5 p-5 text-left border-dashed">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Reference ID</span>
            <span>{calcResult.id}</span>
          </div>
          <div className="flex justify-between items-center text-white font-bold text-lg mt-3 pt-3 border-t border-slate-900">
            <span>Total Cost</span>
            <span className="text-indigo-400">{formatCurrency(calcResult.total)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button
            onClick={() => {
              reset();
              router.push('/dashboard/public/estimates');
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 w-full gap-2 font-semibold"
          >
            Go to My Estimates
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              reset();
              router.push('/dashboard/public/calculator');
            }}
            variant="outline"
            className="border-slate-800 text-slate-300 rounded-xl h-11 w-full hover:bg-slate-900/30"
          >
            Calculate Another Cost
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white">Quotation Summary</h2>
        <p className="text-sm text-slate-400 mt-1">
          Review your selection and final estimate details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Selection Details */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/10 p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 mb-2">
            Selected Options
          </h3>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Business Details</span>
              <span className="text-slate-300 font-medium text-right max-w-[200px] truncate">
                {businessName} ({businessPhone})
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Industry Segment</span>
              <span className="text-slate-300 font-medium">{selectedIndustry.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Website Architectural Type</span>
              <span className="text-slate-300 font-medium capitalize">{websiteType}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Quotation Baseline Tier</span>
              <span className="text-slate-300 font-medium">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">Unique Pages</span>
              <span className="text-slate-300 font-medium">{pages} Pages</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery urgence</span>
              <span className="text-slate-300 font-medium">
                {rushDelivery ? 'Rush (Priority)' : 'Standard Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Calculations */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/10 p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 mb-2">
            Cost Computations
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Package Base Price</span>
              <span>{formatCurrency(pricing.basePrice)}</span>
            </div>
            {pricing.featuresPrice > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Features & Integrations ({selectedFeatures.length})</span>
                <span>{formatCurrency(pricing.featuresPrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300 border-t border-slate-900 pt-2 font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            {pricing.rushMarkup > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Rush Markup ({priceConfig.rushDeliveryPercentage}%)</span>
                <span>{formatCurrency(pricing.rushMarkup)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>GST ({priceConfig.gstPercentage}%)</span>
              <span>{formatCurrency(pricing.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-slate-800">
              <span>Estimated Quote</span>
              <span className="text-indigo-400">{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-900">
        <Button
          onClick={prevStep}
          disabled={isLoading}
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleFinalize}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Recalculating and Saving...
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
