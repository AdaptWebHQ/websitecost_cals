'use client';

import React from 'react';
import { Database } from 'lucide-react';

interface TablesProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SaaSTables({ isDesign, isGlow }: TablesProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-between px-3 bg-white rounded-xl border text-[5px] font-mono transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(21,34,56,0.45)] border-[#152238] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <span className="font-bold text-slate-700 flex items-center gap-1">
        <Database className="w-2 h-2 text-slate-400" />
        <span>Nodes logs:</span>
      </span>
      <span className="text-[#152238] font-bold font-mono">145K active</span>
    </div>
  );
}
