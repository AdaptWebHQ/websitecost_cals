import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Calculator, FileText, ChevronRight, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { User, Calculation } from '@/types';

interface PublicDashboardProps {
  user: User;
  calculations: Calculation[];
}

export default function PublicDashboard({ user, calculations }: PublicDashboardProps) {
  const recentCalculations = calculations.slice(0, 5);

  // Quick stats
  const totalEstimates = calculations.length;
  const totalValue = calculations.reduce((acc, c) => acc + (c.total || 0), 0);
  const avgValue = totalEstimates > 0 ? totalValue / totalEstimates : 0;
  const latestDate = calculations[0]?.createdAt ? formatDate(calculations[0].createdAt) : null;

  return (
    <div className="space-y-5 pb-8 animate-in fade-in-50 duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-2xl font-sans">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-mono text-[9px] uppercase tracking-widest font-bold border border-primary/15">
              Client Portal
            </span>
            <div className="h-px w-10 bg-border"></div>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-1">
            Welcome back, <span className="text-primary dark:text-blue-400">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-xs text-muted-foreground font-normal leading-relaxed">
            Configure, manage, and inspect your custom project estimations.
          </p>
        </div>
        <Link href="/public/calculator">
          <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Calculator className="w-4 h-4" />
            New Estimate
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
        <Card className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 transition-colors hover:bg-muted/10 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{totalEstimates}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Total Estimates</p>
          </div>
        </Card>

        <Card className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 transition-colors hover:bg-muted/10 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(avgValue)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Average Quote Value</p>
          </div>
        </Card>

        <Card className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 transition-colors hover:bg-muted/10 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground truncate max-w-[150px]">{latestDate || '—'}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Last Estimate Generated</p>
          </div>
        </Card>
      </div>

      {/* Recent Estimates */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Recent Estimates
          </h2>
          {totalEstimates > 5 && (
            <Link
              href="/public/estimates"
              className="text-[10px] text-primary hover:text-primary/85 flex items-center gap-0.5 transition-colors font-semibold"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {recentCalculations.length === 0 ? (
          <Card className="bg-muted/10 border border-border rounded-xl p-8 text-center shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <p className="text-foreground font-semibold text-sm mb-0.5">No estimates yet</p>
            <p className="text-muted-foreground text-xs mb-4 max-w-xs mx-auto leading-relaxed">
              Launch the cost calculator to generate your first quotation estimate instantly.
            </p>
            <Link href="/public/calculator">
              <Button className="bg-primary hover:bg-primary/95 text-white rounded-lg h-9 px-4 font-semibold text-xs shadow-sm cursor-pointer">
                Launch Calculator
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {recentCalculations.map((calc) => (
              <Link
                key={calc.id}
                href={`/public/estimates/${calc.id}`}
                className="block group"
              >
                <Card className="bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors shadow-sm cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate text-xs">{calc.businessName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          <Badge
                            variant="outline"
                            className="border-border text-muted-foreground text-[9px] px-1 py-0 hover:bg-transparent capitalize font-semibold"
                          >
                            {calc.websiteType}
                          </Badge>
                          <span className="text-border">·</span>
                          <span className="text-muted-foreground">{calc.packageName}</span>
                          <span className="text-border">·</span>
                          <span className="text-muted-foreground">{calc.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 text-right">
                      <div>
                        <p className="text-primary font-bold text-xs">{formatCurrency(calc.total)}</p>
                        <p className="text-muted-foreground text-[9px] mt-0.5">{formatDate(calc.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
        <Link href="/public/calculator" className="group block">
          <Card className="bg-card border border-border rounded-xl p-4 hover:border-primary/45 transition-colors shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-xs mb-0.5">Build a New Estimate</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Use our multi-step wizard to get an instant cost breakdown for your website project.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/public/estimates" className="group block">
          <Card className="bg-card border border-border rounded-xl p-4 hover:border-primary/45 transition-colors shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-xs mb-0.5">Browse Estimate History</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  View, download or share PDF quotes from all your previous project estimations.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
