'use client';

import { motion, Variants } from 'framer-motion';
import { Briefcase, Layers, Calculator, Rocket } from 'lucide-react';

const STEPS = [
  {
    icon: Briefcase,
    label: 'Business',
    title: 'Select Your Business Type',
    body: "Define your industry, and we will recommend the essential pages and features your specific business needs to thrive.",
  },
  {
    icon: Layers,
    label: 'Features',
    title: 'Choose Your Features',
    body: 'Add exactly what you want—from secure payment gateways to scheduling systems—and skip what you don’t.',
  },
  {
    icon: Calculator,
    label: 'Estimate',
    title: 'Review Your Estimate',
    body: 'Watch the cost update instantly. Get a transparent, itemized breakdown of your website project.',
  },
  {
    icon: Rocket,
    label: 'Launch',
    title: 'Connect & Launch',
    body: 'Send your approved estimate directly to our team, and let us turn your vision into a professional digital experience.',
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } },
};

export default function ProcessTimeline() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28 border-t border-border bg-background z-10 relative">
      <div className="text-center max-w-xl mx-auto mb-20">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-3 border border-border bg-card px-3 py-1.5 mx-auto w-max">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3 uppercase">
          From idea to accurate estimate.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed font-mono">
          A clear, straightforward path to understanding your website investment. No guesswork required.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-12"
      >
        {/* Connector line for desktop, drawn as a solid strict line */}
        <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-border -z-10" />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={step.label} variants={item} className="relative flex flex-col items-start md:items-center md:text-center group">
              <div className="flex items-center gap-3 md:flex-col md:gap-3">
                <div className="w-12 h-12 shrink-0 rounded-none bg-card border border-border flex items-center justify-center relative z-10 transition-colors duration-300 group-hover:border-primary">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Step 0{i + 1} — {step.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-4 uppercase tracking-wider">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-mono">{step.body}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}