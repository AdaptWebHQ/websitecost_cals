'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yTop = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const yBottom = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden bg-neutral-950">
      {/* Cinematic noise grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      
      {/* Subtle Grid with deeper vignette fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_40%,transparent_100%)] opacity-20" />
      
      {/* Drifting Cinematic Lights */}
      <motion.div
        style={{ y: yTop }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"
      />
      <motion.div
        style={{ y: yBottom }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] mix-blend-screen"
      />
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] mix-blend-screen" />
    </div>
  );
}
