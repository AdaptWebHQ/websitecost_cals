'use client';

import React from 'react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function GymNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-white border-b border-slate-100 transition-colors duration-500">
      <span className="font-mono italic font-black text-slate-800 text-[10px] tracking-tight uppercase">
        KINETIC
      </span>
      <div className="flex items-center gap-3 text-[6px] font-bold text-[#1b6b4a] font-mono tracking-widest uppercase">
        <span>Classes</span>
        <span>Schedule</span>
      </div>
    </div>
  );
}
