import { getPackages } from '@/lib/packages';
import { getFeatures } from '@/lib/features';
import { getFeatureCategories } from '@/lib/features/categories';
import { getIndustries } from '@/lib/industries';
import { getPriceConfig } from '@/lib/price-config';
import CalculatorWizard from '@/components/calculator/calculator-wizard';

export const revalidate = 0; // Fetch fresh pricing configuration every load

export default async function PublicCalculatorPage() {
  // Fetch pricing masters in parallel on the server
  const [packages, features, categories, industries, priceConfig] = await Promise.all([
    getPackages(true),
    getFeatures(undefined, true),
    getFeatureCategories(true),
    getIndustries(true),
    getPriceConfig(),
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-white">Quotation Cost Estimator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure page count and custom modules to calculate a budget approximation instantly.
        </p>
      </div>

      {/* Stepper Wizard Container */}
      <CalculatorWizard
        packages={packages}
        features={features}
        categories={categories}
        industries={industries}
        priceConfig={priceConfig}
      />
    </div>
  );
}
