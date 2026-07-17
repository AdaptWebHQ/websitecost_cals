'use client';

import { useState } from 'react';
import DataTable from '@/components/shared/data-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Calculator, ChevronDown, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import type { Calculation } from '@/types';

interface EstimatesClientProps {
  initialCalculations: Calculation[];
}

export default function EstimatesClient({ initialCalculations }: EstimatesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(7);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const columns = [
    { key: 'businessName', label: 'Client Business', className: 'pl-6' },
    { key: 'websiteType', label: 'Website Type' },
    { key: 'packageName', label: 'Quotation Package' },
    { key: 'pages', label: 'Pages Count' },
    { key: 'total', label: 'Quoted Total' },
    { key: 'createdAt', label: 'Date Generated' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  const filteredCalculations = initialCalculations.filter((calc) => {
    const search = searchTerm.toLowerCase();
    return (
      calc.businessName?.toLowerCase().includes(search) ||
      calc.websiteType?.toLowerCase().includes(search) ||
      calc.packageName?.toLowerCase().includes(search)
    );
  });

  const visibleData = filteredCalculations.slice(0, visibleCount);

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

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by business, type, or package..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(7); // Reset pagination on search
          }}
          className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Listing Grid */}
      <DataTable
        columns={columns}
        data={visibleData}
        emptyMessage={searchTerm ? "No estimates match your search criteria." : "No calculations registered under your account yet."}
        renderRow={(calc) => (
          <TableRow key={calc.id} className="hover:bg-muted/40 border-border transition-colors duration-200">
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

      {filteredCalculations.length > visibleCount && (
        <div className="flex flex-col items-center gap-2 pt-2 animate-in fade-in duration-300">
          <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
            Showing {Math.min(visibleCount, filteredCalculations.length)} of {filteredCalculations.length} Estimates
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
