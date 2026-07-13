import { getCalculations } from '@/lib/calculations';
import CalculationsClient from '@/components/admin/calculations-client';

export const revalidate = 0;

export default async function AdminCalculationsPage() {
  const calculations = await getCalculations();

  // Format date values to plain string to keep Next.js props serialization clean
  const serializableCalculations = calculations.map((calc) => ({
    ...calc,
    createdAt: calc.createdAt instanceof Date ? calc.createdAt.toISOString() : calc.createdAt,
  }));

  return <CalculationsClient initialCalculations={serializableCalculations} />;
}
