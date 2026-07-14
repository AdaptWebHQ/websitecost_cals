'use client';

import React from 'react';

interface ScheduleProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function GymSchedule({ isDesign, isGlow }: ScheduleProps) {
  return (
    <div 
      className={`w-full h-full grid grid-cols-2 gap-1.5 p-1 rounded-xl border bg-white transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(27,107,74,0.45)] border-[#1b6b4a] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left font-mono">
        <span className="text-[5.5px] font-bold text-slate-800 block truncate">CrossFit WOD</span>
        <span className="text-[4.5px] text-slate-400 mt-0.5">08:00 AM</span>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1 flex flex-col justify-center text-left font-mono">
        <span className="text-[5.5px] font-bold text-slate-800 block truncate">Yoga Flow</span>
        <span className="text-[4.5px] text-slate-400 mt-0.5">17:30 PM</span>
      </div>
    </div>
  );
}
