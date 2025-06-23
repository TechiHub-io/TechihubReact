// src/components/analytics/JobPerformanceChart.jsx
'use client';
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function JobPerformanceChart({ data = [], metricType = 'views' }) {
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
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  
  // Determine the bar color based on metric type
  const getBarColor = () => {
    switch (metricType) {
      case 'views':
        return '#60A5FA'; // blue
      case 'applications':
        return '#10B981'; // green
      case 'conversion':
        return '#8B5CF6'; // purple
      default:
        return '#0CCE68'; // default primary
    }
  };
  
  // Prepare data
  const chartData = data.map(item => ({
    name: trimJobTitle(item.job_title),
    [metricType]: metricType === 'conversion' ? parseFloat(item.conversion_rate) : item[metricType] || 0,
    fullName: item.job_title,
    id: item.job_id
  }));
  
  // Sort data for better visualization
  chartData.sort((a, b) => b[metricType] - a[metricType]);
  
  // Function to trim long titles
  function trimJobTitle(title) {
    if (!title) return 'Unknown Job';
    return title.length > 20 ? title.substring(0, 20) + '...' : title;
  }
  
  // Format tooltip value based on metric type
  const formatTooltipValue = (value) => {
    if (metricType === 'conversion') {
      return `${value}%`;
    }
    return value;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 40,
          bottom: 5,
        }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={gridColor} 
          horizontal={true}
          vertical={false}
        />
        <XAxis 
          type="number" 
          tick={{ fill: textColor }} 
          axisLine={{ stroke: gridColor }} 
        />
        <YAxis 
          type="category"
          dataKey="name" 
          tick={{ fill: textColor }} 
          axisLine={{ stroke: gridColor }}
          width={120}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: gridColor,
            color: textColor
          }}
          formatter={(value, name, props) => [
            formatTooltipValue(value), 
            metricType === 'views' ? 'Views' : 
              metricType === 'applications' ? 'Applications' : 
              'Conversion Rate'
          ]}
          labelFormatter={(value) => chartData.find(item => item.name === value)?.fullName || value}
        />
        <Legend 
          formatter={(value) => 
            metricType === 'views' ? 'Views' : 
              metricType === 'applications' ? 'Applications' : 
              'Conversion Rate'
          }
        />
        <Bar 
          dataKey={metricType} 
          fill={getBarColor()}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}