import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: EstimateDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const calculation = await getCalculationById(id);
  if (!calculation) {
    return {
      title: 'Estimate Not Found',
    };
  }
  return {
    title: `Quotation Estimate: ${calculation.businessName}`,
    description: `Quotation cost estimate details for ${calculation.businessName}. Ref ID: ${calculation.id}.`,
  };
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
    <div className="space-y-6 pb-12 max-w-4xl mx-auto animate-in fade-in-50 duration-300 font-sans">
      {/* Dynamic Header Title Override */}
      <PageTitleSetter title={calculation.businessName} />

      {/* Back to List */}
      <Link href="/public/estimates" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </Link>

      {/* Header and Download controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Quotation Estimate Details
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 hover:bg-transparent text-xs select-none font-mono font-bold">
              Ref ID: {calculation.id}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generated on {formatDate(calculation.createdAt)} for {calculation.businessName}.
          </p>
        </div>
        <PdfDownloadButton calculationId={calculation.id} businessName={calculation.businessName} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Project Config summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Baseline Structure</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-bold">Website Type</span>
                <span className="text-foreground font-semibold text-base mt-1 block capitalize">{calculation.websiteType}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-bold">Predefined Package</span>
                <span className="text-primary font-bold text-base mt-1 block">{calculation.packageName}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-bold">Target Sector</span>
                <span className="text-foreground font-semibold text-base mt-1 block">{calculation.industryName}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-bold">Configure Pages</span>
                <span className="text-foreground font-semibold text-base mt-1 block">{calculation.pages} Pages</span>
              </div>
            </div>
          </Card>

          {/* Features check list */}
          <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Integrated Custom Modules</h2>
            {calculation.selectedFeatures.length === 0 ? (
              <p className="text-muted-foreground text-sm">No custom integrations selected for this estimate.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calculation.selectedFeatures.map((feat) => (
                  <div key={feat.featureId} className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-muted/20">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground text-sm block">{feat.featureName}</span>
                      <span className="text-xs text-muted-foreground capitalize block mt-1">
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
          <Card className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Pricing Breakdown</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border">
                <span>Base Tier Price</span>
                <span className="text-foreground font-semibold">{formatCurrency(calculation.basePrice || 0)}</span>
              </div>
              
              {calculation.featuresPrice && calculation.featuresPrice > 0 ? (
                <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border">
                  <span>Custom Modules</span>
                  <span className="text-foreground font-semibold">{formatCurrency(calculation.featuresPrice)}</span>
                </div>
              ) : null}

              <div className="flex justify-between items-center text-foreground font-bold pb-2 border-b border-border">
                <span>Subtotal</span>
                <span>{formatCurrency(calculation.subtotal)}</span>
              </div>

              {calculation.rushMarkup && calculation.rushMarkup > 0 ? (
                <div className="flex justify-between items-center text-amber-600 dark:text-amber-500 font-semibold pb-2 border-b border-border">
                  <span>Rush Markup Charge</span>
                  <span>{formatCurrency(calculation.rushMarkup)}</span>
                </div>
              ) : null}

              <div className="flex justify-between items-center text-muted-foreground pb-2 border-b border-border">
                <span>Integrated GST</span>
                <span className="text-foreground font-semibold">{formatCurrency(calculation.gstAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-foreground font-extrabold text-lg pt-2">
                <span>Total Quotation</span>
                <span className="text-primary font-black">{formatCurrency(calculation.total)}</span>
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
