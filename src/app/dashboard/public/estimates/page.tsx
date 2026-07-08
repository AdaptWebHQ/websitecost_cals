import { getServerUser } from '@/actions/auth';
import { getCalculations } from '@/lib/calculations';
import DataTable from '@/components/shared/data-table';
import EmptyState from '@/components/shared/empty-state';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Calculator } from 'lucide-react';
import Link from 'next/link';

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

  const columns = [
    { key: 'businessName', label: 'Client Business', className: 'pl-6' },
    { key: 'websiteType', label: 'Website Type' },
    { key: 'packageName', label: 'Quotation Package' },
    { key: 'pages', label: 'Pages Count' },
    { key: 'total', label: 'Quoted Total' },
    { key: 'createdAt', label: 'Date Generated' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  if (calculations.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center">
        <EmptyState
          title="No Estimates Found"
          description="You haven't run any cost calculations yet. Get started by launching our multi-step cost estimator wizard."
          iconName="Calculator"
        />
        <div className="mt-6">
          <Link href="/dashboard/public/calculator">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-6 font-semibold shadow-lg shadow-indigo-600/10">
              Launch Estimator
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Estimation Logs</h1>
          <p className="text-sm text-slate-400 mt-1">
            Historical registry of project estimates run under your profile account.
          </p>
        </div>
        <Link href="/dashboard/public/calculator">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-11 px-5">
            <Calculator className="w-5 h-5" />
            New Estimate
          </Button>
        </Link>
      </div>

      {/* Listing Grid */}
      <DataTable
        columns={columns}
        data={calculations}
        emptyMessage="No calculations registered under your account yet."
        renderRow={(calc) => (
          <TableRow key={calc.id} className="hover:bg-slate-900/20 border-slate-800/60">
            <TableCell className="font-semibold text-white py-4 pl-6">
              {calc.businessName}
            </TableCell>
            <TableCell className="text-slate-300 capitalize">{calc.websiteType}</TableCell>
            <TableCell className="text-slate-300 font-medium">
              <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-transparent">
                {calc.packageName}
              </Badge>
            </TableCell>
            <TableCell className="text-slate-300 font-medium">{calc.pages} Pages</TableCell>
            <TableCell className="text-emerald-400 font-bold">{formatCurrency(calc.total)}</TableCell>
            <TableCell className="text-slate-400">{formatDate(calc.createdAt)}</TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/dashboard/public/estimates/${calc.id}`}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-lg">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
