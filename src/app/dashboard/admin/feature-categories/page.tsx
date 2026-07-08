import { getFeatureCategories } from '@/lib/features/categories';
import CategoriesClientPage from './categories-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminFeatureCategoriesPage() {
  const categories = await getFeatureCategories();
  return <CategoriesClientPage initialCategories={categories} />;
}
