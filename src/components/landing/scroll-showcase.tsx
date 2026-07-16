'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const SETS = [
  {
    id: 'set-1',
    title: 'High-Performance Dashboards',
    description: 'Complex data visualizations built on rigid architectural grid systems. No soft corners, pure data. Built for scale and speed.',
    images: ['/images/showcase/showcase_1.png', '/images/showcase/showcase_2.png', '/images/showcase/showcase_3.png']
  },
  {
    id: 'set-2',
    title: 'Mobile-First Fintech',
    description: 'Stark white numerics on pure black backgrounds. Zero latency, hyper-responsive touch targets. Designed for immediate transaction feedback.',
    images: ['/images/showcase/showcase_4.png', '/images/showcase/showcase_5.png', '/images/showcase/showcase_6.png']
  },
  {
    id: 'set-3',
    title: 'Corporate Architecture',
    description: 'Monospace typography mixed with high-contrast structural layouts. Enterprise grade delivery tailored to showcase immense value.',
    images: ['/images/showcase/showcase_7.png', '/images/showcase/showcase_8.png', '/images/showcase/showcase_9.png']
  }
];

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // There are 3 screens, total width is 300%. To show the last screen, we translate by -66.666% of the container.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66666%']);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-background border-y border-border">
        
        {/* Background Grid for Architectural Vibe */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 z-0">
           <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
           <div className="absolute top-1/4 left-0 right-0 h-px bg-border" />
           <div className="absolute top-3/4 left-0 right-0 h-px bg-border" />
        </div>

        <motion.div style={{ x }} className="flex w-[300vw] h-full items-center">
          {SETS.map((set, i) => (
            <div key={set.id} className="w-[100vw] flex flex-col justify-center px-6 lg:px-16 flex-shrink-0 z-10">
              
              {/* Text Header */}
              <div className="mb-10 max-w-2xl">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-3">
                  <span className="w-4 h-px bg-muted-foreground" />
                  Phase 0{i + 1}
                </div>
                <h3 className="text-3xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-4">{set.title}</h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-sm">
                  {set.description}
                </p>
              </div>

              {/* 3 Images in a Row */}
              <div className="grid grid-cols-3 gap-4 lg:gap-8 w-full h-[45vh] md:h-[55vh]">
                {set.images.map((img, imgIdx) => (
                   <div key={imgIdx} className="relative w-full h-full border border-border bg-card overflow-hidden shadow-lg group">
                     <Image 
                       src={img} 
                       alt={`${set.title} ${imgIdx + 1}`} 
                       fill 
                       className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 dark:grayscale dark:group-hover:grayscale-0" 
                     />
                     
                     {/* Overlay gradient for aesthetics */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                   </div>
                ))}
              </div>

            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
