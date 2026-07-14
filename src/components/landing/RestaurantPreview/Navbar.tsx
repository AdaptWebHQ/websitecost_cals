'use client';

import React from 'react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function RestaurantNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-white border-b border-slate-100 transition-colors duration-500">
      <span className="font-serif font-black text-slate-800 text-[10px] tracking-widest uppercase">
        GUSTO
      </span>
      <div className="flex items-center gap-3 text-[6px] font-bold text-[#1b6b4a] font-mono tracking-widest uppercase">
        <span>Menu</span>
        <span>Reserve</span>
      </div>
    </div>
  );
}
