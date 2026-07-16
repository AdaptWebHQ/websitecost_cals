'use client';

import { motion, Variants } from 'framer-motion';
import { Cpu, FileCheck, LineChart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: Cpu,
    title: 'Accurate Pricing Engine',
    body: 'Generate accurate website estimates using centralized pricing rules, configurable packages, dynamic add-ons, and real-time calculations.',
  },
  {
    icon: FileCheck,
    title: 'Professional Proposal',
    body: 'Generate beautiful branded quotation PDFs that you can share with clients immediately after estimation.',
  },
  {
    icon: LineChart,
    title: 'Lead Management',
    body: 'Capture inquiries, organize project requests, track customer activity, and manage your complete estimation pipeline.',
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function FeatureGrid() {
  return (
    <section id="products" className="w-full bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Structural Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-16 border-b border-slate-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 font-bold block mb-3">
              / Core Infrastructure
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              System Capabilities
            </h2>
          </div>
          <Link href="/catalog" className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors font-mono">
            View Documentation
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Hard Technical Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 border-l border-slate-800"
        >
          {FEATURES.map((f, index) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={item}
                className="relative flex flex-col p-8 sm:p-12 border-r border-b border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors group duration-300"
              >
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-none border border-slate-800 bg-slate-950 group-hover:border-white transition-colors flex items-center justify-center text-slate-400 group-hover:text-white">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{f.title}</h3>
                
                <p className="text-sm text-slate-400 leading-relaxed font-mono">
                  {f.body}
                </p>

                {/* Decorative technical specs */}
                <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-800">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Sys_Module_0{index + 1}</span>
                  <span className="w-2 h-2 rounded-none border border-slate-800 group-hover:bg-white group-hover:border-white transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}