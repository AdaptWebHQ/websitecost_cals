'use client';

import React from 'react';

interface AppointmentFormProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function SalonAppointmentForm({ isDesign, isGlow }: AppointmentFormProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-between px-3 bg-white rounded-xl border text-[5px] transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(91,109,130,0.45)] border-[#5b6d82] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <span className="font-bold text-slate-700 font-mono">Selected slot:</span>
      <span className="text-[#5b6d82] font-bold font-mono">July 14 • 14:00 PM</span>
    </div>
  );
}
