'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const NICHE_IMAGES: Record<number, string[]> = {
  0: ['/images/niche-slides/card_ui_aether.png'],
  1: ['/images/niche-slides/salon_ui_1.png', '/images/niche-slides/salon_ui_2.png'],
  2: ['/images/niche-slides/restaurant_ui_1.png', '/images/niche-slides/restaurant_ui_2.png'],
  3: ['/images/niche-slides/gym_ui_1.png', '/images/niche-slides/gym_ui_2.png'],
  4: ['/images/niche-slides/saas_ui_1.png', '/images/niche-slides/saas_ui_2.png'],
};

const NICHE_LABELS: Record<number, string> = {
  0: 'Digital Business Card',
  1: 'Luxury Salon UI',
  2: 'Gourmet Bistro UI',
  3: 'Athletic Gym UI',
  4: 'Enterprise SaaS Console',
};

export default function NicheImageSlideshow({ index }: { index: number }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevIndex, setPrevIndex] = useState(index);

  // Reset slide when niche changes
  if (index !== prevIndex) {
    setPrevIndex(index);
    setCurrentSlide(0);
  }

  const images = NICHE_IMAGES[index] || NICHE_IMAGES[0];
  const label = NICHE_LABELS[index] || 'Preview';

  // Auto-rotate slides
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length, index]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted select-none rounded-sm">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentSlide] || images[0]}
            alt={`${label} preview`}
            fill
            className="object-contain p-1"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Category label */}
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border border-border px-2 py-0.5 rounded-md z-10">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      {/* Slide dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-4 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
