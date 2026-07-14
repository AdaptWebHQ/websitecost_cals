'use client';

import React from 'react';
import { QrCode, Scan } from 'lucide-react';

interface QRCodeProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function BusinessCardQRCode({ isDesign, isGlow }: QRCodeProps) {
  return (
    <div className={`w-full p-2.5 bg-slate-900 border rounded-lg flex items-center gap-3 transition-all ${
      isGlow ? 'border-amber-500/40 shadow-xs' : 'border-slate-800'
    }`}>
      {/* Visual QR Code Represented as grid/icon */}
      <div className="relative w-8 h-8 rounded bg-white flex items-center justify-center p-0.5 shrink-0 border border-slate-700">
        <QrCode className="w-7 h-7 text-slate-950" />
        <Scan className="absolute inset-0 w-8 h-8 text-amber-500 opacity-60 animate-pulse pointer-events-none" />
      </div>
      
      <div className="text-left">
        <h5 className="text-[7px] font-bold text-slate-200">Share Contact</h5>
        <p className="text-[5.5px] text-slate-400 font-mono mt-0.5 leading-tight">
          Scan QR to save Alex Carter's corporate vCard instantly.
        </p>
      </div>
    </div>
  );
}
