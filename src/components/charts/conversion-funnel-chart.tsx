'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface ConversionFunnelChartProps {
  data: ChartDataPoint[];
}

export default function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
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
            width={90}
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
            maxBarSize={25}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
