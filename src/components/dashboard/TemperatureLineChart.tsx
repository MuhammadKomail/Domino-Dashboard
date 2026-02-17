import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

type Point = { name: string; temperature: number };

const TemperatureLineChart: React.FC<{ data?: Point[]; controls?: React.ReactNode }> = ({ data, controls }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Temperature" subtitle="Real-time" rightControls={controls}>
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data</div>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="Temperature" subtitle="Real-time" rightControls={controls}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default TemperatureLineChart;
