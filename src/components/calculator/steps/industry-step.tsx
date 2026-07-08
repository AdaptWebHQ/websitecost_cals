'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import type { Industry } from '@/types';
import { Building2, ArrowLeft } from 'lucide-react';

interface IndustryStepProps {
  industries: Industry[];
}

export default function IndustryStep({ industries }: IndustryStepProps) {
  const { industryId, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (id: string) => {
    updateFields({ industryId: id });
  };

  const handleNext = () => {
    if (industryId) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Select Industry</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose the industry vertical matching your business sector.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {industries.map((ind) => {
          const isSelected = industryId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => handleSelect(ind.id)}
              className={`p-5 rounded-2xl text-left border flex items-center gap-4 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isSelected 
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-semibold">{ind.name}</span>
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
          disabled={!industryId}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium disabled:opacity-50"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
