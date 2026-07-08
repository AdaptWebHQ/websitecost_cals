import { getCalculations } from '@/lib/calculations';
import DataTable from '@/components/shared/data-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, FileText, Trash } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCalculationsPage() {
  const calculations = await getCalculations();

  const columns = [
    { key: 'businessName', label: 'Client Business', className: 'pl-6' },
    { key: 'industry', label: 'Industry & Stack' },
    { key: 'packageName', label: 'Recommended Tier' },
    { key: 'pages', label: 'Pages Count' },
    { key: 'total', label: 'Quoted Total' },
    { key: 'createdAt', label: 'Date generated' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Quotation Logs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical log of every calculation generated on the public cost estimator.
        </p>
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={calculations}
        emptyMessage="No calculation runs logged in the database yet."
        renderRow={(calc) => (
          <TableRow key={calc.id} className="hover:bg-slate-900/20 border-slate-800/60">
            <TableCell className="font-semibold text-white py-4 pl-6">
              <div className="flex flex-col">
                <span>{calc.businessName}</span>
                <span className="text-xs text-slate-500 font-normal mt-0.5">
                  {calc.businessEmail}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-slate-300 font-medium">
              <div className="flex flex-col">
                <span>{calc.industryName}</span>
                <span className="text-xs text-indigo-400 font-normal mt-0.5 capitalize">
                  {calc.websiteType}
                </span>
              </div>
            </TableCell>
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
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-lg">
                  <Eye className="w-4 h-4" />
                </Button>
                {calc.pdfUrl && (
                  <Button variant="ghost" size="icon" className="text-indigo-400 hover:text-indigo-300 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 rounded-lg">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
