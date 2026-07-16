import { getPackageFeatureCategories, getPackageFeatures } from '@/lib/packages/package-features-library';
import PackageFeaturesClientPage from '@/components/admin/package-features-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminPackageFeaturesPage() {
  const [categories, features] = await Promise.all([
    getPackageFeatureCategories(),
    getPackageFeatures(),
  ]);

  return <PackageFeaturesClientPage initialCategories={categories} initialFeatures={features} />;
}
