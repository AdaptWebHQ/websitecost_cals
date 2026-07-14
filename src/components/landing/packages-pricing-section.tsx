'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ArrowRight, Calculator, FileText, ChevronRight } from 'lucide-react';
import type { Package, Feature } from '@/types';

import NicheImageSlideshow from '@/components/landing/niche-image-slideshow';

interface PackagesPricingSectionProps {
  packages: Package[];
  allFeatures: Feature[];
}

export default function PackagesPricingSection({ packages, allFeatures }: PackagesPricingSectionProps) {
  // Sort packages by sortOrder in case database order fluctuates
  const sortedPackages = [...packages].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="flex flex-col gap-12 mt-12 max-w-6xl mx-auto w-full px-2">
      {sortedPackages.map((pkg, idx) => (
        <PackageBusinessCard key={pkg.id} pkg={pkg} index={idx} allFeatures={allFeatures} />
      ))}
    </div>
  );
}

function PackageBusinessCard({ pkg, index, allFeatures }: { pkg: Package; index: number; allFeatures: Feature[] }) {
  const [glowState, setGlowState] = useState(false);

  // Trigger brief highlight cycles
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowState((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Map package to custom niche details
  const getNicheDetails = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          nicheTag: 'Digital Business Card / vCard',
          domain: 'alexcarter.me',
          themeClass: 'from-amber-500/10 to-orange-500/5',
          glowBorder: 'hover:shadow-amber-500/15 hover:border-amber-500/30',
          badgeText: 'Personal vCard Site',
          badgeColor: 'bg-amber-500/10 text-amber-500',
          features: [
            'Interactive contact sharing (vCard)',
            'Sleek glassmorphic micro-links',
            'Simulated QR scan-to-save action'
          ]
        };
      case 1:
        return {
          nicheTag: 'Salon & Body Therapy',
          domain: 'elixir-spa.co',
          themeClass: 'from-rose-500/10 to-stone-500/5',
          glowBorder: 'hover:shadow-rose-500/15 hover:border-rose-500/30',
          badgeText: 'Spa Booking WebApp',
          badgeColor: 'bg-rose-500/10 text-rose-500',
          features: [
            'Interactive stylist portfolios',
            'One-click appointment bookings',
            'Luxury editorial aesthetics system'
          ]
        };
      case 2:
        return {
          nicheTag: 'Fine Dining Bistro',
          domain: 'gustobistro.com',
          themeClass: 'from-amber-500/10 to-orange-500/5',
          glowBorder: 'hover:shadow-amber-500/15 hover:border-amber-500/30',
          badgeText: 'Restaurant Showcase',
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-500',
          features: [
            'Floating gallery ingredient layout',
            'Real-time reservation system',
            'Premium menu cards and pricing sheets'
          ]
        };
      case 3:
        return {
          nicheTag: 'Ripped Fitness Portal',
          domain: 'rippedgym.in',
          themeClass: 'from-cyan-500/10 to-emerald-500/5',
          glowBorder: 'hover:shadow-cyan-500/15 hover:border-cyan-500/30',
          badgeText: 'Gym Member Center',
          badgeColor: 'bg-cyan-500/10 text-cyan-500',
          features: [
            'Dynamic workout scheduler calendar',
            'Trainer slots validation matrix',
            'Clean glassmorphic dark interface'
          ]
        };
      case 4:
      default:
        return {
          nicheTag: 'Enterprise Metrics SaaS',
          domain: 'saasdashboard.io',
          themeClass: 'from-indigo-500/10 to-blue-500/5',
          glowBorder: 'hover:shadow-indigo-500/15 hover:border-indigo-500/30',
          badgeText: 'Analytics Platform',
          badgeColor: 'bg-indigo-500/10 text-indigo-500',
          features: [
            'Live SVG analytics path charts',
            'Instant server logs table render',
            'Advanced customizable dynamic sections'
          ]
        };
    }
  };

  const niche = getNicheDetails(index);

  // Render the right-side custom mockups
  const renderMockup = () => {
    return <NicheImageSlideshow index={index} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative w-full rounded-[32px] border border-border bg-card/60 backdrop-blur-md flex flex-col lg:flex-row items-stretch min-h-[440px] overflow-hidden transition-all duration-500 ${niche.glowBorder} group`}
    >
      {/* Background radial gradient corresponding to Niche */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${niche.themeClass} blur-[120px] pointer-events-none -z-10`} />

      {/* Left Column (55% Width on Desktop) */}
      <div className="lg:w-[55%] w-full p-8 sm:p-10 flex flex-col justify-between z-10 border-b lg:border-b-0 lg:border-r border-border/85">
        <div>
          {/* Niche Badge Tag */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-border/80 ${niche.badgeColor}`}>
              {niche.nicheTag}
            </span>
            {pkg.isPopular && (
              <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-indigo-500/10">
                Popular Baseline
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="mt-5">
            <h3 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              {pkg.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Pricing Info */}
          <div className="flex items-baseline gap-1.5 text-foreground mt-6 mb-4">
            <span className="text-2xl font-bold">₹</span>
            <span className="text-5xl font-black tracking-tight">{pkg.basePrice.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">/ base cost</span>
          </div>

          {/* Deliverables Checklist */}
          <ul className="space-y-3.5 text-sm pt-6 border-t border-border/80">
            <li className="flex items-center gap-3 text-foreground/80">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-500" />
              </span>
              <span>Includes up to <strong className="text-foreground">{pkg.pagesIncluded} pages</strong> mockup structures</span>
            </li>
            <li className="flex items-center gap-3 text-foreground/80">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-500" />
              </span>
              <span>Baseline delivery in <strong className="text-foreground">{pkg.deliveryDays} Days</strong></span>
            </li>
            <li className="flex items-center gap-3 text-foreground/80">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-500" />
              </span>
              <span>Allow up to <strong className="text-foreground">{pkg.revisions} Design</strong> revision cycles</span>
            </li>
            
            {/* Dynamic Custom Niche features or DB-backed package features */}
            {(() => {
              const includedFeatures = (pkg.features || [])
                .map((fId) => allFeatures.find((f) => f.id === fId))
                .filter(Boolean) as Feature[];

              if (includedFeatures.length > 0) {
                return includedFeatures.map((feat) => (
                  <li key={feat.id} className="flex items-start gap-3 text-foreground/85">
                    <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    </span>
                    <span className="text-xs sm:text-sm leading-snug">
                      <strong className="text-foreground">{feat.name}</strong>: {feat.description}
                    </span>
                  </li>
                ));
              }

              return niche.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/85">
                  <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  </span>
                  <span>{feat}</span>
                </li>
              ));
            })()}
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-4">
          <Link href="/public/calculator">
            <Button className="w-full sm:w-auto px-8 h-12 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 text-white gap-2 transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Select & Configure
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Column - Premium Browser Mockup (45% Width on Desktop) */}
      <div className="lg:w-[45%] w-full min-h-[340px] lg:min-h-full bg-muted/20 relative overflow-hidden flex items-center justify-center">
        {/* Browser viewport positioned absolutely to flow out of bottom-right */}
        <div className="absolute top-6 bottom-[-40px] left-6 right-[-40px] rounded-tl-3xl border border-border bg-background shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden transition-all duration-500 group-hover:translate-y-[-6px] group-hover:translate-x-[-6px] group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
          
          {/* Browser Header Bar */}
          <div className="bg-muted px-4 py-2 border-b border-border/80 flex items-center justify-between shrink-0">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
            </div>
            <div className="bg-background/90 border border-border px-3 py-0.5 rounded-md text-[8px] text-muted-foreground font-mono w-44 text-center truncate">
              {niche.domain}
            </div>
            <div className="w-10"></div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-background relative overflow-hidden">
            {renderMockup()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// Interactive AdaptWeb Cost Calculator Simulation (Package 1)
// -------------------------------------------------------------
function MiniCalculatorSimulator({ isGlow }: { isGlow: boolean }) {
  const [calculatorState, setCalculatorState] = useState({
    checkedPages: true,
    checkedAnimations: false,
    checkedSEO: false,
    checkedDashboard: false,
    price: 4999
  });

  const [step, setStep] = useState(0);

  // Automated pricing ticker loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % 4;
        
        if (next === 0) {
          setCalculatorState({
            checkedPages: true,
            checkedAnimations: false,
            checkedSEO: false,
            checkedDashboard: false,
            price: 4999
          });
        } else if (next === 1) {
          setCalculatorState({
            checkedPages: true,
            checkedAnimations: true,
            checkedSEO: false,
            checkedDashboard: false,
            price: 7499
          });
        } else if (next === 2) {
          setCalculatorState({
            checkedPages: true,
            checkedAnimations: true,
            checkedSEO: true,
            checkedDashboard: false,
            price: 9499
          });
        } else if (next === 3) {
          setCalculatorState({
            checkedPages: true,
            checkedAnimations: true,
            checkedSEO: true,
            checkedDashboard: true,
            price: 15499
          });
        }
        
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#fcfcfb] p-4 text-slate-800 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center border-b border-slate-900/5 pb-2">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[9px] font-black text-slate-700 uppercase tracking-wider">
            AdaptWeb Configurator
          </span>
        </div>
        <span className="text-[7px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Best Design
        </span>
      </div>

      {/* Simulator Body */}
      <div className="my-2.5 grid grid-cols-12 gap-3 items-center flex-1">
        
        {/* Left Options Checklist */}
        <div className="col-span-7 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
              calculatorState.checkedPages ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
            }`}>
              {calculatorState.checkedPages && <Check className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="text-[7.5px] font-semibold text-slate-700">Baseline Page (1 Page)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
              calculatorState.checkedAnimations ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
            }`}>
              {calculatorState.checkedAnimations && <Check className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="text-[7.5px] font-semibold text-slate-600">Custom Animation (+₹2,500)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
              calculatorState.checkedSEO ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
            }`}>
              {calculatorState.checkedSEO && <Check className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="text-[7.5px] font-semibold text-slate-600">SEO Boost Setup (+₹2,000)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
              calculatorState.checkedDashboard ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
            }`}>
              {calculatorState.checkedDashboard && <Check className="w-2.5 h-2.5 text-white" />}
            </span>
            <span className="text-[7.5px] font-semibold text-slate-600">Database Setup (+₹6,000)</span>
          </div>
        </div>

        {/* Right Dynamic Budget Total */}
        <div className="col-span-5 flex flex-col justify-center items-center bg-slate-50 border border-slate-900/5 rounded-xl p-3 h-full min-h-[90px] relative">
          <span className="text-[7px] text-slate-400 font-bold font-mono uppercase tracking-widest block text-center">
            Estimated Total
          </span>
          
          <div className="text-sm font-extrabold text-slate-900 font-mono mt-1 text-center">
            ₹{calculatorState.price.toLocaleString('en-IN')}
          </div>

          {/* Animate PDF saving popup on final step */}
          <AnimatePresence>
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                className="absolute inset-0 rounded-xl bg-primary/95 text-white flex flex-col justify-center items-center p-2 text-center"
              >
                <FileText className="w-4 h-4 animate-bounce text-white" />
                <span className="text-[6.5px] font-bold tracking-wide mt-1 block">Proposal Ready</span>
                <span className="text-[5px] text-white/80 font-mono block">Download PDF quote</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simulator Footer Description */}
      <div className="border-t border-slate-900/5 pt-2 flex justify-between items-center text-[7px] font-mono text-slate-400">
        <span>AdaptWeb Client-Server Sync</span>
        <span className="text-emerald-700 font-bold">Secure pricing algorithm</span>
      </div>
    </div>
  );
}
