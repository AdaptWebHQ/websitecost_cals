'use client';

import React, { useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import type { Feature, FeatureCategory, Package } from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface FeaturesStepProps {
  categories: FeatureCategory[];
  features: Feature[];
  packages: Package[];
}

export default function FeaturesStep({ categories, features, packages }: FeaturesStepProps) {
  const {
    selectedFeatureIds,
    customFeatures,
    pages,
    packageId,
    updateFields,
    addCustomFeature,
    removeCustomFeature,
    nextStep,
    prevStep,
  } = useCalculatorStore();

  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[0];

  const handleToggle = (id: string, checked: boolean) => {
    if (id === 'feat-extra-page') {
      if (checked) {
        updateFields({
          selectedFeatureIds: [...selectedFeatureIds, id],
          pages: selectedPackage.pagesIncluded + 1,
        });
      } else {
        updateFields({
          selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== id),
          pages: selectedPackage.pagesIncluded,
        });
      }
    } else {
      if (checked) {
        updateFields({ selectedFeatureIds: [...selectedFeatureIds, id] });
      } else {
        updateFields({ selectedFeatureIds: selectedFeatureIds.filter((fid) => fid !== id) });
      }
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomFeature({
      name: customName.trim(),
      price: parseFloat(customPrice) || 0,
    });
    setCustomName('');
    setCustomPrice('');
  };

  const handleSkip = () => {
    // Clear both standard selected features and custom features, reset pages count, and proceed
    updateFields({
      selectedFeatureIds: [],
      customFeatures: [],
      pages: selectedPackage.pagesIncluded,
    });
    nextStep();
  };

  const showPageCustomizer = selectedFeatureIds.includes('feat-extra-page');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Select Features</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose additional custom components, integrations, and tools.
        </p>
      </div>

      {/* Page Count Customizer (Only visible when 'Extra Page' feature is selected) */}
      {showPageCustomizer && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Website Size (Pages)</h3>
              <p className="text-xs text-slate-500">
                {selectedPackage.name} includes <span className="font-semibold text-slate-350">{selectedPackage.pagesIncluded} pages</span>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateFields({ pages: Math.max(1, pages - 1) })}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold transition-colors select-none"
              >
                -
              </button>
              <span className="text-sm font-bold text-white min-w-10 text-center">{pages} Pages</span>
              <button
                type="button"
                onClick={() => updateFields({ pages: Math.min(200, pages + 1) })}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold transition-colors select-none"
              >
                +
              </button>
            </div>
          </div>

          {pages > selectedPackage.pagesIncluded && (
            <div className="text-xs text-indigo-400 bg-indigo-950/15 border border-indigo-950/30 p-2.5 rounded-lg flex justify-between items-center">
              <span>
                {pages - selectedPackage.pagesIncluded} Additional Pages (at {formatCurrency(1500)}/page)
              </span>
              <span className="font-semibold">
                + {formatCurrency((pages - selectedPackage.pagesIncluded) * 1500)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
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

      {/* Custom Features Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Add Custom Features</h3>
          <p className="text-xs text-slate-400 mt-1">
            Need something custom or unique? Add it here with a proposed price.
          </p>
        </div>

        {/* List of added custom features */}
        {customFeatures.length > 0 && (
          <div className="space-y-2">
            {customFeatures.map((cf) => (
              <div
                key={cf.id}
                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-950/10 text-slate-300"
              >
                <span className="text-xs font-semibold text-indigo-300 truncate max-w-[250px]">
                  {cf.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-200">
                    {cf.price > 0 ? formatCurrency(cf.price) : 'Free/Included'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomFeature(cf.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Feature Name (e.g., Salesforce Sync)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 bg-slate-900/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl h-10 px-3.5 text-xs outline-none transition-all placeholder:text-slate-650"
          />
          <input
            type="number"
            placeholder="Est. Price (INR)"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="w-full sm:w-36 bg-slate-900/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl h-10 px-3.5 text-xs outline-none transition-all placeholder:text-slate-650"
          />
          <Button
            type="button"
            onClick={handleAddCustom}
            className="bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/20 rounded-xl h-10 text-xs px-4 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-900 gap-4">
        <Button
          onClick={prevStep}
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-xl h-11 px-6 font-medium"
          >
            Skip Features
          </Button>
          <Button
            onClick={nextStep}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
