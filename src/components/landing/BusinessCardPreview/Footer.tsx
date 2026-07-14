'use client';

import React from 'react';

interface FooterProps {
  isDesign?: boolean;
}

export default function BusinessCardFooter({ isDesign }: FooterProps) {
  return (
    <div className="w-full text-center text-[5.5px] text-slate-500 font-mono py-1.5 border-t border-slate-800 bg-slate-900">
      © 2026 ALEX CARTER. POWERED BY ADAPTWEB.
    </div>
  );
}
