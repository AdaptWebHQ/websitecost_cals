'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { ArrowLeft, ArrowRight, Clock, CalendarRange, CheckCircle2 } from 'lucide-react';

export default function DeliveryStep() {
  const { rushDelivery, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (isRush: boolean) => {
    updateFields({ rushDelivery: isRush });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="text-left">
        <h2 className="text-sm font-bold text-foreground">Delivery Timeline</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Choose standard delivery speed or speed up with rush processing.
        </p>
      </div>

      {/* Bento Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
        {/* Standard Card */}
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={`p-4 text-left flex flex-col items-start select-none group relative rounded-lg border transition-colors cursor-pointer ${
            !rushDelivery
              ? 'border-primary bg-card/90 shadow-sm'
              : 'border-border bg-card/65 hover:border-primary/50'
          }`}
        >
          {/* Absolute Top-Right Check */}
          <div className={`absolute top-3 right-3 transition-opacity duration-200 ${!rushDelivery ? 'opacity-100' : 'opacity-0'}`}>
            <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
          </div>

          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <CalendarRange className="w-5 h-5 text-primary" />
          </div>

          <h3 className="font-bold text-xs text-foreground mb-1">Standard Delivery</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-normal mb-4">
            Our balanced approach. Quality-focused execution with a standard 4-6 week lifecycle.
          </p>

          <div className="mt-auto pt-3 border-t border-border w-full flex items-center gap-1">
            <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase">ESTIMATED ARRIVAL:</span>
            <span className="text-[11px] font-bold text-foreground">4-6 Weeks</span>
          </div>
        </button>

        {/* Rush Card */}
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={`p-4 text-left flex flex-col items-start select-none group relative rounded-lg border transition-colors cursor-pointer ${
            rushDelivery
              ? 'border-primary bg-card/90 shadow-sm'
              : 'border-border bg-card/65 hover:border-primary/50'
          }`}
        >
          {/* Absolute Top-Right Check */}
          <div className={`absolute top-3 right-3 transition-opacity duration-200 ${rushDelivery ? 'opacity-100' : 'opacity-0'}`}>
            <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
          </div>

          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-primary" />
          </div>

          <div className="flex justify-between items-center w-full mb-1">
            <h3 className="font-bold text-xs text-foreground">Rush Delivery</h3>
            <span className="text-[8px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">
              +25% Markup
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-normal mb-4">
            Priority queue placement. Expedited development cycles for critical time-to-market needs.
          </p>

          <div className="mt-auto pt-3 border-t border-border w-full flex items-center gap-1">
            <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase">ESTIMATED ARRIVAL:</span>
            <span className="text-[11px] font-bold text-primary">2-3 Weeks</span>
          </div>
        </button>
      </div>

      {/* Controls Area */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <button
          onClick={prevStep}
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous Step
        </button>

        <button
          onClick={nextStep}
          className="px-5 py-2 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/95 transition-colors cursor-pointer text-xs"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
