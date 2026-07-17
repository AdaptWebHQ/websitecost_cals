'use client';

import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculator-store';
import { calculateQuotation } from '@/lib/calculations/pricing';
import { formatCurrency } from '@/lib/utils';
import type { Package, AddonFeature, PriceConfig, Industry, Calculation } from '@/types';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, Cpu, Trash2, Plus } from 'lucide-react';
import PdfDownloadButton from '../pdf-download-button';
import ContactInquiryForm from '@/components/forms/contact-inquiry-form';

interface SummaryStepProps {
  packages: Package[];
  features: AddonFeature[];
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
    packageId,
    pages,
    selectedFeatureIds,
    rushDelivery,
    customFeatures,
    prevStep,
    reset,
    updateFields,
    removeCustomFeature,
    setStep,
  } = useCalculatorStore();

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[0];
  const selectedIndustry = industries.find((i) => i.id === industryId) || industries[0];
  const selectedFeatures = features.filter((f) => selectedFeatureIds.includes(f.id));

  const handleRemoveFeature = (id: string) => {
    if (id === 'feat-extra-page') {
      updateFields({
        selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== id),
        pages: selectedPackage.pagesIncluded,
      });
    } else {
      updateFields({
        selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== id),
      });
    }
  };

  // Calculate pricing client-side for review
  const pricing = calculateQuotation(
    selectedPackage,
    selectedFeatures,
    pages,
    rushDelivery,
    priceConfig,
    customFeatures
  );

  const getTimelineWeeks = () => {
    let days = selectedPackage?.deliveryDays || 30;
    if (rushDelivery) days = Math.round(days * 0.6);
    return `${Math.ceil(days / 7)} Weeks`;
  };


  if (calcResult) {
    return (
      <div className="text-center space-y-5 max-w-md mx-auto py-6 animate-in fade-in duration-500">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Quotation Generated!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Your quotation has been securely calculated, signed, and saved in database records.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-card p-4 text-left shadow-sm">
          <div className="flex justify-between items-center text-muted-foreground text-xs font-mono">
            <span>Reference ID</span>
            <span className="font-bold text-foreground">{calcResult.id}</span>
          </div>
          <div className="flex justify-between items-center text-foreground font-bold text-base mt-3 pt-3 border-t border-border">
            <span>Total Cost</span>
            <span className="text-primary font-extrabold">{formatCurrency(calcResult.total)}</span>
          </div>
        </div>

        <div className="pt-3 flex flex-col gap-2.5">
          <PdfDownloadButton
            calculationId={calcResult.id}
            businessName={calcResult.businessName}
            onDownloaded={reset}
          />
          
          <button
            onClick={() => {
              reset();
              router.push('/public/estimates');
            }}
            className="bg-primary hover:bg-primary/95 text-white rounded-lg h-9 w-full flex items-center justify-center gap-1.5 font-semibold shadow-sm cursor-pointer text-xs"
          >
            Go to My Estimates
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Send Inquiry — linked to this calculation, submitted to admin CRM */}
        <div className="pt-2">
          <ContactInquiryForm
            calculationId={calcResult.id}
            defaultName={businessName}
            defaultEmail={businessEmail}
            defaultPhone={businessPhone}
          />
        </div>
      </div>
    );
  }

  const moduleCount = selectedFeatures.length + customFeatures.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-bold">
          {errorMessage}
        </div>
      )}

      {/* Header wrapper */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground">Final Summary & Generation</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
            Review your custom solution and generate your executive quotation.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-primary font-semibold text-[9px] uppercase tracking-wider shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your quotation has been securely calculated.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left column options */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Core Scope */}
            <div className="bg-card rounded-lg p-4 border border-border flex flex-col justify-between">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-3">Core Scope</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground font-medium">Industry</span>
                  <span className="text-foreground font-bold text-right">{selectedIndustry.name}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-muted-foreground font-medium">Package</span>
                  <span className="text-foreground font-bold">{selectedPackage.name}</span>
                </div>
              </div>
            </div>

            {/* Service Level */}
            <div className="bg-card rounded-lg p-4 border border-border flex flex-col justify-between">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-3">Service Level</span>
              <div>
                <h4 className="font-bold text-foreground text-xs">{selectedPackage.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{selectedPackage.description}</p>
              </div>
            </div>
          </div>

          {/* Module Selection */}
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Module Selection</span>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-lg transition-all cursor-pointer select-none active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                Add / Edit Features
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedFeatures.map((feat) => (
                <div key={feat.id} className="p-2 bg-muted/40 rounded-lg flex items-center justify-between border border-border group/feat gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground/80 truncate">{feat.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feat.id)}
                    className="text-muted-foreground hover:text-destructive p-0.5 rounded hover:bg-muted transition-colors shrink-0 cursor-pointer"
                    title={`Remove ${feat.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {customFeatures.map((cf) => (
                <div key={cf.id} className="p-2 bg-muted/40 rounded-lg flex items-center justify-between border border-border group/feat gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground/80 truncate">{cf.name} (Custom)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomFeature(cf.id)}
                    className="text-muted-foreground hover:text-destructive p-0.5 rounded hover:bg-muted transition-colors shrink-0 cursor-pointer"
                    title={`Remove ${cf.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedFeatures.length === 0 && customFeatures.length === 0 && (
                <p className="text-xs text-muted-foreground font-medium col-span-2">No additional feature modules selected.</p>
              )}
            </div>
          </div>

          {/* Innovation Banner */}
          <div className="p-4 bg-muted rounded-lg border border-border space-y-1.5">
            <h4 className="font-bold text-xs text-foreground">Innovation by Design.</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              AdaptWeb uses proprietary architectures to ensure your digital ecosystem grows with your ambitions.
            </p>
          </div>
        </div>

        {/* Right column investment sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm space-y-4">
            <h3 className="text-xs font-bold tracking-tight text-foreground">Investment Analysis</h3>

            <div className="space-y-2.5 pb-4 border-b border-border text-xs">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Base Infrastructure</span>
                <span className="text-foreground font-bold">{formatCurrency(pricing.basePrice)}</span>
              </div>
              {pricing.featuresPrice > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Module Subtotal ({moduleCount})</span>
                  <span className="text-foreground font-bold">{formatCurrency(pricing.featuresPrice)}</span>
                </div>
              )}
              {pricing.rushMarkup > 0 && (
                <div className="flex justify-between items-center text-primary font-bold">
                  <span className="flex items-center gap-1.5">
                    Expedited Delivery
                    <span className="text-[8px] bg-primary/10 border border-primary/20 px-1 py-0.5 rounded uppercase">RUSH</span>
                  </span>
                  <span>+ {formatCurrency(pricing.rushMarkup)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>GST ({priceConfig.gstPercentage}%)</span>
                <span className="text-foreground font-bold">{formatCurrency(pricing.gstAmount)}</span>
              </div>
            </div>

            {/* Total project estimate block */}
            <div className="p-3 bg-muted/40 rounded-lg flex items-center justify-between border border-border">
              <div className="space-y-0.5">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">TOTAL PROJECT ESTIMATE</span>
                <span className="text-base font-bold text-foreground">{formatCurrency(pricing.total)}</span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">ESTIMATED TIMELINE</span>
                <span className="text-xs font-bold text-primary">{getTimelineWeeks()}</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={onFinalize}
                disabled={isLoading}
                className="w-full h-9 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-colors shadow-sm disabled:opacity-50 cursor-pointer text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Finalize & Generate Quotation
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-muted-foreground leading-normal font-medium">
                Quote valid for 14 business days. Secure PDF will be generated instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-between items-center pt-4 border-t border-border max-w-7xl mx-auto">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous Step
        </button>
      </div>
    </div>
  );
}
