'use client';

import React from 'react';

interface TrainerCardsProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function GymTrainerCards({ isDesign, isGlow }: TrainerCardsProps) {
  return (
    <div 
      className={`w-full h-full p-2 border bg-white rounded-xl shadow-xs flex flex-col justify-between text-left transition-all duration-300 ${
        isGlow ? 'shadow-[0_0_15px_rgba(27,107,74,0.45)] border-[#1b6b4a] scale-[1.02]' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[5px] font-extrabold text-slate-400 font-mono uppercase tracking-widest block">
          Coaching Staff
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div className="flex items-end justify-between mt-1 text-[5px] font-mono">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">Coach Dan</span>
          <span className="text-slate-400 mt-0.5">Strength Lead</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-emerald-100/30 text-emerald-700 font-bold">
          WOD
        </span>
      </div>
    </div>
  );
}
