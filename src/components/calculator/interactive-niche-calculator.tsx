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
    icon: <User className="w-5 h-5" />,
    badgeColor: 'text-muted-foreground border-border'
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
    icon: <Sparkles className="w-5 h-5" />,
    badgeColor: 'text-muted-foreground border-border'
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
    icon: <Utensils className="w-5 h-5" />,
    badgeColor: 'text-muted-foreground border-border'
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
    icon: <Dumbbell className="w-5 h-5" />,
    badgeColor: 'text-muted-foreground border-border'
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
    icon: <BarChart3 className="w-5 h-5" />,
    badgeColor: 'text-muted-foreground border-border'
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

  const handleNicheChange = (idx: number) => {
    setNicheIdx(idx);
    setPages(NICHES[idx].pagesIncluded);
  };

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
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-none relative overflow-hidden">
        
        {/* Top Progress bar and Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-xs mb-3 font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>Configure Project</span>
            <span className="text-foreground font-black">Segment 0{slide + 1} // 04</span>
          </div>
          <div className="w-full h-1 bg-border flex rounded-none overflow-hidden mb-6">
            {[0, 1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`flex-1 h-full border-r border-background last:border-0 transition-colors duration-300 ${step <= slide ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
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
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Select Core Architecture</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Select a starting theme package corresponding to your project niche.</p>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {NICHES.map((niche, idx) => (
                    <div
                      key={niche.id}
                      onClick={() => handleNicheChange(idx)}
                      className={`p-3 rounded-none border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        nicheIdx === idx 
                          ? 'border-primary bg-muted/50' 
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-none border flex items-center justify-center ${
                          nicheIdx === idx 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {niche.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{niche.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{niche.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                        <span className="text-muted-foreground">₹{niche.basePrice.toLocaleString('en-IN')}</span>
                        {nicheIdx === idx && (
                          <div className="w-4 h-4 rounded-none bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
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
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Determine Scope & Speed</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Specify total page outputs and customize build delivery timeline speed.</p>
                </div>

                {/* Page Count Slider */}
                <div className="space-y-3 bg-muted/30 border border-border p-4 rounded-none">
                  <div className="flex justify-between items-baseline text-xs font-bold font-mono">
                    <span className="text-muted-foreground uppercase">Page Count Scope</span>
                    <span className="text-foreground text-sm font-black">{pages} Pages</span>
                  </div>
                  <input
                    type="range"
                    min={activeNiche.pagesIncluded}
                    max={activeNiche.pagesIncluded + 15}
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value))}
                    className="w-full h-1 bg-border border-none appearance-none cursor-pointer rounded-none outline-none accent-primary"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span>Base Included: {activeNiche.pagesIncluded} pages</span>
                    {additionalPages > 0 ? (
                      <span className="text-foreground font-bold">+{additionalPages} extra pages (+₹{(additionalPages * 2000).toLocaleString('en-IN')})</span>
                    ) : (
                      <span>No extra page charges</span>
                    )}
                  </div>
                </div>

                {/* Rush Delivery Speed */}
                <div 
                  onClick={() => setRushDelivery(!rushDelivery)}
                  className={`p-4 rounded-none border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    rushDelivery 
                      ? 'border-primary bg-muted/50' 
                      : 'border-border bg-card hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-none border flex items-center justify-center ${
                      rushDelivery 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Rush Delivery Option</h4>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Speed up roadmap timeline by 35% (adds 25% markup).</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      {rushDelivery ? 'Active' : '+25%'}
                    </span>
                    <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-all ${
                      rushDelivery ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-muted text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
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
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Integration Modules</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Select optional features to integrate into your baseline application framework.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {INTEGRATIONS.map((feat) => (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-none border flex flex-col justify-between text-left cursor-pointer transition-all duration-300 ${
                        selectedFeatures[feat.id]
                          ? 'border-primary bg-muted/50'
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-none border flex items-center justify-center ${
                          selectedFeatures[feat.id]
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {feat.icon}
                        </div>
                        <h4 className="text-[10px] font-bold text-foreground leading-tight uppercase tracking-widest">{feat.name}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-3 font-mono text-[9px] font-bold">
                        <span className="text-muted-foreground font-normal leading-none">{feat.desc}</span>
                        <span className="text-foreground leading-none">+₹{feat.price.toLocaleString('en-IN')}</span>
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
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Quotation Cost Invoice</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Detailed pricing report matching active project configuration selections.</p>
                </div>

                {/* Pricing Table Itemized */}
                <div className="space-y-2.5 border border-border p-4 bg-muted/30 rounded-none text-xs font-mono">
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
                    <div className="flex justify-between items-center text-foreground font-bold border-t border-dashed border-border pt-2">
                      <span>Rush Speed (25% markup)</span>
                      <span className="font-extrabold text-foreground">₹{(subtotal * 0.25).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline border-t border-border pt-3.5">
                    <span className="text-xs font-black uppercase text-foreground tracking-widest">Estimated Total</span>
                    <span className="text-xl font-black text-foreground">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/30 border border-border px-3 py-2 rounded-none">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0" />
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
            className="px-4 py-2 border border-border bg-muted hover:bg-muted/80 text-muted-foreground rounded-none text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-widest font-mono"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {slide < 3 ? (
            <button
              type="button"
              onClick={nextSlide}
              className="px-5 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-none text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-widest font-mono"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <Link href="/register" className="w-auto">
              <button
                type="button"
                className="px-6 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-none text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-widest font-mono"
              >
                Deploy Engine <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: Premium Browser View Mockup (5 Columns) */}
      <div className="lg:col-span-5 min-h-[350px] lg:min-h-full bg-muted/50 relative overflow-hidden flex items-center justify-center p-4 rounded-none border border-border">
        
        {/* Browser shell container */}
        <div className="absolute top-6 bottom-[-40px] left-6 right-[-40px] rounded-none border border-border bg-card flex flex-col overflow-hidden transition-all duration-500 hover:border-primary/50 shadow-xl">
          
          {/* Header Bar */}
          <div className="bg-muted px-3.5 py-1.5 border-b border-border flex items-center justify-between shrink-0 select-none">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-none bg-border"></span>
              <span className="w-2 h-2 rounded-none bg-border"></span>
              <span className="w-2 h-2 rounded-none bg-border"></span>
            </div>
            <div className="bg-card border border-border px-2.5 py-0.5 rounded-none text-[7px] text-muted-foreground font-mono w-36 text-center truncate tracking-widest">
              {activeNiche.domain}
            </div>
            <div className="w-8"></div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-card relative overflow-hidden">
            {renderActiveMockup()}
          </div>
        </div>
      </div>
      
    </div>
  );
}
