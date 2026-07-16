'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NicheImageSlideshow({ index }: { index: number }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevIndex, setPrevIndex] = useState(index);

  if (index !== prevIndex) {
    setPrevIndex(index);
    setCurrentSlide(0);
  }

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
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none border border-slate-800 rounded-none">
      
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
              ease: 'linear'
            }}
            className="w-full h-full object-contain drop-shadow-none rounded-none"
          />
        </motion.div>
      </AnimatePresence>

      {/* Luxury physical screen glass reflection glare overlay replaced with hard line */}
      <div className="absolute inset-0 border border-slate-800 pointer-events-none z-20" />
      
      {/* Floating promotional glassmorphic badges replaced with hard technical badges */}
      <div className="absolute top-3 left-3 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-none shadow-none z-30 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-none bg-white" />
        <span className="text-[7px] font-mono font-black uppercase tracking-widest text-slate-300">
          {promo.category}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-none shadow-none z-30">
        <span className="text-[7.5px] font-mono font-bold text-slate-300 flex items-center gap-1 uppercase tracking-widest">
          {promo.detail}
        </span>
      </div>
    </div>
  );
}
