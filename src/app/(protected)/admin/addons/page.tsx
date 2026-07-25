import { getServiceCategoriesAction } from '@/actions/service-category';
import { getAddonCategoriesAction } from '@/actions/addon-categories';
import { getAddonFeaturesAction } from '@/actions/addon-features';
import AddonsClientPage from '@/components/admin/addons-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminAddonsPage() {
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

  const [addonCatsRes, addonFeaturesRes] = await Promise.all([
    getAddonCategoriesAction(defaultCategory.id),
    getAddonFeaturesAction(defaultCategory.id),
  ]);

  return (
    <AddonsClientPage
      categories={categories}
      initialCategoryId={defaultCategory.id}
      initialCategories={addonCatsRes.success ? (addonCatsRes.data || []) : []}
      initialAddons={addonFeaturesRes.success ? (addonFeaturesRes.data || []) : []}
    />
  );
}
