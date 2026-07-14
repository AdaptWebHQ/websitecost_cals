'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  isDesign?: boolean;
}

export default function SaaSHero({ isDesign }: HeroProps) {
  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-3 p-3 bg-white transition-colors duration-500">
      {/* Heading & CTA */}
      <div className="flex-1 flex flex-col justify-center text-left">
        <h4 className="text-[10px] font-black text-slate-800 leading-tight tracking-tight uppercase font-mono">
          Scale Global <span className="text-[#152238] font-bold">Clusters</span>.
        </h4>
        <div className="mt-2.5">
          <motion.button 
            animate={isDesign ? { scale: [1, 1.05, 1], boxShadow: ['0 1px 3px rgba(0,0,0,0.05)', '0 4px 10px rgba(21,34,56,0.15)', '0 1px 3px rgba(0,0,0,0.05)'] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="px-3.5 py-1 bg-[#152238] text-white text-[5.5px] font-bold rounded-lg uppercase tracking-widest shadow-xs font-mono"
          >
            Deploy Stack
          </motion.button>
        </div>
      </div>

      {/* Visual Cover */}
      <div className="w-[42%] rounded-xl bg-gradient-to-tr from-slate-900 to-zinc-950 border border-slate-800 flex flex-col justify-between p-2 shadow-xs overflow-hidden text-slate-400">
        <div className="flex justify-between items-center text-[4.5px] font-mono text-slate-500 font-bold">
          <span>CLOUD CONTROLLERS</span>
          <span>EST RATE</span>
        </div>
        <motion.div 
          animate={isDesign ? { scale: 1.05 } : { scale: 1.0 }}
          className="mx-auto w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xs"
        >
          <Cpu className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
        </motion.div>
        <div className="text-[5px] font-mono text-cyan-400 uppercase tracking-widest text-center font-bold">
          Hyper-Scale Active
        </div>
      </div>
    </div>
  );
}
