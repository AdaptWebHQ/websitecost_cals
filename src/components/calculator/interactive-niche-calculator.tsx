'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
  Mail,
  Calendar,
  CreditCard,
  BookOpen,
  Bot,
  MessageSquare,
  PlayCircle
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

// --- Premium Animation Variants ---
const slideVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0, duration: 0.6 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { type: 'spring', bounce: 0, duration: 0.4 },
  }),
};

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: 'spring', bounce: 0, duration: 0.5 } 
  },
};

export default function InteractiveNicheCalculator() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
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
  
  // Autoplay states
  const [isInteracting, setIsInteracting] = useState(false);
  const [glowState, setGlowState] = useState(false);

  // Background glow timer
  useEffect(() => {
    const timer = setInterval(() => setGlowState((prev) => !prev), 3000);
    return () => clearInterval(timer);
  }, []);

  // --- Automated Showcase Cycle ---
  useEffect(() => {
    if (isInteracting) return;

    const autoplayTimer = setInterval(() => {
      setSlide((currentSlide) => {
        if (currentSlide < 3) {
          // Move to next step
          setDirection(1);
          return currentSlide + 1;
        } else {
          // Reached the end: Loop back to step 1 and increment the package
          setDirection(1);
          setNicheIdx((currentNiche) => {
            const nextNiche = (currentNiche + 1) % NICHES.length;
            // Sync the pages slider with the new package's baseline
            setPages(NICHES[nextNiche].pagesIncluded);
            return nextNiche;
          });
          return 0;
        }
      });
    }, 4000); // 4 seconds per step. Adjust this speed if you want it faster/slower.

    return () => clearInterval(autoplayTimer);
  }, [isInteracting]);

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
    if (slide < 3) {
      setDirection(1);
      setSlide(slide + 1);
    }
  };

  const prevSlide = () => {
    if (slide > 0) {
      setDirection(-1);
      setSlide(slide - 1);
    }
  };

  const renderActiveMockup = () => {
    return <NicheImageSlideshow index={nicheIdx} />;
  };

  return (
    <div 
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px] text-left relative"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
    >
      {/* Autoplay Indicator Pill (Visible only when automating) */}
      <AnimatePresence>
        {!isInteracting && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-12 right-0 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2"
          >
            <PlayCircle className="w-3.5 h-3.5 animate-pulse" />
            Live Demo Running
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Interactive Controls */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-card border border-border rounded-lg relative overflow-hidden">
        
        {/* Top Progress bar and Header */}
        <div className="w-full">
          <div className="flex justify-between items-center text-xs mb-3 font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>Configure Project</span>
            <span className="text-foreground font-black">Segment 0{slide + 1} // 04</span>
          </div>
          
          {/* Smooth Progress Bar */}
          <div className="w-full h-1 bg-muted flex rounded-none overflow-hidden mb-6 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: '25%' }}
              animate={{ width: `${((slide + 1) / 4) * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
            />
          </div>

          {/* Slides switcher */}
          <AnimatePresence mode="wait" custom={direction}>
            {slide === 0 && (
              <motion.div
                key="slide-niche"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Select Core Architecture</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Select a starting theme package corresponding to your project niche.</p>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin"
                >
                  {NICHES.map((niche, idx) => (
                    <motion.div
                      variants={staggerItem}
                      key={niche.id}
                      onClick={() => handleNicheChange(idx)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 ${
                        nicheIdx === idx 
                          ? 'border-primary bg-muted/50' 
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-none border flex items-center justify-center transition-colors duration-300 ${
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
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="w-4 h-4 rounded-none bg-primary flex items-center justify-center"
                          >
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {slide === 1 && (
              <motion.div
                key="slide-scope"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Determine Scope & Speed</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Specify total page outputs and customize build delivery timeline speed.</p>
                </div>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                  {/* Page Count Slider */}
                  <motion.div variants={staggerItem} className="space-y-3 bg-muted/30 border border-border p-4 rounded-none">
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
                        <motion.span 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-foreground font-bold"
                        >
                          +{additionalPages} extra pages (+₹{(additionalPages * 2000).toLocaleString('en-IN')})
                        </motion.span>
                      ) : (
                        <span>No extra page charges</span>
                      )}
                    </div>
                  </motion.div>

                  {/* Rush Delivery Speed */}
                  <motion.div 
                    variants={staggerItem}
                    onClick={() => setRushDelivery(!rushDelivery)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-4 rounded-none border flex items-center justify-between cursor-pointer transition-colors duration-300 ${
                      rushDelivery 
                        ? 'border-primary bg-muted/50' 
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-none border flex items-center justify-center transition-colors duration-300 ${
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
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {slide === 2 && (
              <motion.div
                key="slide-features"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Integration Modules</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Select optional features to integrate into your baseline application framework.</p>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin"
                >
                  {INTEGRATIONS.map((feat) => (
                    <motion.div
                      variants={staggerItem}
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-none border flex flex-col justify-between text-left cursor-pointer transition-colors duration-300 ${
                        selectedFeatures[feat.id]
                          ? 'border-primary bg-muted/50'
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-none border flex items-center justify-center transition-colors duration-300 ${
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
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {slide === 3 && (
              <motion.div
                key="slide-results"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-none uppercase">Quotation Cost Invoice</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">Detailed pricing report matching active project configuration selections.</p>
                </div>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                  {/* Pricing Table Itemized */}
                  <motion.div variants={staggerItem} className="space-y-2.5 border border-border p-4 bg-muted/30 rounded-none text-xs font-mono">
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
                  </motion.div>

                  <motion.div variants={staggerItem} className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/30 border border-border px-3 py-2 rounded-none">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>These prices represent approximate cost indices based on AdaptWeb benchmarks.</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls: Back / Next */}
        <div className="mt-8 pt-4 border-t border-border flex items-center justify-between w-full relative z-10">
          <motion.button
            whileHover={{ scale: slide === 0 ? 1 : 1.02 }}
            whileTap={{ scale: slide === 0 ? 1 : 0.98 }}
            type="button"
            onClick={prevSlide}
            disabled={slide === 0}
            className="px-4 py-2 border border-border bg-muted hover:bg-muted/80 text-muted-foreground rounded-none text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-widest font-mono"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </motion.button>

          {slide < 3 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={nextSlide}
              className="px-5 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-none text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-widest font-mono"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <Link href="/register" className="w-auto block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-6 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-none text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-widest font-mono relative overflow-hidden group"
              >
                <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out_forwards]" />
                Deploy Engine <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: Premium Browser View Mockup */}
      <div className="lg:col-span-5 min-h-[350px] lg:min-h-full bg-muted/30 relative overflow-hidden flex items-center justify-center p-4 rounded-lg border border-border">
        
        {/* Browser shell container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8, delay: 0.2 }}
          className="absolute inset-3 rounded-lg border border-border bg-card flex flex-col overflow-hidden shadow-lg"
        >
          {/* Header Bar */}
          <div className="bg-muted px-3.5 py-1.5 border-b border-border flex items-center justify-between shrink-0 select-none">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-none bg-border transition-colors hover:bg-red-400"></span>
              <span className="w-2 h-2 rounded-none bg-border transition-colors hover:bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-none bg-border transition-colors hover:bg-green-400"></span>
            </div>
            <motion.div 
              key={activeNiche.domain}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border px-2.5 py-0.5 rounded-none text-[7px] text-muted-foreground font-mono w-36 text-center truncate tracking-widest"
            >
              {activeNiche.domain}
            </motion.div>
            <div className="w-8"></div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-card relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={nicheIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {renderActiveMockup()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
}