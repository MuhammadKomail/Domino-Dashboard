import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

export type TemperaturePoint = { name: string; temp: number };

const TemperatureBarChart: React.FC<{ data?: TemperaturePoint[]; controls?: React.ReactNode }> = ({ data, controls }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Temperature (Real-time)" subtitle="" rightControls={controls}>
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data</div>
      </ChartCard>
    );
  }
  return (
    <ChartCard title="Temperature (Real-time)" subtitle="" rightControls={controls}>
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
          <Bar dataKey="temp" fill="#9AC40C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default TemperatureBarChart;
