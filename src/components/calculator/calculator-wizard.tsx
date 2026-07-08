'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import BusinessDetailsStep from './steps/business-details-step';
import IndustryStep from './steps/industry-step';
import WebsiteTypeStep from './steps/website-type-step';
import PackageStep from './steps/package-step';
import PagesStep from './steps/pages-step';
import FeaturesStep from './steps/features-step';
import DeliveryStep from './steps/delivery-step';
import SummaryStep from './steps/summary-step';
import type { Package, Feature, FeatureCategory, PriceConfig, Industry } from '@/types';
import { Card } from '@/components/ui/card';

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
  const { currentStep } = useCalculatorStore();

  const stepLabels = [
    'Business',
    'Industry',
    'Type',
    'Tier',
    'Pages',
    'Features',
    'Delivery',
    'Finalize',
  ];

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
        return <PagesStep />;
      case 6:
        return <FeaturesStep categories={categories} features={features} />;
      case 7:
        return <DeliveryStep />;
      case 8:
        return (
          <SummaryStep
            packages={packages}
            features={features}
            industries={industries}
            priceConfig={priceConfig}
          />
        );
      default:
        return <BusinessDetailsStep />;
    }
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Stepper Progress Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-indigo-400">Step {currentStep} of 8</span>
          <span className="font-medium text-slate-400">{stepLabels[currentStep - 1]}</span>
        </div>

        {/* Dynamic Stepper Progress */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* Stepper Steps Indicators */}
        <div className="hidden sm:grid grid-cols-8 gap-2 pt-1.5 text-[10px] font-semibold text-center uppercase tracking-wider select-none">
          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div
                key={idx}
                className={`transition-colors duration-300 ${
                  isCompleted
                    ? 'text-indigo-400'
                    : isActive
                    ? 'text-white font-bold'
                    : 'text-slate-700'
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
  );
}
