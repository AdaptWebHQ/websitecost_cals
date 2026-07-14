import { getPackages } from '@/lib/packages';
import { getFeatures } from '@/lib/features';
import PackagesClientPage from '@/components/admin/packages-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminPackagesPage() {
  const packages = await getPackages();
  const features = await getFeatures();
  return <PackagesClientPage initialPackages={packages} allFeatures={features} />;
}
