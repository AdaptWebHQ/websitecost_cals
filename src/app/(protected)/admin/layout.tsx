import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

import CategorySyncProvider from '@/components/admin/category-sync-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CategorySyncProvider>{children}</CategorySyncProvider>;
}
