import { getServiceCategoriesAction } from '@/actions/service-category';
import { getPackageFeatureCategoriesAction } from '@/actions/package-feature-categories';
import { getPackageFeaturesAction } from '@/actions/package-features';
import PackageFeaturesClientPage from '@/components/admin/package-features-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminPackageFeaturesPage() {
  const categoriesRes = await getServiceCategoriesAction(true);

  if (!categoriesRes.success || !categoriesRes.data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-red-500">Failed to load service categories</h2>
          <p className="text-muted-foreground">{categoriesRes.error ?? 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  const categories = categoriesRes.data;
  const defaultCategory = categories.find((c) => c.id === 'sc-website') || categories[0];

  if (!defaultCategory) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">No service categories found</h2>
          <p className="text-muted-foreground">Please create a service category first.</p>
        </div>
      </div>
    );
  }

  const [featureCatsRes, featuresRes] = await Promise.all([
    getPackageFeatureCategoriesAction(defaultCategory.id),
    getPackageFeaturesAction(defaultCategory.id),
  ]);

  return (
    <PackageFeaturesClientPage
      categories={categories}
      initialCategoryId={defaultCategory.id}
      initialCategories={featureCatsRes.success ? (featureCatsRes.data || []) : []}
      initialFeatures={featuresRes.success ? (featuresRes.data || []) : []}
    />
  );
}
