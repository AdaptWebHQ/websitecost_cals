'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function PackagesPricingSection({ packages }: { packages: any[] }) {
  // Sort packages by sortOrder
  const sortedPackages = [...packages].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
      {sortedPackages.map((pkg, idx) => (
        <PricingCard key={pkg.id} pkg={pkg} index={idx} />
      ))}
    </div>
  );
}

function PricingCard({ pkg, index }: { pkg: any; index: number }) {
  const isPopular = pkg.isPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex flex-col h-full rounded-none bg-white dark:bg-slate-950 border transition-colors duration-300 ${
        isPopular ? 'border-slate-900 dark:border-white hover:border-slate-400 dark:hover:border-slate-300 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm'
      }`}
    >
      {/* Popular Badge Top Bar */}
      {isPopular && (
        <div className="bg-slate-900 dark:bg-white py-1.5 text-center border-b border-slate-900 dark:border-slate-800">
          <span className="text-[10px] font-bold text-white dark:text-slate-900 uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3" />
            Most Popular Architecture
          </span>
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{pkg.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px] font-mono">
            {pkg.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-end gap-1.5 mb-8">
          <span className="text-xl font-bold text-slate-900 dark:text-white mb-1 font-mono">₹</span>
          <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            {pkg.basePrice.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1 font-mono">
            / Base System
          </span>
        </div>

        {/* Base Included Features */}
        <div className="mb-8 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 font-mono">
            Baseline Specifications
          </p>
          <ul className="space-y-4 text-sm font-mono">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-slate-900 dark:text-white shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-slate-600 dark:text-slate-400 leading-snug text-xs">
                {pkg.pagesIncluded === -1 ? (
                  <strong className="text-slate-900 dark:text-white">Unlimited pages</strong>
                ) : (
                  <>Up to <strong className="text-slate-900 dark:text-white">{pkg.pagesIncluded} pages</strong></>
                )} included
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-slate-900 dark:text-white shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-slate-600 dark:text-slate-400 leading-snug text-xs">
                Delivery in <strong className="text-slate-900 dark:text-white">{pkg.deliveryDays} Days</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-slate-900 dark:text-white shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-slate-600 dark:text-slate-400 leading-snug text-xs">
                <strong className="text-slate-900 dark:text-white">{pkg.revisions} Design</strong> revision cycles
              </span>
            </li>
          </ul>

          {/* Dynamic DB Features */}
          {pkg.featureCategories && pkg.featureCategories.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Included Capabilities
              </p>
              <ul className="space-y-3 text-sm font-mono">
                {pkg.featureCategories.map((cat: any) =>
                  cat.features.map((feat: any) => (
                    <li key={feat.id} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-none bg-slate-300 dark:bg-slate-600 shrink-0 mt-1.5" />
                      <span className="text-slate-600 dark:text-slate-400 leading-snug text-xs uppercase tracking-wider">
                        {feat.name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link href={`/public/calculator?package=${pkg.id}`} className="w-full">
            <button
              className={`w-full h-14 rounded-none text-xs font-bold uppercase tracking-widest gap-2 flex items-center justify-center transition-all duration-300 font-mono border ${
                isPopular
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-200'
                  : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-900 dark:hover:border-white'
              }`}
            >
              Configure Package
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
