'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import type { Package } from '@/types';
import { ArrowLeft, Check } from 'lucide-react';

interface PackageStepProps {
  packages: Package[];
}

export default function PackageStep({ packages }: PackageStepProps) {
  const { packageId, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (id: string, pages: number) => {
    updateFields({ packageId: id, pages }); // Pre-fill default pages based on packages pagesIncluded
  };

  const handleNext = () => {
    if (packageId) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Select Quotation Package</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose a baseline pricing structure to configure your quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isSelected = packageId === pkg.id;
          const isFeatured = pkg.isPopular;

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg.id, pkg.pagesIncluded)}
              className={`p-6 rounded-3xl border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
              }`}
            >
              {isFeatured && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg">
                  Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white">{pkg.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">{pkg.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-sm font-semibold">₹</span>
                  <span className="text-2xl font-extrabold tracking-tight">{pkg.basePrice.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-medium">/ base</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-400 pt-4 border-t border-slate-900">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Includes up to {pkg.pagesIncluded} pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{pkg.deliveryDays} Days average delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{pkg.revisions} Design revisions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <div className={`w-full rounded-xl py-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {isSelected ? 'Package Selected' : 'Choose Package'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          onClick={prevStep}
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!packageId}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium disabled:opacity-50"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
