'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/schemas';
import { createInquiryAction } from '@/actions/inquiries';
import { BUDGET_RANGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, MessageSquare, Send } from 'lucide-react';

interface ContactInquiryFormProps {
  calculationId?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultBudget?: string;
}

export default function ContactInquiryForm({
  calculationId,
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  defaultBudget = '',
}: ContactInquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: defaultName,
      company: '',
      email: defaultEmail,
      phone: defaultPhone,
      budget: defaultBudget || BUDGET_RANGES[0],
      message: '',
    },
  });

  const selectedBudget = watch('budget');

  const onSubmit = async (data: unknown) => {
    const values = data as ContactFormData;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await createInquiryAction(values, calculationId);
      if (response.success) {
        setSuccessMessage('Inquiry submitted successfully! A consultant will contact you shortly.');
      } else {
        setErrorMessage(response.error || 'Failed to submit inquiry.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An unexpected error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage) {
    return (
      <Card className="bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-slate-900 dark:text-white font-bold text-base">Thank You!</h4>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-normal">
            {successMessage}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Consult an Expert</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Request a call to discuss customization needs and finalize proposal details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold select-none">
            {errorMessage}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-slate-700 dark:text-slate-300">Your Name</Label>
          <Input
            id="name"
            placeholder="e.g. John Doe"
            className="bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            {...register('name')}
          />
          {errors.name && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs text-slate-700 dark:text-slate-300">Company Name</Label>
          <Input
            id="company"
            placeholder="e.g. Acme Tech Solutions"
            className="bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            {...register('company')}
          />
          {errors.company && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.company.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-slate-700 dark:text-slate-300">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. contact@acme.com"
            className="bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            {...register('email')}
          />
          {errors.email && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs text-slate-700 dark:text-slate-300">Phone Number</Label>
          <Input
            id="phone"
            placeholder="e.g. 9876543210"
            className="bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            {...register('phone')}
          />
          {errors.phone && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="budget" className="text-xs text-slate-700 dark:text-slate-300">Approx. Budget</Label>
          <Select
            value={selectedBudget}
            onValueChange={(val) => setValue('budget', val || '', { shouldValidate: true })}
          >
            <SelectTrigger className="w-full h-10 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 text-sm focus:border-primary flex items-center justify-between data-[size=default]:h-10 data-[size=default]:w-full">
              <SelectValue placeholder="Select budget..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-1 shadow-2xl text-slate-800 dark:text-slate-200">
              {BUDGET_RANGES.map((r) => (
                <SelectItem
                  key={r}
                  value={r}
                  className="flex items-center w-full px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budget && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.budget.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs text-slate-700 dark:text-slate-300">Requirements Description</Label>
          <textarea
            id="message"
            placeholder="Tell us about custom integrations or layout templates you need..."
            rows={3}
            className="w-full bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none leading-normal placeholder:text-slate-400 dark:placeholder:text-slate-500"
            {...register('message')}
          />
          {errors.message && <p className="text-[10px] text-red-600 dark:text-red-400">{errors.message.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 w-full gap-2 font-semibold disabled:opacity-50 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Lead...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
