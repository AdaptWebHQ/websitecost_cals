import CalculationsChart from './calculations-chart';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, FileText, ChevronRight, Clock, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Calculation, Inquiry } from '@/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

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

  const estimatedPipelineValue = stats.totalLeads * 35000;
  const averageQuoteVal = 42500;

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-500 font-sans">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
              CRM SYSTEM
            </span>
            <span className="text-border">•</span>
            <span className="text-xs text-muted-foreground font-semibold">Real-time Telemetry Matrix</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Real-time performance metrics for AdaptWeb Ecosystem.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 bg-card hover:bg-muted border border-border text-foreground font-semibold rounded-lg text-xs transition-colors shadow-sm cursor-pointer">
            Export Report
          </button>
          <button className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors cursor-pointer">
            Generate Insights
          </button>
        </div>
      </section>

      {/* Metrics Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="card-custom p-4 flex flex-col justify-between transition-colors hover:bg-muted/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                +12.5%
              </span>
            </div>
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total Inquiries</h3>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalLeads}</p>
          </div>
          <div className="mt-2 h-8 w-full opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0 25 Q 10 10, 20 18 T 40 10 T 60 22 T 80 5 T 100 15"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
          </div>
        </div>

        {/* Active Packages */}
        <div className="card-custom p-4 flex flex-col justify-between transition-colors hover:bg-muted/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <FileText className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active Packages</h3>
            <p className="text-2xl font-bold text-foreground mt-1">5</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full border border-card bg-muted flex items-center justify-center text-[7px] font-bold">S</div>
              <div className="w-5 h-5 rounded-full border border-card bg-primary text-white flex items-center justify-center text-[7px] font-bold">E</div>
              <div className="w-5 h-5 rounded-full border border-card bg-secondary text-white flex items-center justify-center text-[7px] font-bold">P</div>
            </div>
            <span className="text-[9px] font-medium text-muted-foreground truncate">Starter, Enterprise, Pro</span>
          </div>
        </div>

        {/* Feature Count */}
        <div className="card-custom p-4 flex flex-col justify-between transition-colors hover:bg-muted/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            </div>
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Calculations Count</h3>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalCalculations}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 bg-muted rounded text-[8px] font-semibold text-muted-foreground">Booking Engine</span>
            <span className="px-1.5 py-0.5 bg-muted rounded text-[8px] font-semibold text-muted-foreground">API Mesh</span>
          </div>
        </div>

        {/* Revenue Estimate */}
        <div className="card-custom p-4 flex flex-col justify-between border-l-2 border-l-primary transition-colors hover:bg-muted/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Est. Potential Revenue</h3>
            <p className="text-2xl font-bold text-foreground mt-1">₹{(estimatedPipelineValue / 100000).toFixed(1)}L</p>
          </div>
          <p className="text-emerald-600 font-bold text-[9px] mt-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 pulse-active" /> Pipeline growth
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="card-custom p-2 shadow-sm overflow-hidden">
        <CalculationsChart calculations={calculations} />
      </div>

      {/* Secondary Section: Recent Inquiries & Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Recent Inquiries Table */}
        <div className="md:col-span-8 card-custom overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Recent Inquiries
              </h3>
              <Link href="/admin/inquiries">
                <button className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">View All</button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-border/80">
                    <TableHead className="px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Lead Name</TableHead>
                    <TableHead className="px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Budget</TableHead>
                    <TableHead className="px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Temp</TableHead>
                    <TableHead className="px-4 py-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/10">
                  {latestInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-xs font-medium">
                        No recent inquiries registered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    latestInquiries.map((inq) => (
                      <TableRow key={inq.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-[10px]">
                              {getInitials(inq.name)}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-foreground">{inq.name}</p>
                              <p className="text-[9px] text-muted-foreground mt-0.5">{inq.companyName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[10px] font-semibold text-muted-foreground">
                          <div>{inq.email}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">{inq.phone}</div>
                        </td>
                        <td className="px-4 py-2.5 text-[10px] font-semibold text-foreground">{inq.budget}</td>
                        <td className="px-4 py-2.5">
                          {inq.temperature === 'hot' ? (
                            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded-md font-bold text-[8px] uppercase tracking-wider inline-flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-red-500" />
                              HOT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md font-bold text-[8px] uppercase tracking-wider inline-flex items-center gap-1">
                              COLD
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Badge
                            className={`capitalize text-[8px] font-bold py-0 px-1.5`}
                            variant="outline"
                          >
                            {inq.status}
                          </Badge>
                        </td>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Focus Areas / Industry Split */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="card-custom p-4 flex flex-col justify-between flex-1">
            <h3 className="text-xs font-bold text-foreground mb-4">Industry Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-[10px]">
                  <span className="font-semibold text-foreground">Healthcare</span>
                  <span className="font-mono font-bold text-muted-foreground">34%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary rounded" style={{ width: '34%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-[10px]">
                  <span className="font-semibold text-foreground">Tourism</span>
                  <span className="font-mono font-bold text-muted-foreground">28%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-secondary rounded" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-[10px]">
                  <span className="font-semibold text-foreground">Real Estate</span>
                  <span className="font-mono font-bold text-muted-foreground">22%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-accent rounded" style={{ width: '22%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-[10px]">
                  <span className="font-semibold text-foreground">Fintech</span>
                  <span className="font-mono font-bold text-muted-foreground">16%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: '16%' }}></div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
