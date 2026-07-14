'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, UserCheck } from 'lucide-react';

interface HeroProps {
  isDesign?: boolean;
}

export default function BusinessCardHero({ isDesign }: HeroProps) {
  return (
    <div className="w-full p-3 bg-slate-900 text-slate-100 flex flex-col items-center text-center rounded-xl border border-slate-850 shadow-xs">
      {/* Profile Image Avatar Placeholder */}
      <div className="relative">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-100 text-xs font-black shadow-md border border-slate-700">
          AC
        </div>
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full" />
      </div>

      <h4 className="mt-2 text-[10px] font-bold tracking-tight text-white leading-none">
        Alex Carter
      </h4>
      <p className="text-[6.5px] text-amber-500 font-mono tracking-wider uppercase font-semibold mt-1">
        Lead Product Designer
      </p>
      
      <p className="mt-1.5 text-[6.5px] text-slate-400 leading-relaxed max-w-[180px]">
        Designing high-fidelity UI ecosystems, minimal code structures, and sleek web experiences.
      </p>

      {/* Action Buttons */}
      <div className="mt-2.5 flex items-center gap-1.5 w-full max-w-[160px]">
        <motion.button
          animate={isDesign ? { scale: [1, 1.03, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[6px] font-bold rounded-md uppercase tracking-wider shadow-xs flex items-center justify-center gap-1 cursor-pointer"
        >
          <UserCheck className="w-2 h-2" /> Save Contact
        </motion.button>
        <button className="flex-1 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[6px] font-bold rounded-md uppercase tracking-wider border border-slate-750 flex items-center justify-center gap-1 cursor-pointer">
          <Mail className="w-2 h-2" /> Message
        </button>
      </div>
    </div>
  );
}
