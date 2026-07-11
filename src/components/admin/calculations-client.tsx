'use client';

import { useState } from 'react';
import DataTable from '@/components/shared/data-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Trash, ChevronDown, Loader2 } from 'lucide-react';
import ExportCalculationsButton from './export-calculations-button';

interface CalculationsClientProps {
  initialCalculations: any[];
}

export default function CalculationsClient({ initialCalculations }: CalculationsClientProps) {
  const [visibleCount, setVisibleCount] = useState(7);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const columns = [
    { key: 'businessName', label: 'Client Business', className: 'pl-6' },
    { key: 'industry', label: 'Industry & Stack' },
    { key: 'packageName', label: 'Recommended Tier' },
    { key: 'pages', label: 'Pages Count' },
    { key: 'total', label: 'Quoted Total' },
    { key: 'createdAt', label: 'Date generated' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  const visibleData = initialCalculations.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 7);
      setIsLoadingMore(false);
    }, 400); // Simulated delay for professional query experience
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotation Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historical log of every calculation generated on the public cost estimator.
          </p>
        </div>
        <ExportCalculationsButton />
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={visibleData}
        emptyMessage="No calculation runs logged in the database yet."
        renderRow={(calc) => (
          <TableRow key={calc.id} className="hover:bg-muted/40 border-border transition-colors duration-200">
            <TableCell className="font-semibold text-foreground py-4 pl-6">
              <div className="flex flex-col">
                <span>{calc.businessName}</span>
                <span className="text-xs text-muted-foreground font-normal mt-0.5">
                  {calc.businessEmail}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground font-medium">
              <div className="flex flex-col">
                <span>{calc.industryName}</span>
                <span className="text-xs text-indigo-400 font-normal mt-0.5 capitalize">
                  {calc.websiteType}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground font-medium">
              <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-transparent">
                {calc.packageName}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground font-medium">{calc.pages} Pages</TableCell>
            <TableCell className="text-emerald-400 font-bold">{formatCurrency(calc.total)}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(calc.createdAt)}</TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
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

      {initialCalculations.length > visibleCount && (
        <div className="flex flex-col items-center gap-2 pt-2 animate-in fade-in duration-300">
          <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
            Showing {Math.min(visibleCount, initialCalculations.length)} of {initialCalculations.length} Calculations
          </p>
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl px-6 py-2.5 shadow-md cursor-pointer text-xs disabled:opacity-50 min-w-44 justify-center"
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {isLoadingMore ? 'Syncing...' : `Load More (+7)`}
          </Button>
        </div>
      )}
    </div>
  );
}
