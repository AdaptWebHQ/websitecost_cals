'use client';

import { motion } from 'framer-motion';

export default function Marquee() {
  return (
    <section className="light-theme w-full py-16 sm:py-24 overflow-hidden bg-background border-y border-border">
      <div className="relative flex flex-col justify-center">
        {/* We use two motion divs to create an infinite scrolling effect */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
            className="flex items-center gap-12 sm:gap-24 pr-12 sm:pr-24"
          >
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-foreground uppercase opacity-90 leading-none">
              Estimate.
            </span>
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-primary uppercase leading-none">
              Quote.
            </span>
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-foreground uppercase opacity-90 leading-none">
              Build.
            </span>
            <span className="text-[8vw] sm:text-[4vw] font-medium tracking-tight text-muted-foreground uppercase opacity-50 leading-none mx-4">
              Beyond your expectations
            </span>
          </motion.div>
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
            className="flex items-center gap-12 sm:gap-24 pr-12 sm:pr-24"
          >
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-foreground uppercase opacity-90 leading-none">
              Estimate.
            </span>
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-primary uppercase leading-none">
              Quote.
            </span>
            <span className="text-[12vw] sm:text-[8vw] font-black tracking-tighter text-foreground uppercase opacity-90 leading-none">
              Build.
            </span>
            <span className="text-[8vw] sm:text-[4vw] font-medium tracking-tight text-muted-foreground uppercase opacity-50 leading-none mx-4">
              Beyond your expectations
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
