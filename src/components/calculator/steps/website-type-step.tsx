'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { WEBSITE_TYPES } from '@/constants';
import { 
  ArrowLeft, 
  ArrowRight,
  Layers, 
  ShoppingBag, 
  Briefcase, 
  Sparkles, 
  LayoutGrid, 
  CheckCircle2 
} from 'lucide-react';

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

  const getTypeIcon = (value: string) => {
    const v = value.toLowerCase();
    if (v.includes('saas') || v.includes('product') || v.includes('app') || v.includes('custom')) return <LayoutGrid className="w-6 h-6 text-primary" />;
    if (v.includes('commerce') || v.includes('shop')) return <ShoppingBag className="w-6 h-6 text-primary" />;
    if (v.includes('corp') || v.includes('business')) return <Briefcase className="w-6 h-6 text-primary" />;
    if (v.includes('land') || v.includes('single')) return <Sparkles className="w-6 h-6 text-primary" />;
    return <Layers className="w-6 h-6 text-primary" />;
  };

  const selectedType = WEBSITE_TYPES.find(t => t.value === websiteType);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Select Website Type</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Choose the architectural foundation that best aligns with your business goals and operational needs.
        </p>
      </div>

      {/* Grid of Luminous Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {WEBSITE_TYPES.map((type) => {
          const isSelected = websiteType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={`p-4 text-left flex flex-col items-start select-none group relative rounded-lg border transition-colors ${
                isSelected 
                  ? 'border-primary bg-card/90 shadow-sm' 
                  : 'border-border bg-card/65 hover:border-primary/50'
              }`}
            >
              {/* Absolute Top-Right Check */}
              <div className={`absolute top-3 right-3 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
              </div>

              {/* Large Icon Container */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                {getTypeIcon(type.value)}
              </div>

              <h3 className="font-bold text-xs text-foreground mb-1">{type.label}</h3>
              <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Controls Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {selectedType && (
            <p className="text-xs text-muted-foreground font-semibold">
              Selected: <span className="text-primary font-bold">{selectedType.label}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!websiteType}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Continue to Features
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
