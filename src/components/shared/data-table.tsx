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
    <Card className="overflow-hidden bg-card border-border backdrop-blur-md rounded-xl">
      <Table>
        <TableHeader className="bg-muted/30 border-b border-border">
          <TableRow className="hover:bg-transparent border-border">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.className || 'text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4'}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent border-border">
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-sm font-medium tracking-wide">Loading records...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent border-border">
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground font-medium text-sm"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
