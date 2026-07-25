import { getServiceCategoriesAction } from '@/actions/service-category';
import { getIndustriesAction } from '@/actions/industries';
import { getPackagesAction } from '@/actions/packages';
import IndustriesClientPage from '@/components/admin/industries-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminIndustriesPage() {
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

  const [industriesRes, packagesRes] = await Promise.all([
    getIndustriesAction(defaultCategory.id),
    getPackagesAction(defaultCategory.id),
  ]);

  return (
    <IndustriesClientPage
      categories={categories}
      initialCategoryId={defaultCategory.id}
      initialIndustries={industriesRes.success ? (industriesRes.data || []) : []}
      initialPackages={packagesRes.success ? (packagesRes.data || []) : []}
    />
  );
}
