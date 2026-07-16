'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaStamp() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-8 sm:p-14 rounded-[32px] premium-glass relative overflow-hidden flex flex-col items-center shadow-2xl group"
      >
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Glowing top edge */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-white/70"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready to start?
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mt-2 tracking-tight">
          Plan your project today.
        </h2>
        <p className="mt-6 text-white/60 text-base max-w-md leading-relaxed">
          Take the uncertainty out of web design. Get a clear, professional estimate and take the first step toward launching your new website.
        </p>
        
        <div className="mt-10 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          <Link href="/public/calculator">
            <Button className="relative bg-white text-black hover:bg-white/90 rounded-xl h-14 px-8 gap-3 text-base font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer transition-all hover:scale-105">
              Start Your Estimate
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}