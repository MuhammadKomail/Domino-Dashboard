import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

export type GallonsPoint = { name: string; gallons: number };

const GallonsBarChart: React.FC<{ data?: GallonsPoint[]; title?: string; controls?: React.ReactNode }> = ({ data, title = 'Gallons Pumped', controls }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={title} subtitle="" rightControls={controls}>
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data</div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle="" rightControls={controls}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(v: any) => {
              const d = new Date(String(v));
              return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
            }}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="gallons" fill="#E92137" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default GallonsBarChart;
