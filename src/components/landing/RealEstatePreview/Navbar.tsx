'use client';

import React from 'react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function RealEstateNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-white border-b border-slate-100 transition-colors duration-500">
      <span className="font-sans font-black text-slate-800 text-[10px] tracking-widest uppercase">
        HAVEN
      </span>
      <div className="flex items-center gap-3 text-[6px] font-bold text-[#1e293b] font-mono tracking-widest uppercase">
        <span>Properties</span>
        <span>Agents</span>
      </div>
    </div>
  );
}
