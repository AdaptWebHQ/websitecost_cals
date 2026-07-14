'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Sparkles, 
  Utensils, 
  Dumbbell, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Mail,
  Calendar,
  CreditCard,
  BookOpen,
  Bot,
  MessageSquare
} from 'lucide-react';

import NicheImageSlideshow from '@/components/landing/niche-image-slideshow';

// Define niches
const NICHES = [
  {
    id: 'niche-card',
    name: 'vCard Business Card',
    description: 'Minimalist luxury profile & links repository.',
    basePrice: 4999,
    pagesIncluded: 1,
    deliveryDays: 4,
    revisions: 2,
    domain: 'alexcarter.me',
    themeClass: 'from-amber-500/10 to-orange-500/5',
    icon: <User className="w-5 h-5" />,
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  },
  {
    id: 'niche-salon',
    name: 'Salon & Spa Wellness',
    description: 'Elegant local portfolio and stylist manager.',
    basePrice: 19999,
    pagesIncluded: 5,
    deliveryDays: 7,
    revisions: 4,
    domain: 'elixir-spa.co',
    themeClass: 'from-rose-500/10 to-stone-500/5',
    icon: <Sparkles className="w-5 h-5" />,
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  },
  {
    id: 'niche-restaurant',
    name: 'Fine Dining Bistro',
    description: 'Menu showcase with digital booking forms.',
    basePrice: 39999,
    pagesIncluded: 10,
    deliveryDays: 14,
    revisions: 6,
    domain: 'gustobistro.com',
    themeClass: 'from-amber-500/10 to-orange-500/5',
    icon: <Utensils className="w-5 h-5" />,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20'
  },
  {
    id: 'niche-gym',
    name: 'Ripped Fitness Portal',
    description: 'Fitness scheduler, classes, and trainer grids.',
    basePrice: 69999,
    pagesIncluded: 20,
    deliveryDays: 28,
    revisions: 10,
    domain: 'rippedgym.in',
    themeClass: 'from-cyan-500/10 to-emerald-500/5',
    icon: <Dumbbell className="w-5 h-5" />,
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
  },
  {
    id: 'niche-saas',
    name: 'Metrics SaaS Dashboard',
    description: 'Premium platform with data charts and sheets.',
    basePrice: 99999,
    pagesIncluded: 100,
    deliveryDays: 45,
    revisions: 99,
    domain: 'saasdashboard.io',
    themeClass: 'from-indigo-500/10 to-blue-500/5',
    icon: <BarChart3 className="w-5 h-5" />,
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  }
];

// Available integrations details
const INTEGRATIONS = [
  { id: 'bookingSystem', name: 'Booking Calendar', price: 10000, desc: 'Online reservation flows', icon: <Calendar className="w-4 h-4" /> },
  { id: 'paymentGateway', name: 'SSL Checkout Payment', price: 12000, desc: 'Secure UPI & credit gateways', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'blogCms', name: 'CMS Post/Blog Engine', price: 8000, desc: 'Easy editor articles hub', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'businessEmail', name: 'Business Email Config', price: 2000, desc: 'Custom corporate mailbox', icon: <Mail className="w-4 h-4" /> },
  { id: 'aiChatbot', name: 'AI Customer Bot', price: 25000, desc: '24/7 client assistant', icon: <Bot className="w-4 h-4" /> },
  { id: 'whatsappAutomation', name: 'WhatsApp Automations', price: 15000, desc: 'Auto confirmations & alerts', icon: <MessageSquare className="w-4 h-4" /> }
];

