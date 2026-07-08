'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessDetailsSchema, type BusinessDetailsFormData } from '@/schemas';
import { useCalculatorStore } from '@/store/calculator-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Business Details</h2>
        <p className="text-sm text-slate-400 mt-1">
          Provide your contact information so we can link the quotation estimate.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Company / Business Name</Label>
          <Input
            id="businessName"
            placeholder="e.g. Acme Tech Solutions"
            className="bg-slate-900/60 border-slate-800 text-white rounded-xl h-11"
            {...register('businessName')}
          />
          {errors.businessName && <p className="text-xs text-red-400">{errors.businessName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Email Address</Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="e.g. client@acme.com"
            className="bg-slate-900/60 border-slate-800 text-white rounded-xl h-11"
            {...register('businessEmail')}
          />
          {errors.businessEmail && <p className="text-xs text-red-400">{errors.businessEmail.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone">Phone Number</Label>
          <Input
            id="businessPhone"
            placeholder="e.g. 9876543210"
            className="bg-slate-900/60 border-slate-800 text-white rounded-xl h-11"
            {...register('businessPhone')}
          />
          {errors.businessPhone && <p className="text-xs text-red-400">{errors.businessPhone.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 font-medium"
        >
          Next Step
        </Button>
      </div>
    </form>
  );
}
