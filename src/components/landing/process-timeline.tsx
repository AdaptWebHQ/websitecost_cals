'use client';

import { motion, Variants } from 'framer-motion';
import { Settings2, Calculator, FileCheck, Send } from 'lucide-react';

const STEPS = [
  {
    icon: Settings2,
    label: 'Configure',
    title: 'Pick a package, tune the scope',
    body: "Start from a base package, then adjust pages, add-ons, and industry multipliers to match the actual project.",
  },
  {
    icon: Calculator,
    label: 'Calculate',
    title: 'Pricing engine does the math',
    body: 'Centralized rules and live formulas turn your inputs into a defensible number — instantly, and consistently.',
  },
  {
    icon: FileCheck,
    label: 'Generate',
    title: 'Turn the number into a quote',
    body: 'One click produces a branded PDF proposal, itemized and ready to attach to an email.',
  },
  {
    icon: Send,
    label: 'Send',
    title: 'Deliver it and track the reply',
    body: 'Email the estimate straight from the platform, then watch it move through your inquiry pipeline.',
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
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-3 border border-border bg-card px-3 py-1.5 mx-auto w-max">Est. No. 0142 &rarr; Sent</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3 uppercase">
          From Blank Page to Signed Quote
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed font-mono">
          Four steps, no spreadsheets. This is the whole workflow.
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
