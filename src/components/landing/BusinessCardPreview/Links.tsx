'use client';

import React from 'react';
import { Globe, Linkedin, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LinksProps {
  isDesign?: boolean;
  isGlow?: boolean;
}

export default function BusinessCardLinks({ isDesign, isGlow }: LinksProps) {
  const links = [
    {
      icon: <Globe className="w-3 h-3 text-amber-500" />,
      title: 'Selected Portfolio',
      desc: 'View my latest UI/UX casework',
      href: '#'
    },
    {
      icon: <Linkedin className="w-3 h-3 text-amber-500" />,
      title: 'LinkedIn Network',
      desc: 'Professional connections & feed',
      href: '#'
    },
    {
      icon: <MessageSquare className="w-3 h-3 text-emerald-500" />,
      title: 'Direct WhatsApp',
      desc: 'Instant consultation response',
      href: '#'
    }
  ];

  return (
    <div className="w-full space-y-1.5">
      {links.map((link, idx) => (
        <motion.div
          key={idx}
          whileHover={{ x: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          className={`w-full p-2 bg-slate-900/60 border rounded-lg flex items-center justify-between text-left cursor-pointer transition-all duration-300 ${
            isGlow && idx === 0 
              ? 'border-amber-500/50 shadow-md shadow-amber-500/5' 
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-800/80 flex items-center justify-center border border-slate-700">
              {link.icon}
            </div>
            <div>
              <h5 className="text-[7.5px] font-bold text-slate-100">{link.title}</h5>
              <p className="text-[5.5px] text-slate-400 font-mono mt-0.5">{link.desc}</p>
            </div>
          </div>
          <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
        </motion.div>
      ))}
    </div>
  );
}
