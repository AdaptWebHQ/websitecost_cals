'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyCardsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function RealEstatePropertyCards({ isDesign, isGlow }: PropertyCardsProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(30,41,59,0.45)] border-[#1e293b] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[5px] font-extrabold text-slate-400 font-mono uppercase tracking-widest block truncate">
          Skyline Villa
        </span>
        <span className="text-[5.5px] font-black text-[#1e293b] font-mono">₹2.4 Cr</span>
      </div>
      <div className="flex items-center gap-1 mt-1 text-[4.5px] text-slate-400 font-mono">
        <MapPin className="w-2.5 h-2.5" />
        <span>Juhu, Mumbai</span>
      </div>
    </div>
  );
}
