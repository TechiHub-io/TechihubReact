// src/components/dashboard/ChartComponent.jsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function ChartComponent({ data, xKey, yKey, color, emptyMessage = "No data available" }) {
  const isDarkMode = useStore((state) => state.isDarkMode);
  
  // Determine colors based on theme
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  
  // Check if data is empty or all zero values
  const isDataEmpty = !data || 
                      data.length === 0 || 
                      !data.some(item => item[yKey] > 0);
  
  if (isDataEmpty) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xKey} 
          tick={{ fill: textColor }} 
          axisLine={{ stroke: gridColor }} 
        />
        <YAxis 
          tick={{ fill: textColor }} 
          axisLine={{ stroke: gridColor }} 
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: gridColor,
            color: textColor
          }}
        />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}