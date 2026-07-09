import { getFeatures } from '@/lib/features';
import { getFeatureCategories } from '@/lib/features/categories';
import CategoriesClientPage from '@/components/admin/categories-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminFeaturesPage() {
  const [features, categories] = await Promise.all([
    getFeatures(),
    getFeatureCategories(),
  ]);

  return <CategoriesClientPage initialCategories={categories} initialFeatures={features} />;
}
