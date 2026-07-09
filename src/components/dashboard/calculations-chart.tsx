'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Calendar } from 'lucide-react';
import type { Calculation } from '@/types';

interface CalculationsChartProps {
  calculations: Calculation[];
}

type DateRangeType = '7d' | '30d' | '90d' | 'this_month' | 'last_month';

export default function CalculationsChart({ calculations }: CalculationsChartProps) {
  const [range, setRange] = useState<DateRangeType>('7d');

  // Aggregate calculation data based on selected range
  const chartData = useMemo(() => {
    const data: { date: string; count: number; rawDate: Date }[] = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (range === '7d') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = calculations.filter((c) => {
          const calcDate = new Date(c.createdAt);
          return calcDate.toDateString() === d.toDateString();
        }).length;

        data.push({ date: dateStr, count, rawDate: d });
      }
    } else if (range === '30d') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = calculations.filter((c) => {
          const calcDate = new Date(c.createdAt);
          return calcDate.toDateString() === d.toDateString();
        }).length;

        data.push({ date: dateStr, count, rawDate: d });
      }
    } else if (range === '90d') {
      // Last 90 days - grouped by weeks to prevent chart clutter
      // Let's create 13 weeks
      for (let i = 12; i >= 0; i--) {
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - (i * 7 + 6));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date();
        endOfWeek.setDate(today.getDate() - (i * 7));
        endOfWeek.setHours(23, 59, 59, 999);

        const label = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        const count = calculations.filter((c) => {
          const calcDate = new Date(c.createdAt);
          return calcDate >= startOfWeek && calcDate <= endOfWeek;
        }).length;

        data.push({ date: label, count, rawDate: startOfWeek });
      }
    } else if (range === 'this_month') {
      // From 1st of current month to today
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      const daysCount = today.getDate();

      for (let i = 0; i < daysCount; i++) {
        const d = new Date(startOfMonth);
        d.setDate(startOfMonth.getDate() + i);

        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = calculations.filter((c) => {
          const calcDate = new Date(c.createdAt);
          return calcDate.toDateString() === d.toDateString();
        }).length;

        data.push({ date: dateStr, count, rawDate: d });
      }
    } else if (range === 'last_month') {
      // Last month start to end
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      const daysInMonth = lastDayLastMonth.getDate();

      for (let i = 0; i < daysInMonth; i++) {
        const d = new Date(firstDayLastMonth);
        d.setDate(firstDayLastMonth.getDate() + i);

        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = calculations.filter((c) => {
          const calcDate = new Date(c.createdAt);
          return calcDate.toDateString() === d.toDateString();
        }).length;

        data.push({ date: dateStr, count, rawDate: d });
      }
    }

    return data;
  }, [calculations, range]);

  const totalCalculationsInRange = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  return (
    <Card className="bg-white dark:bg-slate-900/40 border-slate-250 dark:border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-sm dark:shadow-none">
      <CardHeader className="p-0 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Calculation Performance
          </CardTitle>
          <CardDescription className="text-slate-500">
            Monitor calculator tool engagement and volume generated
          </CardDescription>
        </div>

        {/* Date Filters Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
          {(
            [
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                range === opt.id
                  ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Simple inline range KPI statistics */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Calculations in Period</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCalculationsInRange}
              </div>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                cursor={{ stroke: 'rgba(99, 102, 241, 0.15)', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Calculations"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
