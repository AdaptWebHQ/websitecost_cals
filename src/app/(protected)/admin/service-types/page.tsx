import { Metadata } from 'next';
import { getServiceCategoriesAction } from '@/actions/service-category';
import { getServiceTypesAction } from '@/actions/service-types';
import ServiceTypesClientPage from '@/components/admin/service-types-client';

export const metadata: Metadata = {
  title: 'Service Types Management',
  description: 'Manage service types dynamically by category',
};

export const revalidate = 0; // Fresh fetch on every request

export default async function AdminServiceTypesPage() {
  const categoriesRes = await getServiceCategoriesAction(true); // only active categories

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

  const serviceTypesRes = await getServiceTypesAction(defaultCategory.id);

  return (
    <ServiceTypesClientPage
      categories={categories}
      initialCategoryId={defaultCategory.id}
      initialServiceTypes={serviceTypesRes.success ? (serviceTypesRes.data || []) : []}
    />
  );
}
