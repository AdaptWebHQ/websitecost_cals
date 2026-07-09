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
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-[#3a4a5f]/40 text-[#adc6ff] rounded font-mono text-[10px] uppercase tracking-widest font-semibold border border-[#adc6ff]/15">
              Client Portal
            </span>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, <span className="text-[#adc6ff]">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-slate-450 font-normal leading-relaxed">
            Configure, manage, and inspect your custom project estimations.
          </p>
        </div>
        <Link href="/dashboard/public/calculator">
          <Button className="bg-primary text-on-primary-fixed px-6 py-4.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg subtle-glow flex items-center gap-2 border border-primary/20">
            <Calculator className="w-4.5 h-4.5" />
            New Estimate
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-slate-900/60 border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalEstimates}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Estimates</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{formatCurrency(avgValue)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Average Quote Value</p>
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-violet-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{latestDate || '—'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Last Estimate Generated</p>
          </div>
        </Card>
      </div>

      {/* Recent Estimates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Recent Estimates
          </h2>
          {totalEstimates > 5 && (
            <Link
              href="/dashboard/public/estimates"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentCalculations.length === 0 ? (
          <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-7 h-7 text-indigo-400" />
            </div>
            <p className="text-white font-semibold mb-1">No estimates yet</p>
            <p className="text-slate-500 text-sm mb-6">
              Launch the cost calculator to generate your first quotation estimate instantly.
            </p>
            <Link href="/dashboard/public/calculator">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold">
                Launch Calculator
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentCalculations.map((calc) => (
              <Link
                key={calc.id}
                href={`/dashboard/public/estimates/${calc.id}`}
                className="block group"
              >
                <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl px-5 py-4 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4.5 h-4.5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-sm">{calc.businessName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className="border-slate-700 text-slate-500 text-[10px] px-1.5 py-0 hover:bg-transparent capitalize"
                          >
                            {calc.websiteType}
                          </Badge>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-slate-500 text-xs">{calc.packageName}</span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-slate-500 text-xs">{calc.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 text-right">
                      <div>
                        <p className="text-emerald-400 font-bold text-sm">{formatCurrency(calc.total)}</p>
                        <p className="text-slate-600 text-[10px] mt-0.5">{formatDate(calc.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/dashboard/public/calculator" className="group block">
          <Card className="bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all duration-200 hover:from-indigo-600/15 hover:to-violet-600/15">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Build a New Estimate</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Use our multi-step wizard to get an instant cost breakdown for your website project.
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/public/estimates" className="group block">
          <Card className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-200 hover:from-emerald-600/15 hover:to-teal-600/15">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Browse Estimate History</p>
                <p className="text-sm text-slate-400 leading-relaxed">
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
