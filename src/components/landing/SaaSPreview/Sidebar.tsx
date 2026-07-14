'use client';

import React from 'react';

interface SidebarProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SaaSSidebar({ isDesign, isGlow }: SidebarProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left font-mono transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(21,34,56,0.45)] border-[#152238] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <span className="text-[4.5px] text-slate-400 uppercase font-bold tracking-widest block">Navigation Deck</span>
      <div className="flex gap-1.5 mt-0.5 text-[4.5px]">
        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">API Key</span>
        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">Metrics</span>
      </div>
    </div>
  );
}
