import { getPackages } from '@/lib/packages';
import PackagesClientPage from '@/components/admin/packages-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminPackagesPage() {
  const packages = await getPackages();
  return (
    <PackagesClientPage
      initialPackages={packages}
    />
  );
}

