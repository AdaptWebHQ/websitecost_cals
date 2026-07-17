'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';
import BusinessDetailsStep from './steps/business-details-step';
import IndustryStep from './steps/industry-step';
import PackageStep from './steps/package-step';
import FeaturesStep from './steps/features-step';
import DeliveryStep from './steps/delivery-step';
import SummaryStep from './steps/summary-step';
import type { Package, AddonFeature, AddonCategory, PriceConfig, Industry, Calculation } from '@/types';
import { createCalculationAction } from '@/actions/calculations';
import { ShieldCheck, BarChart2, DollarSign, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CalculatorWizardProps {
  packages: Package[];
  features: AddonFeature[];
  categories: AddonCategory[];
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
    updateFields,
    removeCustomFeature,
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
    const additionalPages = pagesIncluded === -1 ? 0 : Math.max(0, pages - pagesIncluded);
    const extraPageFeature = features.find((f) => f.id === 'feat-extra-page');
    const extraPagePrice = extraPageFeature ? extraPageFeature.price : 2000;
    const pagesCost = additionalPages * extraPagePrice;

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

  // Step flow: 1=Business, 2=Industry, 3=Package, 4=Features, 5=Delivery, 6=Summary
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessDetailsStep />;
      case 2:
        return <IndustryStep industries={industries} packages={packages} />;
      case 3:
        return <PackageStep packages={packages} />;
      case 4:
        return <FeaturesStep categories={categories} features={features} packages={packages} />;
      case 5:
        return <DeliveryStep />;
      case 6:
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

  // Step 1: Two Column Layout with left project summary sidebar (Contact Details)
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
              <span className="text-xs font-bold text-foreground">Your Details</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-55">
              <div className="w-6 h-6 rounded border border-border flex items-center justify-center text-[10px] font-bold">2</div>
              <span className="text-xs font-medium text-foreground">Industry & Package</span>
            </div>
            <div className="flex items-center gap-2.5 opacity-55">
              <div className="w-6 h-6 rounded border border-border flex items-center justify-center text-[10px] font-bold">3</div>
              <span className="text-xs font-medium text-foreground">Review & Quote</span>
            </div>
          </div>

          {/* Atmospheric Card */}
          <div className="p-4 bg-muted rounded-lg border border-border mt-4 space-y-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              &quot;We start by getting to know you. Your contact details help us personalize your quote and keep you updated throughout the process.&quot;
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

  // Step 4: Two Column Layout with right Cost Summary sidebar card (Features)
  if (currentStep === 4) {
    const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];
    const basePrice = selectedPkg?.basePrice || 0;
    const pagesIncluded = selectedPkg?.pagesIncluded || 0;
    const additionalPages = pagesIncluded === -1 ? 0 : Math.max(0, pages - pagesIncluded);
    const extraPageFeature = features.find((f) => f.id === 'feat-extra-page');
    const extraPagePrice = extraPageFeature ? extraPageFeature.price : 2000;

    // Build array of selected features with name & cost contribution
    const selectedFeaturesList: { id: string; name: string; cost: number; isCustom: boolean; isPages: boolean }[] = [];
    let featuresSum = 0;

    if (additionalPages > 0 && selectedFeatureIds.includes('feat-extra-page')) {
      const pageCost = additionalPages * extraPagePrice;
      selectedFeaturesList.push({
        id: 'feat-extra-page',
        name: `Extra Pages (${additionalPages} pages)`,
        cost: pageCost,
        isCustom: false,
        isPages: true,
      });
      featuresSum += pageCost;
    }

    selectedFeatureIds.forEach((fid) => {
      if (fid === 'feat-extra-page') return;
      const featObj = features.find((f) => f.id === fid);
      if (featObj) {
        let cost = 0;
        if (featObj.pricingType === 'per_page') {
          cost = featObj.price * pages;
        } else if (featObj.pricingType === 'percentage') {
          cost = (featObj.price / 100) * basePrice;
        } else {
          cost = featObj.price;
        }
        selectedFeaturesList.push({
          id: featObj.id,
          name: featObj.name,
          cost,
          isCustom: false,
          isPages: false,
        });
        featuresSum += cost;
      }
    });

    customFeatures.forEach((cf) => {
      selectedFeaturesList.push({
        id: cf.id,
        name: cf.name,
        cost: cf.price,
        isCustom: true,
        isPages: false,
      });
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
              <span className="font-bold text-primary">Step 4 of 6</span>
              <span className="text-muted-foreground font-semibold">Features Selection</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '66.6%' }} />
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
              
              {selectedFeaturesList.length > 0 && (
                <div className="pt-2 border-t border-border space-y-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Selected Modules</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedFeaturesList.map((feat) => (
                      <div key={feat.id} className="flex justify-between items-start text-[11px] gap-2 text-muted-foreground group/sidebar-feat">
                        <span className="truncate max-w-[70%]" title={feat.name}>{feat.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-foreground font-semibold">{formatCurrency(feat.cost)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (feat.isPages) {
                                updateFields({
                                  selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== feat.id),
                                  pages: pagesIncluded,
                                });
                              } else if (feat.isCustom) {
                                removeCustomFeature(feat.id);
                              } else {
                                updateFields({
                                  selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== feat.id),
                                });
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive p-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
                            title={`Remove ${feat.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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

  // Other Steps (2, 3, 5, 6): Centered single-column layout
  let progressPct = '0%';
  let stepLabel = '';
  switch (currentStep) {
    case 2:
      progressPct = '33.3%';
      stepLabel = 'Step 2 of 6: Industry';
      break;
    case 3:
      progressPct = '50%';
      stepLabel = 'Step 3 of 6: Base Package';
      break;
    case 5:
      progressPct = '83.3%';
      stepLabel = 'Step 5 of 6: Delivery Speed';
      break;
    case 6:
      progressPct = '100%';
      stepLabel = 'Step 6 of 6: Final Summary';
      break;
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Centered progress header */}
      <div className="space-y-2 max-w-xl mx-auto text-center">
        <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">{stepLabel}</span>
        <div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: progressPct }} />
        </div>
      </div>

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
