import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/actions/auth';
import CategorySyncProvider from '@/components/admin/category-sync-provider';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    redirect('/dashboard');
  }

  return <CategorySyncProvider>{children}</CategorySyncProvider>;
}

