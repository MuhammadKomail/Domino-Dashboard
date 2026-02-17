import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

export type PressurePoint = { name: string; pressure: number };

const FocusMainPressureBarChart: React.FC<{ data?: PressurePoint[]; controls?: React.ReactNode }> = ({ data, controls }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Focus Main Pressure" subtitle="" rightControls={controls}>
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data</div>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="Focus Main Pressure" subtitle="" rightControls={controls}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="pressure" fill="#EA860A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default FocusMainPressureBarChart;
