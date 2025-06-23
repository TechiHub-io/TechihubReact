// src/components/dashboard/PieChart.jsx
'use client';
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function PieChart({ data = [], emptyMessage = "No data available" }) {
  const isDarkMode = useStore((state) => state.isDarkMode);
  
  // Determine colors based on theme
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  
  // Check if data is empty or all zero values
  const isDataEmpty = !data || 
                      data.length === 0 || 
                      !data.some(item => item.value > 0);
  
  if (isDataEmpty) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} applications`, 'Count']}
          contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderRadius: '0.375rem',
            padding: '0.5rem'
          }}
          itemStyle={{
            color: textColor
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}