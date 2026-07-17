import type { Metadata } from 'next';
import { getPackagesWithInbuiltFeatures } from '@/lib/packages';
import { getAddons } from '@/lib/addons';
import { getAddonCategories } from '@/lib/addons/categories';
import { getIndustries } from '@/lib/industries';
import { getPriceConfig } from '@/lib/price-config';
import CalculatorWizard from '@/components/calculator/calculator-wizard';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: 'Quotation Cost Estimator',
  description: 'Select packages, estimate custom page volumes, select features and custom addons to compute an instant budget quotation for your project.',
  openGraph: {
    title: `Quotation Cost Estimator | ${APP_NAME}`,
    description: 'Select packages, estimate custom page volumes, select features and custom addons to compute an instant budget quotation for your project.',
    url: 'https://calculator.yourdomain.com/public/calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Quotation Cost Estimator | ${APP_NAME}`,
    description: 'Select packages, estimate custom page volumes, select features and custom addons to compute an instant budget quotation for your project.',
  },
};

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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AdaptWeb Interactive Web Cost Estimator",
    "description": "Calculate custom web application pricing instantly based on pages, package tiers, and feature modules.",
    "provider": {
      "@type": "Organization",
      "name": "AdaptWeb",
      "logo": "https://calculator.yourdomain.com/uploaded_logo.png",
      "telephone": ["+919342624226", "+918072268570"],
      "url": "https://calculator.yourdomain.com"
    },
    "areaServed": "IN",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": "0.00",
      "description": "Free instant quotation cost estimation"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://calculator.yourdomain.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Estimator",
        "item": "https://calculator.yourdomain.com/public/calculator"
      }
    ]
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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

      {/* Server-rendered Explanatory Content for SEO/AEO/GEO */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">How is my website cost calculated?</h3>
          <p className="leading-relaxed">
            Our pricing engine computes estimations by combining a template baseline (determined by either industry templates or preset package tiers) with custom page counts. Additional costs are determined by itemized integration modules (addons) such as payment gateways, databases, and custom user portals.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">What is included in the base pricing?</h3>
          <p className="leading-relaxed">
            Each base package includes a preset amount of design layouts, initial pages, standard responsive styling adjustments, core speed optimization parameters, and meta tag setup for basic search visibility. You can customize the quote and download an instant secure PDF proposal immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
