// src/components/analytics/ApplicationsChart.jsx
'use client';
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function ApplicationsChart({ data = [] }) {
  const isDarkMode = useStore(state => state.isDarkMode);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }
  
  // Determine colors based on theme
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  
  // Colors for different application statuses
  const statusColors = {
    'applied': '#60A5FA',      // blue-400
    'screening': '#F59E0B',    // amber-500
    'interview': '#8B5CF6',    // violet-500
    'assessment': '#EC4899',   // pink-500
    'offer': '#10B981',        // emerald-500
    'hired': '#34D399',        // green-400
    'rejected': '#EF4444',     // red-500
    'withdrawn': '#9CA3AF',    // gray-400
  };
  
  // Prepare data
  const chartData = data.map(status => ({
    name: status.status_display || status.status,
    value: status.count,
    color: statusColors[status.status] || '#9CA3AF',
  }));
  
  // Custom legend
  const renderCustomizedLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{entry.value}: {entry.payload.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Custom label inside pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't render small slices
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={90}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
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
          content={renderCustomizedLegend}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}