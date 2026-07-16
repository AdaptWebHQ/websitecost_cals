'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const NICHES = [
  {
    id: 'corporate',
    title: 'Corporate',
    description: 'Estimate highly professional, multi-page corporate websites with advanced compliance, CRM integrations, and premium hosting requirements.',
    image: 'bg-primary/20', // Abstract background for now, could be an actual image URL
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Calculate the complexities of digital storefronts. Account for inventory systems, payment gateways, product variations, and tax compliance.',
    image: 'bg-accent/20',
  },
  {
    id: 'saas',
    title: 'SaaS Platforms',
    description: 'Price out web applications with user authentication, complex dashboards, database architecture, and API developments.',
    image: 'bg-success/20',
  }
];

export default function NicheSpecialty() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="light-theme w-full py-24 sm:py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Our Specialty</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {NICHES.map((niche) => {
            const isHovered = hoveredId === niche.id;
            return (
              <motion.div
                key={niche.id}
                onMouseEnter={() => setHoveredId(niche.id)}
                onMouseLeave={() => setHoveredId(null)}
                layout
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  hoveredId && !isHovered ? 'opacity-40' : 'opacity-100'
                }`}
                style={{
                  flex: isHovered ? 1.5 : 1 // Flex basis animation for layout shift
                }}
              >
                {/* Abstract Image Background */}
                <div className={`absolute inset-0 ${niche.image} transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                  {/* Subtle noise/texture overlay */}
                  <div className="absolute inset-0 mix-blend-overlay opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
                
                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-4 text-white">
                    <h4 className="text-2xl sm:text-3xl font-bold tracking-tight">{niche.title}</h4>
                    <motion.div
                      animate={{ rotate: isHovered ? -45 : 0 }}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 16 : 0
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/80 text-sm leading-relaxed">
                      {niche.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
