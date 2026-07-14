'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreativePortfolioPreview from './creative-portfolio-preview';

interface NicheImageSlideshowProps {
  index: number;
}

export default function NicheImageSlideshow({ index }: NicheImageSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getImages = (idx: number) => {
    switch (idx) {
      case 0:
        return ['card_ui_aether.png'];
      case 1:
        return ['salon_ui_1.png', 'salon_ui_2.png'];
      case 2:
        return ['restaurant_ui_1.png', 'restaurant_ui_2.png'];
      case 3:
        return ['gym_ui_1.png', 'gym_ui_2.png'];
      case 4:
      default:
        return ['saas_ui_1.png', 'saas_ui_2.png'];
    }
  };

  const images = getImages(index);
  const activeImage = images[currentSlide] || images[0];

  // Auto-rotate slides every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Reset to first slide if index changes (i.e. user selects a different niche)
  useEffect(() => {
    setCurrentSlide(0);
  }, [index]);

  // Get promotional details for floating badges
  const getPromoTags = (idx: number) => {
    switch (idx) {
      case 0:
        return { category: 'Creative Showcase', detail: '⚡ 100% PageSpeed' };
      case 1:
        return { category: 'Luxury Salon UI', detail: '📅 Live Scheduling' };
      case 2:
        return { category: 'Gourmet Bistro UI', detail: '🍽️ Table Booking' };
      case 3:
        return { category: 'Athletic Gym UI', detail: '💪 Class Schedulers' };
      case 4:
      default:
        return { category: 'Enterprise SaaS Console', detail: '📊 Analytics Active' };
    }
  };

  const promo = getPromoTags(index);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#07090e] select-none">
      
      {/* Background ambient mesh glows for high-end studio aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[60px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-[65px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${activeImage}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full flex items-center justify-center p-2 z-10"
        >
          {/* Render the full mockup image with a subtle breathing zoom effect */}
          <motion.img
            src={`/images/niche-slides/${activeImage}`}
            alt={`Premium UI ${activeImage}`}
            animate={{ scale: [1, 1.025, 1] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Luxury physical screen glass reflection glare overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none z-20" />
      
      {/* Floating promotional glassmorphic badges */}
      <div className="absolute top-3 left-3 bg-[#0a0f1d]/75 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-30 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
        <span className="text-[7px] font-mono font-black uppercase tracking-widest text-primary-foreground/90">
          {promo.category}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-2.5 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-30">
        <span className="text-[7.5px] font-sans font-bold text-slate-100 flex items-center gap-1">
          {promo.detail}
        </span>
      </div>
    </div>
  );
}
