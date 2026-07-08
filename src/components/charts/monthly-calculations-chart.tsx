'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData } from '@/types';

interface MonthlyCalculationsChartProps {
  data: MonthlyData[];
}

export default function MonthlyCalculationsChart({ data }: MonthlyCalculationsChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
          />
          <Bar 
            dataKey="count" 
            fill="url(#indigoVioletGradient)" 
            radius={[6, 6, 0, 0]} 
            maxBarSize={45}
          />
          <defs>
            <linearGradient id="indigoVioletGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
