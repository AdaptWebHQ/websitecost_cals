import { redirect } from 'next/navigation';
import { getServerUser } from '@/actions/auth';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user || user.role === 'admin' || user.role === 'super_admin') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
