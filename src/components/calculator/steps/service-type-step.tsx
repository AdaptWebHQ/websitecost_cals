'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import type { ServiceType } from '@/types';
import { 
  ArrowLeft, 
  ArrowRight,
  Layers, 
  ShoppingBag, 
  Briefcase, 
  Sparkles, 
  LayoutGrid, 
  Smartphone,
  Cloud,
  Cpu,
  CheckCircle2 
} from 'lucide-react';

interface ServiceTypeStepProps {
  serviceTypes: ServiceType[];
}

export default function ServiceTypeStep({ serviceTypes }: ServiceTypeStepProps) {
  const { websiteType, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (val: string) => {
    updateFields({ websiteType: val });
  };

  const handleNext = () => {
    if (websiteType) {
      nextStep();
    }
  };

  const getTypeIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('saas') || n.includes('platform')) return <Cloud className="w-6 h-6 text-primary" />;
    if (n.includes('commerce') || n.includes('shop') || n.includes('retail')) return <ShoppingBag className="w-6 h-6 text-primary" />;
    if (n.includes('corp') || n.includes('business') || n.includes('corporate')) return <Briefcase className="w-6 h-6 text-primary" />;
    if (n.includes('land') || n.includes('single') || n.includes('one page')) return <Sparkles className="w-6 h-6 text-primary" />;
    if (n.includes('mobile') || n.includes('app')) return <Smartphone className="w-6 h-6 text-primary" />;
    if (n.includes('custom') || n.includes('software')) return <Cpu className="w-6 h-6 text-primary" />;
    return <Layers className="w-6 h-6 text-primary" />;
  };

  const selectedType = serviceTypes.find(t => t.id === websiteType);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Select Project Type</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Choose the specific model or template configuration that best aligns with your project goals.
        </p>
      </div>

      {/* Grid of Luminous Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {serviceTypes.map((type) => {
          const isSelected = websiteType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
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
                {getTypeIcon(type.name)}
              </div>

              <h3 className="font-bold text-xs text-foreground mb-1">{type.name}</h3>
              <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                {type.description || `Build and scale with our optimized ${type.name} configuration template.`}
              </p>
            </button>
          );
        })}
        {serviceTypes.length === 0 && (
          <p className="text-xs text-muted-foreground font-semibold col-span-2 py-4">No project types available for this service category yet.</p>
        )}
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
              Selected: <span className="text-primary font-bold">{selectedType.name}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!websiteType || serviceTypes.length === 0}
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
