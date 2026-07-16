import { getPackagesWithInbuiltFeatures } from '@/lib/packages';
import { getAddons } from '@/lib/addons';
import { getAddonCategories } from '@/lib/addons/categories';
import { getIndustries } from '@/lib/industries';
import { getPriceConfig } from '@/lib/price-config';
import CalculatorWizard from '@/components/calculator/calculator-wizard';

export const revalidate = 0; // Fetch fresh pricing configuration every load

export default async function PublicCalculatorPage() {
  // Fetch pricing masters in parallel on the server
  const [packages, addons, categories, industries, priceConfig] = await Promise.all([
    getPackagesWithInbuiltFeatures(true),
    getAddons(undefined, true),
    getAddonCategories(true),
    getIndustries(true),
    getPriceConfig(),
  ]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Quotation Cost Estimator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure page count and custom modules to calculate a budget approximation instantly.
        </p>
      </div>

      {/* Stepper Wizard Container */}
      <CalculatorWizard
        packages={packages}
        features={addons}
        categories={categories}
        industries={industries}
        priceConfig={priceConfig}
      />
    </div>
  );
}
