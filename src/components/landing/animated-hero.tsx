'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Calculator } from 'lucide-react';
import Image from 'next/image';

const NICHES = [
  { id: 'corporate', name: 'Corporate & Agency', image: '/images/mockups/corporate.png' },
  { id: 'ecommerce', name: 'E-Commerce', image: '/images/mockups/ecommerce.png' },
  { id: 'saas', name: 'SaaS & Web App', image: '/images/mockups/saas.png' },
  { id: 'creative', name: 'Creative Portfolio', image: '/images/mockups/creative.png' },
  { id: 'realestate', name: 'Luxury Real Estate', image: '/images/mockups/real_estate.png' },
];

function PremiumNicheSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NICHES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[1000px] aspect-[16/10] sm:aspect-[16/9] mx-auto bg-card p-2 sm:p-4 border border-border rounded-none">
      <div className="relative w-full h-full overflow-hidden border border-border bg-muted rounded-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={NICHES[currentIndex].image}
              alt={NICHES[currentIndex].name}
              fill
              className="object-cover object-top opacity-90 rounded-none"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Technical Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-10 border-b border-border bg-card flex items-center justify-between px-4 rounded-none">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-border rounded-none" />
            <div className="w-2 h-2 bg-border rounded-none" />
            <div className="w-2 h-2 bg-border rounded-none" />
          </div>
          <div className="text-[10px] sm:text-xs text-foreground font-mono tracking-widest uppercase font-bold">
            {NICHES[currentIndex].name}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            0{currentIndex + 1} / 0{NICHES.length}
          </div>
        </div>
      </div>

      {/* Structural Base indicator */}
      <div className="flex justify-center gap-4 mt-4">
        {NICHES.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-px transition-all duration-300 ${idx === currentIndex ? 'w-12 bg-foreground' : 'w-4 bg-border'}`} 
          />
        ))}
      </div>
    </div>
  );
}

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } }
};

export default function AnimatedHero() {
  return (
    <section className="w-full flex flex-col items-center justify-center pt-24 pb-16 relative bg-background overflow-hidden">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-border" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-border" />
      </div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="w-full max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 px-6"
      >
        
        {/* Monospace System Label */}
        <motion.div
          variants={itemVars}
          className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground border border-border px-4 py-2 bg-card rounded-none"
        >
          Smart Estimation
        </motion.div>

        {/* High-Contrast Headline */}
        <motion.h1 
          variants={itemVars}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground m-0 leading-tight"
        >
          Estimate your website cost <br className="hidden sm:block" /> before you build.
        </motion.h1>

        {/* Technical Paragraph */}
        <motion.p
          variants={itemVars}
          className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed font-mono"
        >
          Get an accurate price for your project instantly. Choose your features, plan your budget, and launch your modern website with complete transparency.
        </motion.p>

        {/* Solid CTA */}
        <motion.div
          variants={itemVars}
          className="mt-10"
        >
          <Link href="/public/calculator">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-none border border-border h-14 px-10 text-sm font-bold tracking-widest uppercase transition-colors flex items-center shadow-none">
              <Calculator className="w-4 h-4 mr-3 text-primary-foreground" />
              Calculate My Cost
            </button>
          </Link>
        </motion.div>

        {/* 3D Model Showcase */}
        <motion.div
          variants={itemVars}
          className="w-full mt-24 mb-16 relative"
        >
          <PremiumNicheSlider />
        </motion.div>
      </motion.div>
    </section>
  );
}