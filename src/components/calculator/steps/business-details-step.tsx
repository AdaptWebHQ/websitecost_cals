'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessDetailsSchema, type BusinessDetailsFormData } from '@/schemas';
import { useCalculatorStore } from '@/store/calculator-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-xl mx-auto">
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <header className="mb-4">
          <h1 className="text-sm font-bold text-foreground mb-0.5">Your Contact Details</h1>
          <p className="text-[10px] text-muted-foreground">Tell us about your business so we can personalize your quote.</p>
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
                autoComplete="organization"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
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
                autoComplete="email"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
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
                type="tel"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                className="w-full h-9 pr-10 pl-3 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
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
            Your information is strictly confidential. We use these details only to generate your tailored quote.
          </p>
        </div>
      </div>
    </div>
  );
}
