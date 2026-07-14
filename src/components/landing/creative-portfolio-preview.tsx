'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Github, Twitter, Linkedin, QrCode } from 'lucide-react';

export default function CreativePortfolioPreview() {
  return (
    <div className="w-full h-full bg-[#080b11] text-slate-100 font-sans p-4 flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Premium Background Mesh Glows */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-amber-500/10 blur-[40px] pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black tracking-widest text-amber-400 font-mono">AC / STUDIO</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7px] font-medium tracking-wide text-slate-400">AVAILABLE FOR HIRE</span>
        </div>
      </div>

      {/* Hero Body */}
      <div className="my-2 relative z-10">
        <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[6px] font-bold text-amber-400 tracking-wider uppercase mb-1">
          <Sparkles className="w-2 h-2" />
          Creative Director
        </div>
        <h1 className="text-sm font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          ALEX CARTER
        </h1>
        <p className="text-[8px] text-slate-400 max-w-[200px] mt-0.5 leading-snug">
          Crafting luxury digital interfaces and immersive portfolio websites.
        </p>
      </div>

      {/* Bento Showcase Grid */}
      <div className="grid grid-cols-12 gap-2 my-2 relative z-10 flex-1 overflow-hidden">
        
        {/* Bento 1: Featured Work (7 Cols) */}
        <div className="col-span-7 rounded-xl bg-white/[0.02] border border-white/5 p-2 flex flex-col justify-between hover:bg-white/[0.04] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[6px] font-mono text-slate-500 uppercase tracking-widest">Selected Work</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="h-10 rounded-lg bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
              <span className="text-[8px] font-semibold text-indigo-200 tracking-wider">AURA v1.0</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[7px] font-bold text-slate-300">UX Design & Dev</span>
              <span className="text-[6px] font-mono text-slate-500">2026</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Services / Stack (5 Cols) */}
        <div className="col-span-5 rounded-xl bg-white/[0.02] border border-white/5 p-2 flex flex-col justify-between">
          <span className="text-[6px] font-mono text-slate-500 uppercase tracking-widest block">Expertise</span>
          <div className="flex flex-col gap-1 mt-1">
            <div className="bg-white/5 px-1.5 py-0.5 rounded text-[6px] font-semibold text-slate-300 border border-white/5">UI/UX Strategy</div>
            <div className="bg-white/5 px-1.5 py-0.5 rounded text-[6px] font-semibold text-slate-300 border border-white/5">React & Next.js</div>
            <div className="bg-white/5 px-1.5 py-0.5 rounded text-[6px] font-semibold text-slate-300 border border-white/5">Creative Motion</div>
          </div>
        </div>

        {/* Bento 3: Quick Contacts / Sharing */}
        <div className="col-span-6 rounded-xl bg-white/[0.02] border border-white/5 p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <QrCode className="w-3 h-3 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-slate-200 leading-none">VCard Contact</span>
              <span className="text-[5.5px] text-slate-500 mt-0.5">Scan to Save Details</span>
            </div>
          </div>
        </div>

        {/* Bento 4: Social Accounts */}
        <div className="col-span-6 rounded-xl bg-white/[0.02] border border-white/5 p-2 flex items-center justify-center gap-2">
          <span className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Github className="w-2.5 h-2.5 text-slate-400" />
          </span>
          <span className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Twitter className="w-2.5 h-2.5 text-slate-400" />
          </span>
          <span className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Linkedin className="w-2.5 h-2.5 text-slate-400" />
          </span>
        </div>

      </div>

      {/* Footer credits */}
      <div className="flex justify-between items-center border-t border-white/5 pt-1.5 relative z-10">
        <span className="text-[6px] font-mono text-slate-500">© 2026 ALEX CARTER. ALL RIGHTS RESERVED.</span>
        <span className="text-[6px] font-mono text-slate-400 hover:text-amber-400 transition-colors">GO TO MAIN PAGE →</span>
      </div>

    </div>
  );
}
