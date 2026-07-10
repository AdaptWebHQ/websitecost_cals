'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import type { Industry } from '@/types';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  Cpu, 
  ShoppingBag, 
  HeartPulse, 
  Home, 
  GraduationCap, 
  Coins, 
  CheckCircle2 
} from 'lucide-react';

interface IndustryStepProps {
  industries: Industry[];
}

const INDUSTRY_DESCRIPTIONS: Record<string, string> = {
  'healthcare': 'Focus on HIPAA compliance, patient portals, and secure data handling.',
  'tech': 'High-performance landing pages, API integrations, and scalable architecture.',
  'software': 'High-performance landing pages, API integrations, and scalable architecture.',
  'saas': 'High-performance landing pages, API integrations, and scalable architecture.',
  'e-commerce': 'Custom storefronts, payment gateways, and inventory management systems.',
  'commerce': 'Custom storefronts, payment gateways, and inventory management systems.',
  'real-estate': 'Property listings, dynamic maps, and lead generation funnels.',
  'estate': 'Property listings, dynamic maps, and lead generation funnels.',
  'education': 'LMS platforms, student portals, and interactive learning resources.',
  'school': 'LMS platforms, student portals, and interactive learning resources.',
};

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

  const getIndustryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('tech') || s.includes('software') || s.includes('saas')) return <Cpu className="w-5 h-5 text-primary" />;
    if (s.includes('shop') || s.includes('retail') || s.includes('commerce')) return <ShoppingBag className="w-5 h-5 text-primary" />;
    if (s.includes('health') || s.includes('med')) return <HeartPulse className="w-5 h-5 text-primary" />;
    if (s.includes('estate') || s.includes('construct') || s.includes('domain') || s.includes('real')) return <Home className="w-5 h-5 text-primary" />;
    if (s.includes('educ') || s.includes('school')) return <GraduationCap className="w-5 h-5 text-primary" />;
    if (s.includes('finance') || s.includes('bank') || s.includes('money')) return <Coins className="w-5 h-5 text-primary" />;
    return <Building2 className="w-5 h-5 text-primary" />;
  };

  const selectedIndustry = industries.find(ind => ind.id === industryId);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Select Industry</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Tailoring your cost estimate based on industry standards and specific compliance requirements.
        </p>
      </div>

      {/* Grid of Luminous Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((ind) => {
          const isSelected = industryId === ind.id;
          const slug = ind.slug || ind.name || '';
          const description = INDUSTRY_DESCRIPTIONS[slug.toLowerCase()] || 'General business websites, portfolios, or unique custom ventures.';

          return (
            <button
              key={ind.id}
              onClick={() => handleSelect(ind.id)}
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
                {getIndustryIcon(ind.name || ind.id)}
              </div>

              <h3 className="font-bold text-xs text-foreground mb-1">{ind.name}</h3>
              <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                {description}
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
          {selectedIndustry && (
            <p className="text-xs text-muted-foreground font-semibold">
              Selected: <span className="text-primary font-bold">{selectedIndustry.name}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            disabled={!industryId}
            className="w-full sm:w-auto px-5 py-2 bg-primary text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
