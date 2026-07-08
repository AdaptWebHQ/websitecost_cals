import { getInquiries } from '@/lib/inquiries';
import DataTable from '@/components/shared/data-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Eye, MessageSquare } from 'lucide-react';

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  const columns = [
    { key: 'company', label: 'Lead Company', className: 'pl-6' },
    { key: 'name', label: 'Primary Contact' },
    { key: 'budget', label: 'Estimated Budget' },
    { key: 'status', label: 'CRM Stage' },
    { key: 'createdAt', label: 'Inquiry Date' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">CRM Lead Inquiries</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track interest, assign sales reps, log interactions, and follow-up with quotation leads.
        </p>
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={inquiries}
        emptyMessage="No leads logged in CRM registry yet."
        renderRow={(inq) => (
          <TableRow key={inq.id} className="hover:bg-slate-900/20 border-slate-800/60">
            <TableCell className="font-semibold text-white py-4 pl-6">
              <div className="flex flex-col">
                <span>{inq.companyName}</span>
                <span className="text-xs text-slate-500 font-normal mt-0.5">
                  {inq.phone}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-slate-300 font-medium">
              <div className="flex flex-col">
                <span>{inq.name}</span>
                <span className="text-xs text-slate-500 font-normal mt-0.5">
                  {inq.email}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-slate-300 font-semibold">{inq.budget}</TableCell>
            <TableCell>
              {inq.status === 'new' && (
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-transparent">
                  New Lead
                </Badge>
              )}
              {inq.status === 'contacted' && (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-transparent">
                  Contacted
                </Badge>
              )}
              {inq.status === 'booked' && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-transparent">
                  Booked / Sold
                </Badge>
              )}
              {inq.status === 'lost' && (
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-transparent">
                  Lost Deal
                </Badge>
              )}
              {!['new', 'contacted', 'booked', 'lost'].includes(inq.status) && (
                <Badge className="bg-slate-800 text-slate-400 border-slate-800 hover:bg-transparent capitalize">
                  {inq.status}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-slate-400">{formatDate(inq.createdAt)}</TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-lg">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-indigo-400 hover:text-indigo-300 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
