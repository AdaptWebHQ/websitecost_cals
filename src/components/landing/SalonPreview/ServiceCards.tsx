'use client';

import React from 'react';

interface ServiceCardsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SalonServiceCards({ isDesign, isGlow }: ServiceCardsProps) {
  return (
    <div 
      className={`w-full h-full grid grid-cols-2 gap-1.5 p-1 rounded-xl border bg-white transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(91,109,130,0.45)] border-[#5b6d82] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="bg-[#faf8f5] border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left">
        <span className="text-[5.5px] font-bold text-slate-800 block truncate font-serif">Aromatherapy</span>
        <span className="text-[4.5px] text-[#5b6d82] font-mono mt-0.5 font-bold">₹2,500</span>
      </div>
      <div className="bg-[#faf8f5] border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left">
        <span className="text-[5.5px] font-bold text-slate-800 block truncate font-serif">Mineral mud</span>
        <span className="text-[4.5px] text-[#5b6d82] font-mono mt-0.5 font-bold">₹1,800</span>
      </div>
    </div>
  );
}
