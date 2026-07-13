import { getServerUser } from '@/actions/auth';
import { getCalculations } from '@/lib/calculations';
import EmptyState from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EstimatesClient from '@/components/public/estimates-client';

export const revalidate = 0;

export default async function PublicEstimatesPage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
        Please sign in to view your quotation logs.
      </div>
    );
  }

  const calculations = await getCalculations(user.id);

  if (calculations.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center animate-in fade-in duration-300">
        <EmptyState
          title="No Estimates Found"
          description="You haven't run any cost calculations yet. Get started by launching our multi-step cost estimator wizard."
          iconName="Calculator"
        />
        <div className="mt-6">
          <Link href="/public/calculator">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 font-bold shadow-md shadow-primary/10 cursor-pointer">
              Launch Estimator
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date values to plain string to keep Next.js props serialization clean
  const serializableCalculations = calculations.map((calc) => ({
    ...calc,
    createdAt: calc.createdAt instanceof Date ? calc.createdAt.toISOString() : calc.createdAt,
  }));

  return <EstimatesClient initialCalculations={serializableCalculations} />;
}
