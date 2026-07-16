'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutIntro() {
  return (
    <section className="light-theme w-full py-24 sm:py-32 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Visual Area - Abstract representation of pricing blocks */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-square max-w-md mx-auto lg:max-w-none w-full"
        >
          {/* We'll use CSS shapes to create an abstract, elegant composition matching the light-theme */}
          <div className="absolute inset-0 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center p-8 border border-slate-200">
            <div className="w-full h-full relative">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-[60%] h-[40%] bg-primary/10 rounded-2xl backdrop-blur-md border border-primary/20"
              />
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[15%] right-[5%] w-[70%] h-[50%] bg-accent/10 rounded-2xl backdrop-blur-md border border-accent/20"
              />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-success/20 rounded-full blur-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Text Area */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-start"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-foreground mb-8">
            Always pushing agency operations forward with revolutionary technology, we build premium estimation tools trusted by agencies who value advanced engineering, efficiency, and remarkable design.
          </h2>
          
          <Link href="/about" className="group flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors">
            <span className="relative">
              Read more about us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
