'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SaaSCharts({ isDesign, isGlow }: ChartsProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(21,34,56,0.45)] border-[#152238] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[4px] font-black text-slate-400 font-mono uppercase tracking-widest block">Metrics Load</span>
        <TrendingUp className="w-2.5 h-2.5 text-cyan-500" />
      </div>
      <div className="h-6 w-full relative mt-0.5">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="0" y1="12" x2="100%" y2="12" stroke="#f1f5f9" strokeWidth="0.5" />
          <motion.path
            d="M0 24 L10 18 L20 22 L35 8 L48 16 L65 5 L80 18 L95 6"
            fill="none"
            stroke="#152238"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isDesign ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </div>
  );
}
