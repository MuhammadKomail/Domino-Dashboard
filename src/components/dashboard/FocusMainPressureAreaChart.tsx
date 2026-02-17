import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

type Point = { name: string; pressure: number };

const FocusMainPressureAreaChart: React.FC<{ data?: Point[]; controls?: React.ReactNode }> = ({ data, controls }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Focus Main Pressure" subtitle="Real-time" rightControls={controls}>
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data</div>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="Focus Main Pressure" subtitle="Real-time" rightControls={controls}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
          <Area type="monotone" dataKey="pressure" stroke="#F59E0B" fill="#FDE68A" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default FocusMainPressureAreaChart;
