'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';
import BusinessDetailsStep from './steps/business-details-step';
import IndustryStep from './steps/industry-step';
import WebsiteTypeStep from './steps/website-type-step';
import PackageStep from './steps/package-step';
import FeaturesStep from './steps/features-step';
import DeliveryStep from './steps/delivery-step';
import SummaryStep from './steps/summary-step';
import type { Package, Feature, FeatureCategory, PriceConfig, Industry, Calculation } from '@/types';
import { createCalculationAction } from '@/actions/calculations';
import { ShieldCheck, BarChart2, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CalculatorWizardProps {
  packages: Package[];
  features: Feature[];
  categories: FeatureCategory[];
  industries: Industry[];
  priceConfig: PriceConfig;
}

export default function CalculatorWizard({
  packages,
  features,
  categories,
  industries,
  priceConfig,
}: CalculatorWizardProps) {
  const {
    currentStep,
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
    setStep,
    nextStep,
  } = useCalculatorStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calcResult, setCalcResult] = useState<Calculation | null>(null);

  const handleFinalize = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await createCalculationAction({
        businessName,
        businessEmail,
        businessPhone,
        industryId,
        websiteType,
        packageId: packageId || packages[0]?.id || '',
        pages,
        selectedFeatureIds,
        rushDelivery,
        customFeatures,
      });

      if (response.success && response.data) {
        setCalcResult(response.data);
        setStep(7);
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

  // Helper to compute selected features sum + base package sum
  const getEstTotalSum = () => {
    const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];
    const basePrice = selectedPkg?.basePrice || 0;
    
    // Pages cost
    const pagesIncluded = selectedPkg?.pagesIncluded || 0;
    const additionalPages = Math.max(0, pages - pagesIncluded);
    const pagesCost = additionalPages * 1500;

    // Standard features cost
    let featuresCost = 0;
    selectedFeatureIds.forEach((fid) => {
      if (fid === 'feat-extra-page') return; // Handled by pages count logic
      const featObj = features.find((f) => f.id === fid);
      if (featObj) {
        if (featObj.pricingType === 'per_page') {
          featuresCost += featObj.price * pages;
        } else if (featObj.pricingType === 'percentage') {
          featuresCost += (featObj.price / 100) * basePrice;
        } else {
          featuresCost += featObj.price;
        }
      }
    });

    // Custom features cost
    let customCost = 0;
    customFeatures.forEach((cf) => {
      customCost += cf.price;
    });

    const subtotal = basePrice + pagesCost + featuresCost + customCost;
    
    // Rush markup
    if (rushDelivery) {
      return subtotal * 1.25;
    }
    return subtotal;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessDetailsStep />;
      case 2:
        return <IndustryStep industries={industries} />;
      case 3:
        return <WebsiteTypeStep />;
      case 4:
        return <PackageStep packages={packages} />;
      case 5:
        return <FeaturesStep categories={categories} features={features} packages={packages} />;
      case 6:
        return <DeliveryStep />;
      case 7:
        return (
          <SummaryStep
            packages={packages}
            features={features}
            industries={industries}
            priceConfig={priceConfig}
            isLoading={isLoading}
            errorMessage={errorMessage}
            calcResult={calcResult}
            onFinalize={handleFinalize}
          />
        );
      default:
        return <BusinessDetailsStep />;
    }
  };

  // Step 1: Two Column Layout with left project summary sidebar
  if (currentStep === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative max-w-7xl mx-auto w-full">
        {/* Left Section: Context Sidebar */}
        <div className="md:col-span-1 space-y-4 md:sticky md:top-24">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Project Discovery</span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">Investment<br />Estimator</h1>
          </div>

          {/* Sidebar Step Indicators */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold bg-primary text-white">1</div>
              <span className="text-xs font-bold text-foreground">Business Details</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-55">
              <div className="w-6 h-6 rounded border border-border flex items-center justify-center text-[10px] font-bold">2</div>
              <span className="text-xs font-medium text-foreground">Website Goals</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-55">
              <div className="w-6 h-6 rounded border border-border flex items-center justify-center text-[10px] font-bold">3</div>
              <span className="text-xs font-medium text-foreground">Features & Flow</span>
            </div>
          </div>

          {/* Atmospheric Card */}
          <div className="p-4 bg-muted rounded-lg border border-border mt-4 space-y-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              "Accurate pricing starts with understanding who you are. These details ensure we tailor the roadmap to your specific industry standards."
            </p>
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Secure & Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Section: Form Canvas */}
        <div className="md:col-span-2">
          {renderStepContent()}
        </div>
      </div>
    );
  }

  // Step 5: Two Column Layout with right Cost Summary sidebar card
  if (currentStep === 5) {
    const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];
    const basePrice = selectedPkg?.basePrice || 0;
    
    // Calculate features cost
    let featuresSum = 0;
    const pagesIncluded = selectedPkg?.pagesIncluded || 0;
    const additionalPages = Math.max(0, pages - pagesIncluded);
    featuresSum += additionalPages * 1500;

    selectedFeatureIds.forEach((fid) => {
      if (fid === 'feat-extra-page') return;
      const featObj = features.find((f) => f.id === fid);
      if (featObj) {
        if (featObj.pricingType === 'per_page') {
          featuresSum += featObj.price * pages;
        } else if (featObj.pricingType === 'percentage') {
          featuresSum += (featObj.price / 100) * basePrice;
        } else {
          featuresSum += featObj.price;
        }
      }
    });

    // Custom features cost
    customFeatures.forEach((cf) => {
      featuresSum += cf.price;
    });

    const estTotal = getEstTotalSum();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto w-full relative">
        {/* Left side Features panel */}
        <div className="lg:col-span-8 space-y-4">
          {/* Stepper Progress bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-primary">Step 5 of 7</span>
              <span className="text-muted-foreground font-semibold">Features Selection</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '71.4%' }} />
            </div>
          </div>

          {renderStepContent()}
        </div>

        {/* Right side Summary sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Cost Summary</h3>
            
            <div className="space-y-2 pb-4 border-b border-border text-xs">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Base Development</span>
                <span className="text-foreground font-bold">{formatCurrency(basePrice)}</span>
              </div>
              {featuresSum > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Selected Features</span>
                  <span className="text-foreground font-bold">{formatCurrency(featuresSum)}</span>
                </div>
              )}
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Estimated Total</span>
                <span className="text-lg font-bold tracking-tight text-primary">{formatCurrency(estTotal)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-2.5 rounded-lg font-semibold bg-primary text-white hover:bg-primary/95 transition-colors text-xs cursor-pointer"
              >
                Final Review
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other Steps (2, 3, 4, 6, 7): Centered single-column layout
  let progressPct = '0%';
  let stepLabel = '';
  switch (currentStep) {
    case 2:
      progressPct = '28.5%';
      stepLabel = 'Step 2 of 7: Industry';
      break;
    case 3:
      progressPct = '42.8%';
      stepLabel = 'Step 3 of 7: Website Type';
      break;
    case 4:
      progressPct = '57.1%';
      stepLabel = 'Step 4 of 7: Base Package';
      break;
    case 6:
      progressPct = '85.7%';
      stepLabel = 'Step 6 of 7: Delivery speed';
      break;
    case 7:
      progressPct = '100%';
      stepLabel = 'Step 7 of 7: Finalize';
      break;
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Centered progress header */}
      {currentStep !== 7 && (
        <div className="space-y-2 max-w-xl mx-auto text-center">
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">{stepLabel}</span>
          <div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: progressPct }} />
          </div>
        </div>
      )}

      <div className="w-full">
        {renderStepContent()}
      </div>

      {/* Package step inline pricing indicator */}
      {currentStep === 4 && packageId && (
        <div className="flex justify-between items-center max-w-xl mx-auto pt-4 border-t border-border">
          <div className="h-px bg-border flex-grow mr-4" />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
            EST. TOTAL: {formatCurrency(getEstTotalSum())}*
          </span>
        </div>
      )}
    </div>
  );
}
