import type { Metadata } from 'next';
import CategorySyncProvider from '@/components/admin/category-sync-provider';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CategorySyncProvider>{children}</CategorySyncProvider>;
}


