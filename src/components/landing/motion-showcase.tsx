'use client';

import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Coins, Zap, ShieldCheck } from 'lucide-react';

const MotionShowcase = React.memo(function MotionShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for motion values
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates to 3D rotation degrees
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  // Handle cursor positioning relative to the card container dimensions
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Standardize to values between -0.5 and 0.5
    mouseX.set(clientX / width - 0.5);
    mouseY.set(clientY / height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-16 py-20 px-6 max-w-7xl mx-auto z-10 relative bg-slate-950">
      {/* Left Info Column */}
      <div className="flex-1 text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none border border-slate-800 bg-slate-900 text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          Ultra Precision Mechanics
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
          A Holographic Blueprint <br />
          For Your Web Budgets
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-mono">
          Hover and interact with our system core. Powered by standard Next.js actions and synchronized database parameters, AdaptWeb ensures absolute cost transparency with premium UI micro-transitions.
        </p>

        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lag-Free Calculations</h4>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Under 15ms compile speed.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Anti-Tamper Validation</h4>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Estimates verified server-side.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Premium Motion Graphics Column */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        
        {/* 3D Interactive Card Container */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="w-full max-w-[460px] aspect-[4/3] rounded-none border border-slate-800 bg-slate-900 p-6 relative cursor-pointer overflow-visible transition-colors duration-500 hover:border-slate-600 flex items-center justify-center shadow-none"
        >
          {/* Internal image component floating */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(50px)',
            }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {/* Holographic generated image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion_hero_graphic.png"
              alt="Holographic Project Estimation Dashboard"
              className="w-[92%] h-[92%] object-contain rounded-none select-none pointer-events-none opacity-80"
            />
          </motion.div>

          {/* Floating froster Glass Badges (Parallax layer) */}
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
            style={{
              transform: 'translateZ(85px)',
            }}
            className="absolute top-4 left-4 sm:-left-6 px-4 py-2.5 rounded-none border border-slate-800 bg-slate-950 flex items-center gap-3 pointer-events-none select-none"
          >
            <div className="w-8 h-8 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
              <Coins className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">Automated Quotes</span>
              <span className="text-[8px] text-slate-500 mt-1 font-mono uppercase">INR 0 Error Tolerance</span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
              delay: 1,
            }}
            style={{
              transform: 'translateZ(95px)',
            }}
            className="absolute bottom-6 right-4 sm:-right-8 px-4 py-2.5 rounded-none border border-slate-800 bg-slate-950 flex items-center gap-3 pointer-events-none select-none"
          >
            <div className="w-8 h-8 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">Dynamic Pricing</span>
              <span className="text-[8px] text-slate-500 mt-1 font-mono uppercase">Auto-Synced Parameters</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
});

export default MotionShowcase;
