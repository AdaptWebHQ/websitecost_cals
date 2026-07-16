'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessDetailsSchema, type BusinessDetailsFormData } from '@/schemas';
import { useCalculatorStore } from '@/store/calculator-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Building2, Mail, Phone, ArrowRight, ShieldCheck, BarChart2, Cloud, CheckCircle2 } from 'lucide-react';
import type { Calculation } from '@/types';
import PdfDownloadButton from '../pdf-download-button';
import { useRouter } from 'next/navigation';

interface BusinessDetailsStepProps {
  isSubmitting: boolean;
  calcResult: Calculation | null;
  onFinalize: () => void;
}

export default function BusinessDetailsStep({ isSubmitting, calcResult, onFinalize }: BusinessDetailsStepProps) {
  const router = useRouter();
  const { businessName, businessEmail, businessPhone, updateFields, nextStep, reset } = useCalculatorStore();

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
    onFinalize();
  };

  if (calcResult) {
    return (
      <div className="text-center space-y-5 max-w-md mx-auto py-6 animate-in fade-in duration-500">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Quotation Generated!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Your quotation has been securely calculated, signed, and saved in database records.
          </p>
        </div>
        
        <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Reference ID:</span>
            <span className="font-mono text-foreground font-bold">{calcResult.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="h-px bg-border w-full" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Total Investment:</span>
            <span className="text-primary font-bold">₹{calcResult.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <PdfDownloadButton calculationId={calcResult.id} />
          
          <button
            onClick={() => {
              reset();
              router.push('/dashboard');
            }}
            className="w-full h-9 bg-card hover:bg-muted text-foreground font-semibold rounded-lg border border-border flex items-center justify-center transition-colors text-xs cursor-pointer shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-xl mx-auto">
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <header className="mb-4">
          <h1 className="text-sm font-bold text-foreground mb-0.5">Final Review & Contact</h1>
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
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[160px] h-9 bg-primary text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-colors shadow-sm cursor-pointer text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Quotation
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-muted rounded-lg flex items-start gap-2 border border-border">
          <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Your information is strictly confidential. By clicking &apos;Next Step&apos;, you agree to our processing of these details to generate your tailored quote.
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
