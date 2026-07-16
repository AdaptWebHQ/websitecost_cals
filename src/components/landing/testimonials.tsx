'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "The precision and control we get with AdaptWeb's Cost Calculator has elevated our proposal quality to award-winning levels. Every estimate is consistently perfect.",
    author: "Mark Jones",
    company: "Java Jones Agency",
  },
  {
    quote: "What a team! Supportive, super professional, and also friendly. The platform is super technological, and helps me to get the best out of my sales process.",
    author: "Sarah Jenkins",
    company: "Studio Perth, Australia",
  },
  {
    quote: "The best estimation tool in the world! I have been using it for specialty projects and it's an amazing platform. Very accurate, fast reaction, with great results.",
    author: "David Asher",
    company: "Digital Craftsmen",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="light-theme w-full py-24 sm:py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        
        {/* Left Side: Indicator & Controls */}
        <div className="w-full md:w-1/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Testimonials</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="text-6xl font-black text-border opacity-50 font-mono">
              0{currentIndex + 1}
            </div>
          </div>
          
          <div className="flex gap-4 mt-8 md:mt-0">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Right Side: Quote */}
        <div className="w-full md:w-2/3 flex items-center overflow-hidden relative min-h-[300px]">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{ 
                opacity: idx === currentIndex ? 1 : 0,
                x: idx === currentIndex ? 0 : 50,
                pointerEvents: idx === currentIndex ? 'auto' : 'none',
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed text-foreground mb-10">
                "{t.quote}"
              </h4>
              <div>
                <strong className="block text-lg text-foreground font-bold">{t.author}</strong>
                <span className="block text-sm text-muted-foreground mt-1">{t.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
