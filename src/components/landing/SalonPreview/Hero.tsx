'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  isDesign?: boolean;
}

export default function SalonHero({ isDesign }: HeroProps) {
  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-3 p-3 bg-white transition-colors duration-500">
      {/* Heading & CTA */}
      <div className="flex-1 flex flex-col justify-center text-left">
        <h4 className="text-[10px] font-black text-slate-800 leading-tight tracking-tight font-serif italic">
          Inner <span className="text-[#5b6d82] not-italic font-bold">Wellness</span> Redefined.
        </h4>
        <div className="mt-2.5">
          <motion.button 
            animate={isDesign ? { scale: [1, 1.05, 1], boxShadow: ['0 1px 3px rgba(0,0,0,0.05)', '0 4px 10px rgba(91,109,130,0.15)', '0 1px 3px rgba(0,0,0,0.05)'] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="px-3.5 py-1 bg-[#5b6d82] text-white text-[5.5px] font-bold rounded-full uppercase tracking-widest shadow-xs"
          >
            Book Therapy
          </motion.button>
        </div>
      </div>

      {/* Visual Cover */}
      <div className="w-[42%] rounded-xl bg-gradient-to-tr from-stone-100 to-amber-50 border border-slate-100 flex flex-col justify-between p-2 shadow-xs overflow-hidden">
        <div className="flex justify-between items-center text-[4px] font-mono text-slate-400 font-bold">
          <span>SERENE</span>
          <span>SPA & BODY</span>
        </div>
        <motion.div 
          animate={isDesign ? { scale: 1.03 } : { scale: 1.0 }}
          className="mx-auto w-9 h-9 rounded-full bg-white border border-[#5b6d82]/10 flex items-center justify-center shadow-xs"
        >
          <Sparkles className="w-4.5 h-4.5 text-[#5b6d82]" />
        </motion.div>
        <div className="text-[5px] font-mono text-slate-500 uppercase tracking-widest text-center font-bold">
          Restore Harmony
        </div>
      </div>
    </div>
  );
}
