'use client';

import { useCalculatorStore } from '@/store/calculator-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function PagesStep() {
  const { pages, updateFields, nextStep, prevStep } = useCalculatorStore();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFields({ pages: parseInt(e.target.value) || 1 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    updateFields({ pages: Math.min(Math.max(val, 1), 200) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Number of Pages</h2>
        <p className="text-sm text-slate-400 mt-1">
          Specify the estimated total number of unique pages required for the site.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="pages-input" className="text-slate-300 font-medium">Estimated Pages</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pages-input"
              type="number"
              min={1}
              max={200}
              value={pages}
              onChange={handleInputChange}
              className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-11 w-20 text-center font-bold"
            />
            <span className="text-sm text-slate-400">Pages</span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={50}
            value={Math.min(pages, 50)}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span>1 Page</span>
            <span>10 Pages</span>
            <span>20 Pages</span>
            <span>30 Pages</span>
            <span>40 Pages</span>
            <span>50+ Pages</span>
          </div>
        </div>
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
