'use client';

import React from 'react';

interface StylistCardsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SalonStylistCards({ isDesign, isGlow }: StylistCardsProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(91,109,130,0.45)] border-[#5b6d82] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[5px] font-extrabold text-slate-400 font-mono uppercase tracking-widest block">
          Therapists
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      </div>
      <div className="flex items-end justify-between mt-1">
        <div className="flex flex-col">
          <span className="text-[5.5px] font-bold text-slate-800 font-serif">Elena R.</span>
          <span className="text-[4.5px] text-slate-400 font-mono mt-0.5">Therapy Lead</span>
        </div>
        <span className="px-1.5 py-0.5 rounded-full text-[4.5px] font-bold bg-[#5b6d82]/10 text-[#5b6d82] font-mono">
          Avail
        </span>
      </div>
    </div>
  );
}
