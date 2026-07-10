'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessDetailsSchema, type BusinessDetailsFormData } from '@/schemas';
import { useCalculatorStore } from '@/store/calculator-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Phone, ArrowRight, ShieldCheck, BarChart2, Cloud } from 'lucide-react';

export default function BusinessDetailsStep() {
  const { businessName, businessEmail, businessPhone, updateFields, nextStep } = useCalculatorStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessDetailsFormData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName,
      businessEmail,
      businessPhone,
    },
  });

  const onSubmit = (data: BusinessDetailsFormData) => {
    updateFields(data);
    nextStep();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <header className="mb-4">
          <h2 className="text-sm font-bold text-foreground mb-0.5">Business Details</h2>
          <p className="text-[10px] text-muted-foreground">Provide your contact details to save and secure your quotation.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-xs font-bold text-foreground">
              Company Name
            </Label>
            <div className="relative">
              <Input
                id="businessName"
                placeholder="e.g. Acme Corporation"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                {...register('businessName')}
              />
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            </div>
            {errors.businessName && <p className="text-[10px] text-destructive font-semibold">{errors.businessName.message}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="businessEmail" className="text-xs font-bold text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="businessEmail"
                type="email"
                placeholder="name@company.com"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                {...register('businessEmail')}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            </div>
            {errors.businessEmail && <p className="text-[10px] text-destructive font-semibold">{errors.businessEmail.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="businessPhone" className="text-xs font-bold text-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="businessPhone"
                placeholder="+1 (555) 000-0000"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                {...register('businessPhone')}
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            </div>
            {errors.businessPhone && <p className="text-[10px] text-destructive font-semibold">{errors.businessPhone.message}</p>}
          </div>

          {/* Action Button */}
          <div className="pt-3 mt-4 border-t border-border">
            <button
              type="submit"
              className="w-full md:w-auto min-w-[160px] h-9 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-colors shadow-sm cursor-pointer text-xs"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-muted rounded-lg flex items-start gap-2 border border-border">
          <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your information is strictly confidential. By clicking 'Next Step', you agree to our processing of these details to generate your tailored quote.
          </p>
        </div>
      </div>

      {/* Dynamic Bento visual grid underneath */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card/50 p-3 rounded-lg border border-border flex flex-col items-center text-center gap-0.5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-muted border border-border flex items-center justify-center mb-1.5 shadow-sm">
            <BarChart2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-bold text-foreground">Real-time Calculation</span>
          <span className="text-[10px] text-muted-foreground">Pricing updates as you select features</span>
        </div>

        <div className="bg-card/50 p-3 rounded-lg border border-border flex flex-col items-center text-center gap-0.5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-muted border border-border flex items-center justify-center mb-1.5 shadow-sm">
            <Cloud className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-bold text-foreground">Auto-save Progress</span>
          <span className="text-[10px] text-muted-foreground">Resume your quote at any time</span>
        </div>
      </div>
    </div>
  );
}
