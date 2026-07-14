'use client';

import React from 'react';

interface BookingCardsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function GymBookingCards({ isDesign, isGlow }: BookingCardsProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-between px-3 bg-white rounded-xl border text-[5px] font-mono transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(27,107,74,0.45)] border-[#1b6b4a] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <span className="font-bold text-slate-700">Integrations:</span>
      <span className="text-[#1b6b4a] font-bold">UPI / Cards Gateway</span>
    </div>
  );
}
