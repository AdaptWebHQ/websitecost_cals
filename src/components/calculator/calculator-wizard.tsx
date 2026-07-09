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
import LiveSummary from './live-summary';
import type { Package, Feature, FeatureCategory, PriceConfig, Industry, Calculation } from '@/types';
import { Card } from '@/components/ui/card';
import { createCalculationAction } from '@/actions/calculations';

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
  } = useCalculatorStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calcResult, setCalcResult] = useState<Calculation | null>(null);

  const stepLabels = [
    'Business',
    'Industry',
    'Type',
    'Tier',
    'Features',
    'Delivery',
    'Finalize',
  ];

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
      {/* Centered soft ambient background glow */}
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[130px] pointer-events-none -z-20" />

      {/* Left Column: Wizard steps */}
      <div className="lg:col-span-2">
        <Card className="glass-bento ambient-glow-purple border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
          {/* Background subtle purple glow */}
          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Stepper Progress Bar */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">Step {currentStep} of 7</span>
              <span className="font-bold text-foreground">{stepLabels[currentStep - 1]}</span>
            </div>

            {/* Dynamic Stepper Progress */}
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>

            {/* Stepper Steps Indicators */}
            <div className="hidden sm:grid grid-cols-7 gap-2 pt-1.5 text-[10px] font-bold text-center uppercase tracking-wider select-none">
              {stepLabels.map((lbl, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;

                return (
                  <div
                    key={idx}
                    className={`transition-colors duration-300 ${
                      isCompleted
                        ? 'text-primary'
                        : isActive
                        ? 'text-foreground font-extrabold border-b-2 border-primary pb-0.5'
                        : 'text-muted-foreground/60'
                    }`}
                  >
                    {lbl}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Render Current Step Form */}
          <div className="pt-2">{renderStepContent()}</div>
        </Card>
      </div>

      {/* Right Column: Live quotation summary */}
      <div className="lg:col-span-1">
        <LiveSummary
          packages={packages}
          features={features}
          priceConfig={priceConfig}
          onFinalize={handleFinalize}
          isLoading={isLoading}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}
