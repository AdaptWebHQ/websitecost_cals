import { getCalculationById } from '@/lib/calculations';
import { getServerUser } from '@/actions/auth';
import PdfDownloadButton from '@/components/calculator/pdf-download-button';
import ContactInquiryForm from '@/components/forms/contact-inquiry-form';
import PageTitleSetter from '@/components/shared/page-title-setter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface EstimateDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function PublicEstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { id } = await params;
  const [calculation, user] = await Promise.all([
    getCalculationById(id),
    getServerUser()
  ]);

  if (!calculation) {
    notFound();
  }

  if (!user) {
    redirect('/login');
  }

  // ownership verification
  if (user.role === 'public' && calculation.userId !== user.id) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
        Forbidden. You do not own this quotation log.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Dynamic Header Title Override */}
      <PageTitleSetter title={calculation.businessName} />

      {/* Back to List */}
      <Link href="/dashboard/public/estimates" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </Link>

      {/* Header and Download controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Quotation Estimate Details
            <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-transparent text-xs select-none">
              Ref ID: {calculation.id}
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generated on {formatDate(calculation.createdAt)} for {calculation.businessName}.
          </p>
        </div>
        <PdfDownloadButton calculationId={calculation.id} businessName={calculation.businessName} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Project Config summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Baseline Structure</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-slate-500 text-xs block uppercase tracking-wider font-semibold">Website Type</span>
                <span className="text-slate-200 font-medium text-base mt-1 block capitalize">{calculation.websiteType}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block uppercase tracking-wider font-semibold">Predefined Package</span>
                <span className="text-indigo-400 font-bold text-base mt-1 block">{calculation.packageName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block uppercase tracking-wider font-semibold">Target Sector</span>
                <span className="text-slate-200 font-medium text-base mt-1 block">{calculation.industryName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block uppercase tracking-wider font-semibold">Configure Pages</span>
                <span className="text-slate-200 font-medium text-base mt-1 block">{calculation.pages} Pages</span>
              </div>
            </div>
          </Card>

          {/* Features check list */}
          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Integrated Custom Modules</h2>
            {calculation.selectedFeatures.length === 0 ? (
              <p className="text-slate-500 text-sm">No custom integrations selected for this estimate.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calculation.selectedFeatures.map((feat) => (
                  <div key={feat.featureId} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/20">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm block">{feat.featureName}</span>
                      <span className="text-xs text-slate-500 capitalize block mt-0.5">
                        Pricing: {feat.pricingType === 'per_page' ? `${formatCurrency(feat.unitPrice)} / page` : feat.pricingType === 'percentage' ? `${feat.unitPrice}% of base` : formatCurrency(feat.unitPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Pricing Breakdown */}
        <div className="md:col-span-1">
          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Pricing Breakdown</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800/60">
                <span>Base Tier Price</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculation.basePrice || 0)}</span>
              </div>
              
              {calculation.featuresPrice && calculation.featuresPrice > 0 ? (
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800/60">
                  <span>Custom Modules</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(calculation.featuresPrice)}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-slate-300 font-medium pb-2 border-b border-slate-800/60">
                <span>Subtotal</span>
                <span>{formatCurrency(calculation.subtotal)}</span>
              </div>

              {calculation.rushMarkup && calculation.rushMarkup > 0 ? (
                <div className="flex justify-between text-amber-400 pb-2 border-b border-slate-800/60">
                  <span>Rush Markup Charge</span>
                  <span>{formatCurrency(calculation.rushMarkup)}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800/60">
                <span>Integrated GST</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculation.gstAmount)}</span>
              </div>

              <div className="flex justify-between text-white font-bold text-lg pt-2">
                <span>Total Quotation</span>
                <span className="text-indigo-400">{formatCurrency(calculation.total)}</span>
              </div>
            </div>
          </Card>

          {/* Contact Inquiry Callback Form */}
          <div className="mt-6">
            <ContactInquiryForm
              calculationId={calculation.id}
              defaultName={calculation.businessName}
              defaultEmail={calculation.businessEmail}
              defaultPhone={calculation.businessPhone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
