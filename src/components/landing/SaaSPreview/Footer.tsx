'use client';

import React from 'react';

interface FooterProps {
  isDesign?: boolean;
}

export default function SaaSFooter({ isDesign }: FooterProps) {
  return (
    <div className="w-full h-full border-t border-slate-100 flex items-center justify-between text-[5px] font-mono text-slate-400 uppercase tracking-widest pt-1.5 px-1 bg-white">
      <span>Uptime 99.9% • Spec v1</span>
      <span>© 2026 Kubernetics</span>
    </div>
  );
}
