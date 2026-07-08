'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface FeatureUsageChartProps {
  data: ChartDataPoint[];
}

export default function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  // Sort from highest to lowest usage
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
        >
          {/* Note: layout is set to vertical for horizontal bar chart in Recharts */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          {/* Swap X and Y axes for horizontal layout */}
          <XAxis 
            type="number"
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="category"
            dataKey="label" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={100}
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
            dataKey="value" 
            layout="vertical"
            radius={[0, 6, 6, 0]} 
            maxBarSize={20}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
