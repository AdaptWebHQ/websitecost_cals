import { getServerUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { getCalculations } from '@/lib/calculations';
import {
  getDashboardStats,
  getMonthlyCalculations,
  getLeadStatusDistribution,
  getIndustryDistribution,
  getPackagePopularity,
  getFeatureUsage,
  getConversionFunnel,
} from '@/lib/analytics';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import PublicDashboard from '@/components/dashboard/public-dashboard';

export const revalidate = 0; // Dynamic on every render

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin' || user.role === 'super_admin') {
    const [
      stats,
      monthlyData,
      leadStatus,
      industryDist,
      packagePopularity,
      featureUsage,
      conversionFunnel,
    ] = await Promise.all([
      getDashboardStats(),
      getMonthlyCalculations(),
      getLeadStatusDistribution(),
      getIndustryDistribution(),
      getPackagePopularity(),
      getFeatureUsage(),
      getConversionFunnel(),
    ]);

    return (
      <AdminDashboard
        stats={stats}
        monthlyData={monthlyData}
        leadStatus={leadStatus}
        industryDist={industryDist}
        packagePopularity={packagePopularity}
        featureUsage={featureUsage}
        conversionFunnel={conversionFunnel}
      />
    );
  }

  const calculations = await getCalculations(user.id);

  return (
    <PublicDashboard
      user={user}
      calculations={calculations}
    />
  );
}
