import { getIndustries } from '@/lib/industries';
import { getPackages } from '@/lib/packages';
import IndustriesClientPage from '@/components/admin/industries-client';

export const revalidate = 0; // Fetch dynamic data on every request

export default async function AdminIndustriesPage() {
  const [industries, packages] = await Promise.all([
    getIndustries(),
    getPackages(),
  ]);

  return <IndustriesClientPage initialIndustries={industries} packages={packages} />;
}
