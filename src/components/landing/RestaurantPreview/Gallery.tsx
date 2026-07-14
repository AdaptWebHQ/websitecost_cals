'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GalleryProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function RestaurantGallery({ isDesign, isGlow }: GalleryProps) {
  return (
    <div 
      className={`w-full h-full grid grid-cols-2 gap-1.5 p-1 rounded-xl border bg-white transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(27,107,74,0.45)] border-[#1b6b4a] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <motion.div 
        animate={isDesign ? { y: [-1, 1, -1] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-slate-50 border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left"
      >
        <span className="text-[5.5px] font-bold text-slate-800 block truncate">Truffle Pasta</span>
        <span className="text-[4.5px] text-slate-400 font-mono mt-0.5">₹450</span>
      </motion.div>
      <motion.div 
        animate={isDesign ? { y: [1, -1, 1] } : {}}
        transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="bg-slate-50 border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left"
      >
        <span className="text-[5.5px] font-bold text-slate-800 block truncate">Caprese Salad</span>
        <span className="text-[4.5px] text-slate-400 font-mono mt-0.5">₹380</span>
      </motion.div>
    </div>
  );
}
