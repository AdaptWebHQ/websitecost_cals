import { getServiceCategoriesAction } from '@/actions/service-category';
import { getPackagesAction } from '@/actions/packages';
import { getServiceTypesAction } from '@/actions/service-types';
import PackagesClientPage from '@/components/admin/packages-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminPackagesPage() {
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

  const serviceTypesRes = await getServiceTypesAction(defaultCategory.id, true);
  const serviceTypes = serviceTypesRes.success ? (serviceTypesRes.data || []) : [];
  const defaultServiceType = serviceTypes.length > 0 ? serviceTypes[0] : null;

  const packagesRes = defaultServiceType 
    ? await getPackagesAction(defaultCategory.id, defaultServiceType.id)
    : { success: true, data: [] };

  return (
    <PackagesClientPage
      categories={categories}
      initialCategoryId={defaultCategory.id}
      initialServiceTypes={serviceTypes}
      initialServiceTypeId={defaultServiceType?.id || ''}
      initialPackages={packagesRes.success ? (packagesRes.data || []) : []}
    />
  );
}
