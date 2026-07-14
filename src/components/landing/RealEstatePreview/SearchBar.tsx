'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function RealEstateSearchBar({ isDesign, isGlow }: SearchBarProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left font-mono transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(30,41,59,0.45)] border-[#1e293b] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-center text-[4.5px] text-slate-400 font-bold uppercase tracking-widest">
        <span>Location Search</span>
        <Search className="w-2 h-2 text-slate-400" />
      </div>
      <div className="flex gap-1.5 mt-0.5 text-[4.5px]">
        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">Mumbai</span>
        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">3 BHK</span>
      </div>
    </div>
  );
}