export default function InteractiveNicheCalculator() {
  const [slide, setSlide] = useState(0);
  const [nicheIdx, setNicheIdx] = useState(0);
  const [pages, setPages] = useState(1);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({
    bookingSystem: false,
    paymentGateway: false,
    blogCms: false,
    businessEmail: false,
    aiChatbot: false,
    whatsappAutomation: false
  });
  
  const [glowState, setGlowState] = useState(false);

  // Stagger cycle for mockup animations
  useEffect(() => {
    const timer = setInterval(() => {
      setGlowState((prev) => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Sync pages count with niche defaults when niche switches
  useEffect(() => {
    setPages(NICHES[nicheIdx].pagesIncluded);
  }, [nicheIdx]);

  const activeNiche = NICHES[nicheIdx];

  // Price calculations
  const basePrice = activeNiche.basePrice;
  const additionalPages = Math.max(0, pages - activeNiche.pagesIncluded);
  const pagesCost = additionalPages * 2000;
  
  let featuresCost = 0;
  INTEGRATIONS.forEach((feat) => {
    if (selectedFeatures[feat.id]) {
      featuresCost += feat.price;
    }
  });

  const subtotal = basePrice + pagesCost + featuresCost;
  const totalCost = rushDelivery ? subtotal * 1.25 : subtotal;

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const nextSlide = () => {
    if (slide < 3) setSlide(slide + 1);
  };

  const prevSlide = () => {
    if (slide > 0) setSlide(slide - 1);
  };

  const renderActiveMockup = () => {
    return <NicheImageSlideshow index={nicheIdx} />;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px] text-left">
      
      {/* Left Column: Interactive Controls (7 Columns) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-3xl relative overflow-hidden">
        
        {/* Top Progress bar and Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-xs mb-3 font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>Configure Project</span>
            <span className="text-primary font-black">Slide {slide + 1} of 4</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full" 
              style={{ width: `${(slide + 1) * 25}%` }} 
            />
          </div>

          {/* Slides switcher */}
          <AnimatePresence mode="wait">
            {slide === 0 && (
              <motion.div
                key="slide-niche"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Select Niche Category</h3>
                  <p className="text-xs text-muted-foreground mt-1">Select a starting theme package corresponding to your project niche.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {NICHES.map((niche, idx) => (
                    <div
                      key={niche.id}
                      onClick={() => setNicheIdx(idx)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        nicheIdx === idx 
                          ? 'border-primary bg-primary/[0.03] shadow-xs' 
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                          nicheIdx === idx 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {niche.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{niche.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{niche.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                        <span className="text-foreground">₹{niche.basePrice.toLocaleString('en-IN')}</span>
                        {nicheIdx === idx && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {slide === 1 && (
              <motion.div
                key="slide-scope"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Determine Scope & Speed</h3>
                  <p className="text-xs text-muted-foreground mt-1">Specify total page outputs and customize build delivery timeline speed.</p>
                </div>

                {/* Page Count Slider */}
                <div className="space-y-3 bg-muted/40 border border-border/80 p-4 rounded-2xl">
                  <div className="flex justify-between items-baseline text-xs font-bold font-mono">
                    <span className="text-muted-foreground">Page Count Scope</span>
                    <span className="text-primary text-sm font-black">{pages} Pages</span>
                  </div>
                  <input
                    type="range"
                    min={activeNiche.pagesIncluded}
                    max={activeNiche.pagesIncluded + 15}
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-muted border border-border rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>Base Included: {activeNiche.pagesIncluded} pages</span>
                    {additionalPages > 0 ? (
                      <span className="text-amber-600 font-bold">+{additionalPages} extra pages (+₹{(additionalPages * 2000).toLocaleString('en-IN')})</span>
                    ) : (
                      <span>No extra page charges</span>
                    )}
                  </div>
                </div>

                {/* Rush Delivery Speed */}
                <div 
                  onClick={() => setRushDelivery(!rushDelivery)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    rushDelivery 
                      ? 'border-primary bg-primary/[0.03] shadow-xs' 
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                      rushDelivery 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Rush Delivery Option</h4>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Speed up roadmap timeline by 35% (adds 25% markup).</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-foreground">
                      {rushDelivery ? 'Active' : '+25%'}
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      rushDelivery ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {rushDelivery && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {slide === 2 && (
              <motion.div
                key="slide-features"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Add-on Feature Power-ups</h3>
                  <p className="text-xs text-muted-foreground mt-1">Select optional features to integrate into your baseline application framework.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {INTEGRATIONS.map((feat) => (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-xl border flex flex-col justify-between text-left cursor-pointer transition-all duration-300 ${
                        selectedFeatures[feat.id]
                          ? 'border-primary bg-primary/[0.02] shadow-xs'
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                          selectedFeatures[feat.id]
                            ? 'bg-primary text-white border-primary'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {feat.icon}
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground leading-tight">{feat.name}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-3 font-mono text-[9px] font-bold">
                        <span className="text-slate-400 font-normal leading-none">{feat.desc}</span>
                        <span className="text-primary leading-none">+₹{feat.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {slide === 3 && (
              <motion.div
                key="slide-results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none">Quotation Cost Invoice</h3>
                  <p className="text-xs text-muted-foreground mt-1">Detailed pricing report matching active project configuration selections.</p>
                </div>

                {/* Pricing Table Itemized */}
                <div className="space-y-2.5 border border-border p-4 bg-muted/40 rounded-2xl text-xs font-mono">
                  <div className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Base: {activeNiche.name}</span>
                    <span className="text-foreground font-bold">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {additionalPages > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground font-medium">
                      <span>Extra Pages ({additionalPages} pages)</span>
                      <span className="text-foreground font-bold">₹{pagesCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {featuresCost > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground font-medium border-t border-dashed border-border pt-2">
                      <span>Feature Powerups</span>
                      <span className="text-foreground font-bold">₹{featuresCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {rushDelivery && (
                    <div className="flex justify-between items-center text-amber-700 font-bold border-t border-dashed border-border pt-2">
                      <span>Rush Speed (25% markup)</span>
                      <span className="font-extrabold">₹{(subtotal * 0.25).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline border-t border-border pt-3.5">
                    <span className="text-xs font-black uppercase text-foreground">Estimated Total</span>
                    <span className="text-xl font-black text-primary">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>These prices represent approximate cost indices based on AdaptWeb benchmarks.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls: Back / Next */}
        <div className="mt-8 pt-4 border-t border-border flex items-center justify-between w-full">
          <button
            type="button"
            onClick={prevSlide}
            disabled={slide === 0}
            className="px-4 py-2 border border-border bg-card hover:bg-muted text-foreground rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {slide < 3 ? (
            <button
              type="button"
              onClick={nextSlide}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <Link href="/register" className="w-auto">
              <button
                type="button"
                className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-primary/10"
              >
                Launch Full Calculator <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: Premium Browser View Mockup (5 Columns) */}
      <div className="lg:col-span-5 min-h-[350px] lg:min-h-full bg-muted/20 relative overflow-hidden flex items-center justify-center p-4 rounded-3xl border border-border">
        
        {/* Browser shell container */}
        <div className="absolute top-6 bottom-[-40px] left-6 right-[-40px] rounded-tl-2xl border border-border bg-background shadow-xl flex flex-col overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-2xl">
          
          {/* Header Bar */}
          <div className="bg-muted px-3.5 py-1.5 border-b border-border/80 flex items-center justify-between shrink-0 select-none">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400/80"></span>
              <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
            </div>
            <div className="bg-background/90 border border-border px-2.5 py-0.5 rounded-md text-[7px] text-muted-foreground font-mono w-36 text-center truncate">
              {activeNiche.domain}
            </div>
            <div className="w-8"></div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-background relative overflow-hidden">
            {renderActiveMockup()}
          </div>
        </div>
      </div>
      
    </div>
  );
}
