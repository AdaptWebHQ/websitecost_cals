'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { priceConfigSchema, type PriceConfigFormData } from '@/schemas';
import { updatePriceConfigAction } from '@/actions/price-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { PriceConfig } from '@/types';
import { Loader2, Save } from 'lucide-react';

interface PriceConfigFormProps {
  initialData: PriceConfig;
}

export default function PriceConfigForm({ initialData }: PriceConfigFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(priceConfigSchema),
    defaultValues: {
      currency: initialData.currency || 'INR',
      currencySymbol: initialData.currencySymbol || '₹',
      gstPercentage: initialData.gstPercentage ?? 18,
      minimumProjectPrice: initialData.minimumProjectPrice ?? 10000,
      rushDeliveryPercentage: initialData.rushDeliveryPercentage ?? 25,
      quotationValidityDays: initialData.quotationValidityDays ?? 15,
      defaultDeliveryDays: initialData.defaultDeliveryDays ?? 30,
      companyName: initialData.companyName || '',
      companyEmail: initialData.companyEmail || '',
      companyPhone: initialData.companyPhone || '',
      companyAddress: initialData.companyAddress || '',
      pdfFooter: initialData.pdfFooter || '',
      termsAndConditions: initialData.termsAndConditions || '',
      privacyPolicy: initialData.privacyPolicy || '',
      isCalculatorEnabled: initialData.isCalculatorEnabled ?? true,
    },
  });

  const isCalculatorEnabledValue = watch('isCalculatorEnabled');

  const onSubmit = async (data: unknown) => {
    const values = data as PriceConfigFormData;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await updatePriceConfigAction(values);
      if (response.success) {
        setSuccessMessage('Pricing configurations saved successfully!');
        router.refresh();
      } else {
        setErrorMessage(response.error || 'Failed to update configurations.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* 1. Global Pricing Offsets */}
      <Card className="bg-card border-border backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Calculation Rates & Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="gstPercentage">GST Percentage (%)</Label>
            <Input
              id="gstPercentage"
              type="number"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('gstPercentage', { valueAsNumber: true })}
            />
            {errors.gstPercentage && <p className="text-xs text-red-400">{errors.gstPercentage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumProjectPrice">Minimum Quote Value (₹)</Label>
            <Input
              id="minimumProjectPrice"
              type="number"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('minimumProjectPrice', { valueAsNumber: true })}
            />
            {errors.minimumProjectPrice && <p className="text-xs text-red-400">{errors.minimumProjectPrice.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rushDeliveryPercentage">Rush Delivery Markup (%)</Label>
            <Input
              id="rushDeliveryPercentage"
              type="number"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('rushDeliveryPercentage', { valueAsNumber: true })}
            />
            {errors.rushDeliveryPercentage && <p className="text-xs text-red-400">{errors.rushDeliveryPercentage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quotationValidityDays">Quotation Validity (Days)</Label>
            <Input
              id="quotationValidityDays"
              type="number"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('quotationValidityDays', { valueAsNumber: true })}
            />
            {errors.quotationValidityDays && <p className="text-xs text-red-400">{errors.quotationValidityDays.message}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-2">
          <Checkbox
            id="isCalculatorEnabled"
            checked={isCalculatorEnabledValue}
            onCheckedChange={(checked) => setValue('isCalculatorEnabled', !!checked)}
          />
          <Label htmlFor="isCalculatorEnabled" className="text-sm font-medium text-foreground">
            Enable Public Quotation Calculator (Toggle SaaS online/offline state)
          </Label>
        </div>
      </Card>

      {/* 2. Company Details */}
      <Card className="bg-card border-border backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Company Metadata (shown in Quotation PDFs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Registered Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Technologies Private Limited"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('companyName')}
            />
            {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail">Support/Inquiry Email</Label>
            <Input
              id="companyEmail"
              placeholder="e.g. quotes@acme.com"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('companyEmail')}
            />
            {errors.companyEmail && <p className="text-xs text-red-400">{errors.companyEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Contact Hotline</Label>
            <Input
              id="companyPhone"
              placeholder="e.g. +91 98765 43210"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('companyPhone')}
            />
            {errors.companyPhone && <p className="text-xs text-red-400">{errors.companyPhone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Physical Address / Headquarters</Label>
            <Input
              id="companyAddress"
              placeholder="e.g. BKC, Mumbai, Maharashtra, 400051"
              className="bg-background border-border text-foreground rounded-xl h-11"
              {...register('companyAddress')}
            />
            {errors.companyAddress && <p className="text-xs text-red-400">{errors.companyAddress.message}</p>}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
