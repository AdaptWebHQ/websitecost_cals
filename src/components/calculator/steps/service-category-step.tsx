'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import type { ServiceCategory } from '@/types';
import { 
  ArrowLeft, 
  ArrowRight,
  Globe, 
  Smartphone, 
  Cpu, 
  Sparkles, 
  Cloud, 
  Palette, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface ServiceCategoryStepProps {
  categories: ServiceCategory[];
}

export default function ServiceCategoryStep({ categories }: ServiceCategoryStepProps) {
  const { serviceCategoryId, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (id: string) => {
    updateFields({ serviceCategoryId: id });
  };

  const handleNext = () => {
    if (serviceCategoryId) {
      nextStep();
    }
  };

  const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('website')) return <Globe className="w-6 h-6 text-primary" />;
    if (s.includes('mobile') || s.includes('app')) return <Smartphone className="w-6 h-6 text-primary" />;
    if (s.includes('ai') || s.includes('automation')) return <Sparkles className="w-6 h-6 text-primary" />;
    if (s.includes('ui') || s.includes('ux') || s.includes('design')) return <Palette className="w-6 h-6 text-primary" />;
    if (s.includes('saas')) return <Cloud className="w-6 h-6 text-primary" />;
    if (s.includes('software') || s.includes('custom')) return <Cpu className="w-6 h-6 text-primary" />;
    return <Layers className="w-6 h-6 text-primary" />;
  };

  const selectedCategory = categories.find(c => c.id === serviceCategoryId);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Select Project Service</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Choose the service category that matches your project requirements to calculate your customized pricing estimation.
        </p>
      </div>

      {/* Grid of Luminous Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {categories.map((cat) => {
          const isSelected = serviceCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
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
                {getCategoryIcon(cat.slug)}
              </div>

              <h3 className="font-bold text-xs text-foreground mb-1">{cat.name}</h3>
              <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                {cat.description || `Estimate design, infrastructure, and delivery modules for your ${cat.name} project.`}
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
          {selectedCategory && (
            <p className="text-xs text-muted-foreground font-semibold">
              Selected: <span className="text-primary font-bold">{selectedCategory.name}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!serviceCategoryId}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
