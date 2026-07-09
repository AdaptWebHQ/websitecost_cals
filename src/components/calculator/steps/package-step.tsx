'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import type { Package } from '@/types';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PackageStepProps {
  packages: Package[];
}

const PACKAGE_FEATURES: Record<string, { delivery: string; items: string[] }> = {
  'pkg-portfolio': {
    delivery: '2–4 Days',
    items: [
      '1 Premium Landing Page',
      'Custom UI Design',
      'Fully Responsive',
      'Mobile & Tablet Optimized',
      'SEO Friendly',
      'Contact Form',
      'WhatsApp Integration',
      'Click-to-Call Button',
      'Email Button',
      'Google Maps & Analytics',
      'SSL Setup & Deployment',
    ],
  },
  'pkg-starter': {
    delivery: '5–7 Days',
    items: [
      'Everything in Single Page +',
      'Up to 5 Pages',
      'Modern UI/UX',
      'Contact Forms & Gallery',
      'Testimonials & FAQ Section',
      'Google Business Integration',
      'Sitemap & Robots.txt',
      'Technical SEO & Image Opt.',
      'Performance Optimization',
      'Basic Animations',
    ],
  },
  'pkg-professional': {
    delivery: '1–2 Weeks',
    items: [
      'Everything in Starter +',
      'Up to 10 Pages',
      'Blog with CMS',
      'Lead Generation Forms',
      'Premium Animations',
      'Landing Pages',
      'Conversion Optimization',
      'Schema Markup & Vitals Opt.',
      'Email & Newsletter Signup',
      'Social Sharing',
    ],
  },
  'pkg-business': {
    delivery: '2–4 Weeks',
    items: [
      'Everything in Professional +',
      'Up to 20 Pages',
      'Booking / Appointment System',
      'Admin Dashboard & Auth',
      'Database Integration',
      'Payment Gateway Integration',
      'CRM & API Integrations',
      'Email Automation & Advanced Forms',
      'Custom Features & Security',
    ],
  },
  'pkg-enterprise': {
    delivery: 'Based on project scope',
    items: [
      'Unlimited Pages',
      'Custom UI/UX Design',
      'Discovery & Planning',
      'SaaS & AI Integrations',
      'CRM / ERP Development',
      'Marketplace Development',
      'Customer Portals',
      'Multi-user Roles & Dashboards',
      'Scalable Cloud Architecture',
      'Testing, QA & Documentation',
      'Priority Support',
    ],
  },
};

const COMMON_INCLUSIONS = [
  'Custom Design',
  'Fully Responsive',
  'SEO-Ready Architecture',
  'Fast Loading',
  'Core Web Vitals Optimization',
  'SSL Security',
  'Google Analytics Setup',
  'Sitemap & Robots.txt',
  'Source Code Ownership',
  'Deployment',
  'Lifetime Technical Support*',
];

export default function PackageStep({ packages }: PackageStepProps) {
  const { packageId, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (id: string, pages: number) => {
    updateFields({ packageId: id, pages }); // Pre-fill default pages based on packages pagesIncluded
  };

  const handleNext = () => {
    if (packageId) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Select Quotation Package
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose a baseline pricing structure to configure your quotation.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isSelected = packageId === pkg.id;
          const isFeatured = pkg.isPopular;
          const isEnterprise = pkg.id === 'pkg-enterprise';
          const meta = PACKAGE_FEATURES[pkg.id] || { delivery: `${pkg.deliveryDays} Days`, items: [] };

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg.id, pkg.pagesIncluded)}
              className={`p-5 rounded-3xl border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
              }`}
            >
              {isFeatured && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    {pkg.name}
                    {isFeatured && <span className="text-yellow-400 text-xs">⭐</span>}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">{pkg.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-white">
                  {isEnterprise && (
                    <span className="text-[10px] text-slate-500 font-medium mr-1 uppercase tracking-wider">From</span>
                  )}
                  <span className="text-sm font-semibold">₹</span>
                  <span className="text-2xl font-extrabold tracking-tight">{pkg.basePrice.toLocaleString()}</span>
                </div>

                {/* Delivery Indicator */}
                <div className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-2.5 py-1 w-fit">
                  Delivery: {meta.delivery}
                </div>

                {/* Package Features List */}
                <ul className="space-y-2 text-xs text-slate-400 pt-4 border-t border-slate-900/50">
                  {meta.items.map((featItem, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{featItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className={`w-full rounded-xl py-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {isSelected ? 'Package Selected' : 'Choose Package'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Included in Every Website Section */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/5 backdrop-blur-sm mt-8 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          Included in Every Website
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-[11px] text-slate-400">
          {COMMON_INCLUSIONS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-emerald-500 text-xs">✅</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
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
          disabled={!packageId}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium disabled:opacity-50"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
