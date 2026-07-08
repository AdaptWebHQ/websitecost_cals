import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  renderRow,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-xl">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-slate-900/80 border-b border-slate-800">
            <TableRow className="hover:bg-transparent border-slate-800">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.className || 'text-slate-400 font-semibold text-xs tracking-wider uppercase py-4'}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    <span className="text-sm font-medium tracking-wide">Loading records...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500 font-medium text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
