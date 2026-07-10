'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import type { Package } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PackageStepProps {
  packages: Package[];
}

const PACKAGE_LABELS: Record<string, string> = {
  'pkg-portfolio': 'Quick Launch',
  'pkg-starter': 'Entry Level',
  'pkg-professional': 'Growth Engine',
  'pkg-business': 'Enterprise Ready',
  'pkg-enterprise': 'Bespoke Scale',
};

const PACKAGE_FEATURES: Record<string, string[]> = {
  'pkg-portfolio': [
    '1 Premium Landing Page',
    'Custom UI Design',
    'Fully Responsive Mobile & Tablet',
    'SEO Friendly structure',
    'Contact Form Integration',
  ],
  'pkg-starter': [
    'Up to 5 Responsive Pages',
    'Modern UI/UX Mockups',
    'Contact Forms & Gallery',
    'Sitemap & Technical SEO',
    '1 Month Post-Launch Support',
  ],
  'pkg-professional': [
    'Up to 15 Premium Pages',
    'Custom UI/UX Prototypes',
    'Advanced CMS Integration',
    'Interactive Dashboard Assets',
    'Priority Email Support',
    'Google Analytics Pro Setup',
  ],
  'pkg-business': [
    'Unlimited Scalable Pages',
    'Full E-commerce Architecture',
    'Multi-step Custom Forms',
    'API & CRM Integrations',
    'Dedicated Account Manager',
    'Security Audit & SSL Pro',
  ],
  'pkg-enterprise': [
    'Custom SaaS/AI Integrations',
    'Bespoke Cloud Infrastructure',
    'Dedicated DevOps Pipeline',
    '24/7 Priority SLA Support',
    'Full Intellectual Ownership',
  ]
};

export default function PackageStep({ packages }: PackageStepProps) {
  const { packageId, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (id: string, pages: number) => {
    updateFields({ packageId: id, pages });
  };

  const handleNext = () => {
    if (packageId) {
      nextStep();
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Select Quotation Package</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Choose a tier that best aligns with your business goals and technical requirements.
        </p>
      </div>

      {/* Grid of Luminous Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => {
          const isSelected = packageId === pkg.id;
          const isFeatured = pkg.isPopular;
          const label = PACKAGE_LABELS[pkg.id] || 'Product Option';
          const items = pkg.features && pkg.features.length > 0
            ? pkg.features
            : (PACKAGE_FEATURES[pkg.id] || ['Responsive Design', 'SEO Optimization', 'Contact Form']);

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg.id, pkg.pagesIncluded)}
              className={`rounded-lg p-4 flex flex-col justify-between relative overflow-hidden transition-colors cursor-pointer border ${
                isSelected
                  ? 'border-primary bg-card/90 shadow-sm'
                  : 'border-border bg-card/65 hover:border-primary/50'
              }`}
            >
              {isFeatured && (
                <div className="absolute top-3 right-0">
                  <div className="bg-primary text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded-l uppercase tracking-wider">
                    POPULAR
                  </div>
                </div>
              )}

              <div className="space-y-4 flex-grow">
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-1.5">{label}</span>
                  <h3 className="font-bold text-sm text-foreground leading-tight">{pkg.name}</h3>
                </div>

                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold tracking-tight text-foreground">₹{pkg.basePrice.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">/base</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <ul className="space-y-2 pt-3 border-t border-border flex-grow">
                  {items.map((featItem, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/10 shrink-0 mt-0.5" />
                      <span className="text-[10px] leading-relaxed text-foreground/80 font-medium">{featItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(pkg.id, pkg.pagesIncluded);
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'border border-primary text-primary hover:bg-primary/5'
                  }`}
                >
                  {isSelected ? `Selected ${pkg.name}` : `Select ${pkg.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Area */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <button
          onClick={prevStep}
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous Step
        </button>

        <button
          onClick={handleNext}
          disabled={!packageId}
          className="px-5 py-2 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-xs"
        >
          Next Step
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
