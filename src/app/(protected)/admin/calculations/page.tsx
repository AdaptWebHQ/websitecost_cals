import { getCalculationsPage } from '@/lib/calculations';
import CalculationsClient from '@/components/admin/calculations-client';

export const revalidate = 0;

export default async function AdminCalculationsPage() {
  const page = await getCalculationsPage({ limit: 25 });
  const serializableCalculations = page.items.map((calc) => ({
    ...calc,
    createdAt: calc.createdAt instanceof Date ? calc.createdAt.toISOString() : calc.createdAt,
    updatedAt: calc.updatedAt instanceof Date ? calc.updatedAt.toISOString() : calc.updatedAt,
  }));

  return (
    <CalculationsClient
      initialCalculations={serializableCalculations}
      initialNextCursor={page.nextCursor}
      initialHasMore={page.hasMore}
    />
  );
}
