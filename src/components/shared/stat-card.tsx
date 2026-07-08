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
        'relative overflow-hidden bg-slate-900/60 border-slate-800/80 backdrop-blur-md p-6 rounded-2xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 group',
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300" />

      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            {value}
          </h3>
        </div>

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300">
          <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Footer info (Trend / description) */}
      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5',
                trend.isPositive
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-slate-500 truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
