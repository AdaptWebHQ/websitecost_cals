import { getServerUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { getCalculations } from '@/lib/calculations';
import { getInquiries } from '@/lib/inquiries';
import { getDashboardStats } from '@/lib/analytics';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import PublicDashboard from '@/components/dashboard/public-dashboard';

export const revalidate = 0; // Dynamic on every render

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin' || user.role === 'super_admin') {
    const [stats, calculations, inquiries] = await Promise.all([
      getDashboardStats(),
      getCalculations(),
      getInquiries(),
    ]);

    // Serialize Dates to ISO strings to avoid Next.js serialization warnings
    const serializedCalculations = calculations.map((c) => ({
      ...c,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : new Date(c.createdAt).toISOString(),
      updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : new Date(c.updatedAt).toISOString(),
    }));

    const serializedInquiries = inquiries.map((i) => ({
      ...i,
      createdAt: i.createdAt instanceof Date ? i.createdAt.toISOString() : new Date(i.createdAt).toISOString(),
      updatedAt: i.updatedAt instanceof Date ? i.updatedAt.toISOString() : new Date(i.updatedAt).toISOString(),
      followUpDate: i.followUpDate
        ? i.followUpDate instanceof Date
          ? i.followUpDate.toISOString()
          : new Date(i.followUpDate).toISOString()
        : null,
    }));

    return (
      <AdminDashboard
        stats={stats}
        calculations={serializedCalculations as any}
        inquiries={serializedInquiries as any}
      />
    );
  }

  const calculations = await getCalculations(user.id);

  const serializedCalculations = calculations.map((c) => ({
    ...c,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : new Date(c.createdAt).toISOString(),
    updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : new Date(c.updatedAt).toISOString(),
  }));

  const serializedUser = {
    ...user,
    lastLogin: user.lastLogin ? (user.lastLogin instanceof Date ? user.lastLogin.toISOString() : new Date(user.lastLogin).toISOString()) : null,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date(user.createdAt).toISOString(),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : new Date(user.updatedAt).toISOString(),
  };

  return (
    <PublicDashboard
      user={serializedUser as any}
      calculations={serializedCalculations as any}
    />
  );
}

