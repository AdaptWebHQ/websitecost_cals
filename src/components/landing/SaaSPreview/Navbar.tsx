'use client';

import React from 'react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function SaaSNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-white border-b border-slate-100 transition-colors duration-500">
      <span className="font-mono font-bold text-slate-800 text-[9px] tracking-tight uppercase">
        KUBERNETICS
      </span>
      <div className="flex items-center gap-3 text-[6px] font-bold text-[#152238] font-mono tracking-widest uppercase">
        <span>Logs</span>
        <span>Specs</span>
      </div>
    </div>
  );
}
