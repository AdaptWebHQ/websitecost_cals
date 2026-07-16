'use client';

import React, { useState } from 'react';
import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { AddonFeature, AddonCategory, Package } from '@/types';
import { 
  ArrowLeft, 
  ArrowRight,
  Plus, 
  Trash2, 
  Check, 
  Mail, 
  TrendingUp, 
  FileText, 
  BarChart2, 
  Calendar, 
  CreditCard,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface FeaturesStepProps {
  categories: AddonCategory[];
  features: AddonFeature[];
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
  const extraPageFeature = features.find((f) => f.id === 'feat-extra-page');
  const extraPagePrice = extraPageFeature ? extraPageFeature.price : 2000;

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
    updateFields({
      selectedFeatureIds: [],
      customFeatures: [],
      pages: selectedPackage.pagesIncluded,
    });
    nextStep();
  };

  const getFeatureIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('contact') || s.includes('mail')) return <Mail className="w-5 h-5" />;
    if (s.includes('seo') || s.includes('search') || s.includes('optimization')) return <TrendingUp className="w-5 h-5" />;
    if (s.includes('cms') || s.includes('content') || s.includes('blog')) return <FileText className="w-5 h-5" />;
    if (s.includes('analytics') || s.includes('track') || s.includes('stat')) return <BarChart2 className="w-5 h-5" />;
    if (s.includes('booking') || s.includes('calendar') || s.includes('schedul')) return <Calendar className="w-5 h-5" />;
    if (s.includes('payment') || s.includes('checkout') || s.includes('store')) return <CreditCard className="w-5 h-5" />;
    return <HelpCircle className="w-5 h-5" />;
  };

  const showPageCustomizer = selectedFeatureIds.includes('feat-extra-page');

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div>
        <h2 className="text-sm font-bold text-foreground">Select Features</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Define the functional core of your digital ecosystem. Choose from our curated high-performance modules or add your own custom specifications.
        </p>
      </div>

      {/* Page Count Customizer (Only visible when 'Extra Page' feature is selected) */}
      {showPageCustomizer && (
        <div className="rounded-lg border border-border bg-card/65 p-4 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-foreground">Website Size (Pages)</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {selectedPackage.name} includes <span className="font-bold text-primary">{selectedPackage.pagesIncluded} pages</span>.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-0.5 w-fit shadow-sm">
              <button
                type="button"
                onClick={() => updateFields({ pages: Math.max(1, pages - 1) })}
                className="w-8 h-8 rounded hover:bg-muted text-foreground flex items-center justify-center font-bold transition-colors select-none active:scale-95 cursor-pointer text-sm"
              >
                -
              </button>
              <span className="text-xs font-bold text-foreground min-w-10 text-center">{pages} Pages</span>
              <button
                type="button"
                onClick={() => updateFields({ pages: Math.min(200, pages + 1) })}
                className="w-8 h-8 rounded hover:bg-muted text-foreground flex items-center justify-center font-bold transition-colors select-none active:scale-95 cursor-pointer text-sm"
              >
                +
              </button>
            </div>
          </div>

          {pages > selectedPackage.pagesIncluded && (
            <div className="text-[10px] text-primary bg-primary/5 border border-primary/10 p-2 rounded-lg flex justify-between items-center font-semibold">
              <span>
                {pages - selectedPackage.pagesIncluded} Additional Pages (at {formatCurrency(extraPagePrice)}/page)
              </span>
              <span className="font-bold">
                + {formatCurrency((pages - selectedPackage.pagesIncluded) * extraPagePrice)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Features Categories */}
      <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
        {categories.map((cat) => {
          const catFeatures = features.filter((f) => f.categoryId === cat.id);
          if (catFeatures.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {catFeatures.map((feat) => {
                  const isChecked = selectedFeatureIds.includes(feat.id);
                  return (
                    <button
                      type="button"
                      key={feat.id}
                      onClick={() => handleToggle(feat.id, !isChecked)}
                      className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors select-none group relative ${
                        isChecked
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card/65 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full mb-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          {getFeatureIcon(feat.slug || feat.name)}
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-primary border-primary' : 'border-border bg-card'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-[11px] text-foreground mb-0.5">{feat.name}</h4>
                        <p className="text-[9px] text-muted-foreground mb-2 leading-normal font-normal">
                          {feat.description}
                        </p>
                        <span className="text-[9px] text-primary font-bold">
                          {feat.pricingType === 'per_page' 
                            ? `+ ${formatCurrency(feat.price)}/page` 
                            : feat.pricingType === 'percentage' 
                            ? `+ ${feat.price}% of base` 
                            : `+ ${formatCurrency(feat.price)}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Features Section */}
      <div className="p-4 rounded-lg border border-border bg-card/65 space-y-4">
        <div className="flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs text-foreground">Add Custom Features</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Feature Name</label>
            <input
              type="text"
              placeholder="e.g. Salesforce CRM Sync"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Est. Price (INR)</label>
            <input
              type="number"
              placeholder="5000"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleAddCustom}
              className="w-full h-9 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-primary/95 transition-colors cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Dynamic List for added custom features */}
        {customFeatures.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {customFeatures.map((cf) => (
              <li
                key={cf.id}
                className="flex justify-between items-center bg-card/80 p-2 rounded-lg border border-dashed border-primary/20"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[11px] font-bold text-foreground">{cf.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-primary">+{formatCurrency(cf.price)}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomFeature(cf.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors outline-none cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Controls Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto px-4 py-2 border border-border hover:bg-muted text-muted-foreground font-semibold rounded-lg transition-colors cursor-pointer text-xs"
          >
            Skip Features
          </button>
          <button
            onClick={nextStep}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/95 transition-colors cursor-pointer text-xs"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
