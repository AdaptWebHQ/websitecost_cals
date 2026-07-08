'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { WEBSITE_TYPES } from '@/constants';
import { Globe, ArrowLeft } from 'lucide-react';

export default function WebsiteTypeStep() {
  const { websiteType, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (val: string) => {
    updateFields({ websiteType: val });
  };

  const handleNext = () => {
    if (websiteType) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Select Website Type</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose the architectural type matching your web app needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WEBSITE_TYPES.map((type) => {
          const isSelected = websiteType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={`p-5 rounded-2xl text-left border flex items-start gap-4 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                isSelected 
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{type.label}</span>
                <span className="text-xs text-slate-500 mt-1 leading-normal font-normal">
                  {type.description}
                </span>
              </div>
            </button>
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
          disabled={!websiteType}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium disabled:opacity-50"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
