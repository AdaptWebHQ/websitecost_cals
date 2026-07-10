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

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Estimation Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historical registry of project estimates run under your profile account.
          </p>
        </div>
        <Link href="/public/calculator">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl h-12 px-5 font-bold shadow-md shadow-primary/10 cursor-pointer">
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
          <TableRow key={calc.id} className="hover:bg-muted/40 border-border">
            <TableCell className="font-bold text-foreground py-4 pl-6">
              {calc.businessName}
            </TableCell>
            <TableCell className="text-muted-foreground capitalize font-semibold">{calc.websiteType}</TableCell>
            <TableCell className="text-muted-foreground font-medium">
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 hover:bg-transparent font-bold">
                {calc.packageName}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground font-semibold">{calc.pages} Pages</TableCell>
            <TableCell className="text-emerald-600 dark:text-emerald-450 font-extrabold">{formatCurrency(calc.total)}</TableCell>
            <TableCell className="text-muted-foreground font-medium">{formatDate(calc.createdAt)}</TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/public/estimates/${calc.id}`}>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg h-10 w-10 flex items-center justify-center cursor-pointer">
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
