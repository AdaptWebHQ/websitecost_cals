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
    <Card className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <CardHeader className="p-0 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            Calculation Performance
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Monitor calculator tool engagement and volume generated
          </CardDescription>
        </div>

        {/* Date Filters Tabs */}
        <div className="flex flex-wrap gap-0.5 bg-muted p-0.5 rounded-lg border border-border">
          {(
            [
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRange(opt.id)}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors duration-150 ${
                range === opt.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Simple inline range KPI statistics */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-muted/40 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-semibold">Calculations in Period</div>
              <div className="text-xl font-bold text-foreground">
                {totalCalculationsInRange}
              </div>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '11px',
                }}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1.5 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Calculations"
                stroke="var(--primary)"
                strokeWidth={1.5}
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
