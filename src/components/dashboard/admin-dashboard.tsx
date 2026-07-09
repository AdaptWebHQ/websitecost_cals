import CalculationsChart from './calculations-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Flame, Snowflake, MessageSquare, ArrowRight, Calculator, CheckSquare, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Calculation, Inquiry } from '@/types';

interface AdminDashboardProps {
  stats: {
    totalCalculations: number;
    totalLeads: number;
    convertedLeads: number;
    hotLeads: number;
    coldLeads: number;
  };
  calculations: Calculation[];
  inquiries: Inquiry[];
}

export default function AdminDashboard({
  stats,
  calculations,
  inquiries,
}: AdminDashboardProps) {
  const latestInquiries = inquiries.slice(0, 5);

  // Compute mock financial metrics for the Amber pricing card
  const estimatedPipelineValue = stats.totalLeads * 35000;
  const averageQuoteVal = 42500;

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-5%] right-[10%] w-[35%] h-[35%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-20" />
      <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-20" />

      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 bg-[#06b6d4]/10 text-[#06b6d4] rounded-full font-mono text-[10px] uppercase tracking-widest font-semibold border border-[#06b6d4]/20">
              Telemetry Bento Matrix
            </span>
            <div className="h-px w-12 bg-border"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Workspace Overview
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Monitor real-time calculations metrics, track sales pipeline conversion performance, and engage incoming CRM leads.
          </p>
        </div>
      </header>

      {/* Telemetry Bento Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Amber Finance / Pipeline Value Bento Card - Col Span 2 */}
        <div className="md:col-span-2 glass-bento ambient-glow-amber border border-border/50 rounded-3xl p-6 flex flex-col justify-between haptic-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pipeline Valuation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="my-6">
            <span className="text-sm font-semibold text-amber-500 block mb-1">Estimated Pipeline Value</span>
            <span className="text-5xl font-black tracking-tight text-foreground">
              ₹{(estimatedPipelineValue / 100000).toFixed(1)}L
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              Based on average quote size of ₹{averageQuoteVal.toLocaleString()}
            </p>
          </div>
          <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
            <span>Avg. Lead Quote</span>
            <span className="font-semibold text-foreground">₹{(averageQuoteVal / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Calculations / Volume Bento Card - Col Span 2 */}
        <div className="md:col-span-2 glass-bento ambient-glow-purple border border-border/50 rounded-3xl p-6 flex flex-col justify-between haptic-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Public Interaction</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="my-6">
            <span className="text-sm font-semibold text-purple-500 block mb-1">Total Calculations</span>
            <span className="text-5xl font-black tracking-tight text-foreground">{stats.totalCalculations}</span>
            <p className="text-xs text-muted-foreground mt-2">Public quotation calculator executions</p>
          </div>
          <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
            <span>Converted Projects</span>
            <span className="font-semibold text-foreground">{stats.convertedLeads}</span>
          </div>
        </div>

        {/* CRM Leads & Priority Bento Card - Col Span 2 */}
        <div className="md:col-span-2 glass-bento ambient-glow-cyan border border-border/50 rounded-3xl p-6 flex flex-col justify-between haptic-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CRM Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
            </div>
          </div>
          <div className="my-6 space-y-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-0.5">Total Inquiries Received</span>
              <span className="text-4xl font-extrabold tracking-tight text-foreground">{stats.totalLeads}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-active" style={{ '--pulse-color': '#ef4444' } as any} />
                <span>{stats.hotLeads} Hot Leads</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>{stats.coldLeads} Cold / New</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
            <span>Priority Conversion</span>
            <span className="font-semibold text-foreground">
              {stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Calculations Analytics Chart (Emerald Accent) */}
      <div className="glass-bento ambient-glow-emerald border border-border/50 rounded-3xl p-1 shadow-sm overflow-hidden haptic-shadow">
        <CalculationsChart calculations={calculations} />
      </div>

      {/* 3. Latest 5 Inquiries Bento Workspace */}
      <Card className="glass-bento border border-border/50 rounded-3xl p-6 shadow-sm haptic-shadow">
        <CardHeader className="p-0 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] pulse-active" />
              Incoming Leads Queue
            </CardTitle>
            <CardDescription>
              Recent client submissions and calculator leads needing response
            </CardDescription>
          </div>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06b6d4] hover:text-[#06b6d4]/90 transition-colors"
          >
            Open CRM Board
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0 border-t border-border/40">
          {latestInquiries.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No inquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="font-semibold text-foreground">Name / Company</TableHead>
                    <TableHead className="font-semibold text-foreground">Contact</TableHead>
                    <TableHead className="font-semibold text-foreground">Budget</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Priority</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestInquiries.map((inq) => {
                    const submissionDate = new Date(inq.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <TableRow key={inq.id} className="border-border/40 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="text-sm font-semibold">{inq.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{inq.companyName}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{inq.email}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{inq.phone}</div>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {inq.budget}
                        </TableCell>
                        <TableCell className="text-center">
                          {inq.temperature === 'hot' ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 inline-flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-active" style={{ '--pulse-color': '#ef4444' } as any} />
                              Hot Lead
                            </Badge>
                          ) : inq.temperature === 'cold' ? (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 inline-flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              Cold Lead
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`capitalize ${
                              inq.status === 'new'
                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                : inq.status === 'contacted'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : inq.status === 'proposal_sent'
                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                : inq.status === 'converted'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}
                            variant="outline"
                          >
                            {inq.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {submissionDate}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
