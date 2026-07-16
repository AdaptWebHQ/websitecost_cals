import { getAddons } from '@/lib/addons';
import { getAddonCategories } from '@/lib/addons/categories';
import AddonsClientPage from '@/components/admin/addons-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminAddonsPage() {
  const [addons, categories] = await Promise.all([
    getAddons(),
    getAddonCategories(),
  ]);

  return <AddonsClientPage initialCategories={categories} initialAddons={addons} />;
}
