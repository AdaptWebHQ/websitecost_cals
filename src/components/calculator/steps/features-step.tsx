'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import type { Feature, FeatureCategory } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface FeaturesStepProps {
  categories: FeatureCategory[];
  features: Feature[];
}

export default function FeaturesStep({ categories, features }: FeaturesStepProps) {
  const { selectedFeatureIds, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      updateFields({ selectedFeatureIds: [...selectedFeatureIds, id] });
    } else {
      updateFields({ selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== id) });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Select Features</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose additional custom components, integrations, and tools.
        </p>
      </div>

      <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
        {categories.map((cat) => {
          // Filter features belonging to this category
          const catFeatures = features.filter((f) => f.categoryId === cat.id);
          if (catFeatures.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catFeatures.map((feat) => {
                  const isChecked = selectedFeatureIds.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleToggle(feat.id, !isChecked)}
                      className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all select-none ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-950/15 text-white'
                          : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Checkbox
                        id={feat.id}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleToggle(feat.id, !!checked)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={feat.id}
                          className="font-semibold text-sm cursor-pointer block truncate text-slate-200"
                        >
                          {feat.name}
                        </Label>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                          {feat.description}
                        </p>
                        <span className="text-[10px] text-indigo-400 font-semibold block mt-1.5">
                          {feat.pricingType === 'per_page' 
                            ? `+ ${formatCurrency(feat.price)}/page` 
                            : feat.pricingType === 'percentage' 
                            ? `+ ${feat.price}% of base` 
                            : `+ ${formatCurrency(feat.price)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-900">
        <Button
          onClick={prevStep}
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
