'use client';

import React from 'react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function SalonNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-white border-b border-slate-100 transition-colors duration-500">
      <span className="font-serif font-black text-slate-800 text-[10px] tracking-widest uppercase">
        E L I X I R
      </span>
      <div className="flex items-center gap-3 text-[6px] font-bold text-[#5b6d82] font-mono tracking-widest uppercase">
        <span>Treatments</span>
        <span>Book Stylist</span>
      </div>
    </div>
  );
}
