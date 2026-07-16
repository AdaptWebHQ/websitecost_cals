'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Layers, Cpu, Code, ShieldCheck, Sparkles } from 'lucide-react';

export default function ScrollRevealShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Bind scroll progression to the 250vh track height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track active narrative text block based on scroll progress
  const [activeSlide, setActiveSlide] = useState(0);
  const [tickerPrice, setTickerPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Manage active slide index
      if (latest < 0.25) {
        setActiveSlide(0);
      } else if (latest < 0.55) {
        setActiveSlide(1);
      } else if (latest < 0.82) {
        setActiveSlide(2);
      } else {
        setActiveSlide(3);
      }

      // Handle the luxury price counter roll-up on the laser scan sweep (0.55 to 0.75)
      if (latest >= 0.55 && latest <= 0.78) {
        const factor = (latest - 0.55) / (0.78 - 0.55);
        setTickerPrice(Math.floor(factor * 49999));
      } else if (latest > 0.78) {
        setTickerPrice(49999);
      } else {
        setTickerPrice(0);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // -------------------------------------------------------------
  // Motion Graph Animations - Handcrafted keyframes using useTransform
  // -------------------------------------------------------------

  // Volumetric background ambient lighting
  const bgGlowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.3, 0.5, 0.6, 0.2]);

  // Shot 1: The Glass Concept Sphere
  const sphereOpacity = useTransform(scrollYProgress, [0, 0.18, 0.24], [1, 1, 0]);
  const sphereScale = useTransform(scrollYProgress, [0, 0.18, 0.24], [0.9, 1.15, 0.4]);
  const sphereY = useTransform(scrollYProgress, [0, 0.24], [0, -50]);

  // Shot 2 & 3: The Origami Aluminum Grid & Frosted UI Cards
  const gridOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.78, 0.84], [0, 1, 1, 0]);
  const gridScale = useTransform(scrollYProgress, [0.18, 0.25, 0.78], [0.6, 1.0, 0.9]);
  const gridRotateX = useTransform(scrollYProgress, [0.20, 0.5, 0.78], [25, 10, 12]);
  const gridRotateY = useTransform(scrollYProgress, [0.20, 0.5, 0.78], [-18, -4, -2]);
  const pathLength = useTransform(scrollYProgress, [0.22, 0.38], [0, 1]);

  // Frosted UI plates assembly heights (Layering)
  const block1Y = useTransform(scrollYProgress, [0.35, 0.50], [100, 0]);
  const block2Y = useTransform(scrollYProgress, [0.38, 0.53], [120, 0]);
  const block3Y = useTransform(scrollYProgress, [0.42, 0.58], [140, 0]);
  const blockOpacity = useTransform(scrollYProgress, [0.32, 0.38, 0.78, 0.84], [0, 1, 1, 0]);

  // Shot 4: Laser Sweep Bar
  const laserX = useTransform(scrollYProgress, [0.55, 0.76], ["-10%", "110%"]);
  const laserOpacity = useTransform(scrollYProgress, [0.53, 0.56, 0.75, 0.78], [0, 1, 1, 0]);

  // Shot 5: Stamped Proposal Folder
  const docOpacity = useTransform(scrollYProgress, [0.78, 0.84, 0.92, 0.96], [0, 1, 1, 0]);
  const docScale = useTransform(scrollYProgress, [0.78, 0.84, 0.92], [0.7, 1.0, 0.95]);
  const docRotateX = useTransform(scrollYProgress, [0.78, 0.86], [22, 8]);
  const docY = useTransform(scrollYProgress, [0.78, 0.84], [80, 0]);

  // Shot 6: Final Convergence into Logo
  const logoOpacity = useTransform(scrollYProgress, [0.92, 0.96], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.92, 0.96, 1], [0.6, 1.0, 1.05]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[250vh] bg-zinc-950 border-t border-zinc-900 z-20 overflow-visible"
    >
      {/* Sticky Film viewport container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center">
        
        {/* Soft Volumetric Background Light Blobs */}
        <motion.div 
          style={{ opacity: bgGlowOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[160px] animate-pulse" style={{ animationDuration: '12s' }} />
        </motion.div>

        {/* Minimal Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Cinematic Layout Track */}
        <div className="max-w-7xl mx-auto px-6 w-full h-[85%] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          
          {/* Left Column: Premium Editorial Narratives */}
          <div className="lg:col-span-5 h-[360px] relative flex flex-col justify-center z-25 text-left pl-4">
            <AnimatePresence mode="wait">
              {activeSlide === 0 && (
                <motion.div 
                  key="slide-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                    01 • The Conception
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
                    A Business Idea <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500">
                      Is Born.
                    </span>
                  </h3>
                  <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-sm font-medium">
                    Every digital masterpiece begins as a raw concept node, floating in translucent architectural glass space.
                  </p>
                </motion.div>
              )}

              {activeSlide === 1 && (
                <motion.div 
                  key="slide-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                    02 • Craftsmanship
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
                    Unfolding the <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500">
                      Structural Grid.
                    </span>
                  </h3>
                  <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-sm font-medium">
                    Layout structures materialize. Frosted acrylic components emerge along coordinate paths, building responsiveness.
                  </p>
                </motion.div>
              )}

              {activeSlide === 2 && (
                <motion.div 
                  key="slide-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase mb-3 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-teal-400" />
                    03 • The Evaluation
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
                    Intelligent <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
                      Budget Estimation.
                    </span>
                  </h3>
                  <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-sm font-medium">
                    Laser-precise calculations sweep through the workspace, analyzing vectors and resolving custom costs in real-time.
                  </p>
                </motion.div>
              )}

              {activeSlide === 3 && (
                <motion.div 
                  key="slide-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    04 • The Signature
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
                    Premium Signed <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      Quote Issued.
                    </span>
                  </h3>
                  <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-sm font-medium">
                    Everything compresses into an elegant signed proposal sheet. Craftsmanship locked. Estimates guaranteed.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: 3D Motion Graphics Canvas Stage */}
          <div className="lg:col-span-7 h-[500px] lg:h-full relative flex items-center justify-center [perspective:1800px] z-10 select-none">
            
            {/* -------------------------------------------------------------
                SHOT 01: Concept Seed Floating Liquid Glass Sphere
                ------------------------------------------------------------- */}
            <motion.div
              style={{
                opacity: sphereOpacity,
                scale: sphereScale,
                y: sphereY,
                transformStyle: "preserve-3d"
              }}
              className="absolute w-72 h-72 flex items-center justify-center"
            >
              {/* Glass sphere shell */}
              <div className="w-full h-full rounded-full border border-white/20 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-[14px] shadow-[inset_0_4px_30px_rgba(255,255,255,0.15),0_15px_45px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                {/* 3D Spinning inner wireframe node */}
                <motion.div
                  animate={{ rotateY: 360, rotateX: 180 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border border-dashed border-amber-500/60 rounded-full flex items-center justify-center"
                >
                  <div className="w-12 h-12 border border-amber-500 rounded-full flex items-center justify-center bg-amber-500/10">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* -------------------------------------------------------------
                SHOT 02 & 03: The Folding Origami Aluminum Grid & Frosted UI Plates
                ------------------------------------------------------------- */}
            <motion.div
              style={{
                opacity: gridOpacity,
                scale: gridScale,
                rotateX: gridRotateX,
                rotateY: gridRotateY,
                transformStyle: "preserve-3d"
              }}
              className="absolute w-full max-w-[480px] aspect-[1.3] flex flex-col justify-between overflow-visible relative"
            >
              {/* Unfolding Vector Grid (using inline SVG lines driven by scroll) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Outer frame */}
                <motion.rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" style={{ pathLength }} />
                
                {/* Matrix cross sections */}
                <motion.line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" style={{ pathLength }} />
                <motion.line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" style={{ pathLength }} />
                <motion.line x1="75" y1="0" x2="75" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" style={{ pathLength }} />
                
                <motion.line x1="0" y1="33" x2="100" y2="33" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" style={{ pathLength }} />
                <motion.line x1="0" y1="66" x2="100" y2="66" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" style={{ pathLength }} />
              </svg>

              {/* Frosted layout cards assembly (Layered Z heights) */}
              <div className="w-full h-full flex flex-col justify-between p-6 relative" style={{ transformStyle: "preserve-3d" }}>
                
                {/* UI Plate 1: Navbar Block */}
                <motion.div
                  style={{
                    y: block1Y,
                    opacity: blockOpacity,
                    transform: "translateZ(30px)"
                  }}
                  className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-3 flex justify-between items-center shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    <span className="w-10 h-1.5 rounded bg-zinc-700"></span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-6 h-1 rounded bg-zinc-700"></span>
                    <span className="w-6 h-1 rounded bg-zinc-700"></span>
                  </div>
                </motion.div>

                {/* UI Plate 2: Hero Canvas (Editorial visual element) */}
                <motion.div
                  style={{
                    y: block2Y,
                    opacity: blockOpacity,
                    transform: "translateZ(60px)"
                  }}
                  className="w-full h-36 rounded-2xl border border-white/10 bg-gradient-to-tr from-white/[0.06] to-white/[0.02] backdrop-blur-md p-4 flex flex-col justify-between shadow-xl my-4 relative overflow-hidden"
                >
                  {/* Glowing core highlight inside the canvas */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-2 relative z-10">
                    <div className="h-3 w-1/3 bg-primary/20 rounded"></div>
                    <div className="h-5 w-4/5 bg-zinc-800/40 border border-white/5 rounded-md flex items-center pl-2.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
                      <span className="text-[7.5px] font-mono text-zinc-400 font-bold uppercase tracking-wider">AdaptWeb Premium Web Design</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center relative z-10 mt-4 pt-3 border-t border-white/5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[5px] text-zinc-500 font-mono">ESTIMATION INDEX</span>
                      <span className="text-[12px] font-black text-white font-mono">
                        ₹{tickerPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-5 w-14 rounded-lg bg-zinc-800/60 border border-white/10 flex items-center justify-center text-[5.5px] font-mono font-bold text-zinc-400">
                      Processing
                    </div>
                  </div>
                </motion.div>

                {/* UI Plate 3: Features Block Row */}
                <motion.div
                  style={{
                    y: block3Y,
                    opacity: blockOpacity,
                    transform: "translateZ(90px)"
                  }}
                  className="w-full h-14 flex gap-4"
                >
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between shadow-lg">
                    <span className="h-1 w-6 bg-zinc-700 rounded"></span>
                    <span className="h-2 w-full bg-zinc-800/50 rounded"></span>
                  </div>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-2.5 flex flex-col justify-between shadow-lg">
                    <span className="h-1 w-6 bg-zinc-700 rounded"></span>
                    <span className="h-2 w-full bg-zinc-800/50 rounded"></span>
                  </div>
                </motion.div>

              </div>

              {/* -------------------------------------------------------------
                  SHOT 04: The Laser Sweep Bar (Drives structural illumination)
                  ------------------------------------------------------------- */}
              <motion.div
                style={{
                  left: laserX,
                  opacity: laserOpacity,
                  transformStyle: "preserve-3d",
                  transform: "translateZ(105px)"
                }}
                className="absolute top-[-5%] bottom-[-5%] w-1 bg-gradient-to-b from-transparent via-teal-400 to-transparent shadow-[0_0_20px_#2dd4bf,0_0_40px_#2dd4bf] z-40 pointer-events-none"
              />
            </motion.div>

            {/* -------------------------------------------------------------
                SHOT 05: Stamped Paper-White Proposal Folder
                ------------------------------------------------------------- */}
            <motion.div
              style={{
                opacity: docOpacity,
                scale: docScale,
                rotateX: docRotateX,
                y: docY,
                transformStyle: "preserve-3d"
              }}
              className="absolute w-80 aspect-[1.4] rounded-2xl border border-white/80 bg-zinc-50 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 text-zinc-900 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top alignment details */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[7.5px] font-mono tracking-widest text-zinc-400 font-bold uppercase">SECURED QUOTATION</span>
                  <h4 className="text-[11px] font-black tracking-tight text-zinc-800 font-mono">ESTIMATE_REPORT_ADAPTWEB.PDF</h4>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300">
                  <span className="text-[7.5px] font-black text-zinc-700">A</span>
                </div>
              </div>

              {/* Middle Breakdown values */}
              <div className="my-3 bg-zinc-100 rounded-xl p-3 border border-zinc-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[5.5px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Estimated Cost</span>
                  <span className="text-[18px] font-black text-zinc-900 font-mono tracking-tight mt-0.5">₹49,999</span>
                </div>
                <div className="text-[7px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                  Locked
                </div>
              </div>

              {/* Stamped signature area */}
              <div className="flex justify-between items-center border-t border-zinc-200 pt-3 text-[5.5px] font-mono text-zinc-400 uppercase font-bold">
                <span>MD5: FD82A81C92EF...</span>
                <span className="text-zinc-800 font-bold tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified AdaptWeb
                </span>
              </div>
            </motion.div>

            {/* -------------------------------------------------------------
                SHOT 06: Final Brand Convergence Logo Reveal
                ------------------------------------------------------------- */}
            <motion.div
              style={{
                opacity: logoOpacity,
                scale: logoScale,
                transformStyle: "preserve-3d"
              }}
              className="absolute w-72 h-72 flex flex-col justify-center items-center gap-4 text-center overflow-visible"
            >
              {/* Snapping Brand Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-accent border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full blur-md" />
                <Layers className="w-10 h-10 text-white relative z-10 animate-pulse" />
              </div>

              {/* Title brand typography */}
              <div className="space-y-1.5 mt-2">
                <h4 className="text-2xl font-black text-white tracking-widest uppercase font-mono">
                  ADAPTWEB
                </h4>
                <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  AdaptWeb Cost Calculator
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
