'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CalendarRange } from 'lucide-react';

export default function DeliveryStep() {
  const { rushDelivery, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSelect = (isRush: boolean) => {
    updateFields({ rushDelivery: isRush });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Delivery Timeline</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose standard delivery speed or speed up with rush processing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard option */}
        <button
          onClick={() => handleSelect(false)}
          className={`p-6 rounded-2xl text-left border flex items-start gap-4 transition-all ${
            !rushDelivery
              ? 'border-indigo-500 bg-indigo-950/20 text-white shadow-lg'
              : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
            !rushDelivery 
              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <CalendarRange className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Standard Delivery</span>
            <span className="text-xs text-slate-500 mt-1 leading-normal font-normal">
              Deliver project in the standard timeline specified by the package.
            </span>
          </div>
        </button>

        {/* Rush option */}
        <button
          onClick={() => handleSelect(true)}
          className={`p-6 rounded-2xl text-left border flex items-start gap-4 transition-all ${
            rushDelivery
              ? 'border-indigo-500 bg-indigo-950/20 text-white shadow-lg'
              : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
            rushDelivery 
              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Rush Delivery (+25% markup)</span>
            <span className="text-xs text-slate-500 mt-1 leading-normal font-normal">
              Priority scheduling. Cuts delivery time by 30-50% with rush charges.
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          onClick={prevStep}
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
