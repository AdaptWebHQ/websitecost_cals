'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface NavbarProps {
  isDesign?: boolean;
}

export default function BusinessCardNavbar({ isDesign }: NavbarProps) {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 bg-slate-900 border-b border-slate-800/60 transition-colors duration-500">
      <span className="font-sans font-black text-slate-100 text-[10px] tracking-widest uppercase">
        A. CARTER
      </span>
      <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
