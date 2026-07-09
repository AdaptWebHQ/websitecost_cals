'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  iconName: string;
  description?: string;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  label,
  value,
  iconName,
  description,
  trend,
  className,
}: StatCardProps) {
  // Resolve Lucide Icon dynamically
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Icons.HelpCircle;

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/85 backdrop-blur-md p-6 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_-5px_rgba(77,142,255,0.15)] group shadow-sm dark:shadow-none',
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-300" />

      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {label}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {value}
          </h3>
        </div>

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 group-hover:text-primary group-hover:border-primary/30 transition-all duration-300">
          <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Footer info (Trend / description) */}
      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 text-[10px] uppercase tracking-wider',
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/15'
                  : 'bg-red-500/10 text-red-450 border border-red-500/15'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-slate-500 truncate text-[11px]">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
