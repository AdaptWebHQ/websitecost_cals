'use client';

import React from 'react';

interface FiltersProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function RealEstateFilters({ isDesign, isGlow }: FiltersProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-between px-3 bg-white rounded-xl border text-[5px] font-mono transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(30,41,59,0.45)] border-[#1e293b] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <span className="font-bold text-slate-700">Verification:</span>
      <span className="text-emerald-600 font-bold">RERA Approved</span>
    </div>
  );
}
