import { getPriceConfig } from '@/lib/price-config';
import PriceConfigForm from '@/components/forms/price-config-form';

export const revalidate = 0; // Fetch fresh data on load

export default async function AdminPriceConfigPage() {
  const config = await getPriceConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pricing & CRM Configurations</h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust the baseline markup coefficients, tax guidelines, and company identity records used in client quotation generations.
        </p>
      </div>

      {/* Settings Form */}
      <div className="pt-2">
        <PriceConfigForm initialData={config} />
      </div>
    </div>
  );
}
