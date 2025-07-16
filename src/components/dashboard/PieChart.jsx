// src/components/dashboard/PieChart.jsx
'use client';
import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function PieChart({ 
  data = [], 
  emptyMessage = "No data available",
  showPercentages = true,
  showValues = true,
  size = "medium", // small, medium, large
  centerLabel = null
}) {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Determine colors based on theme
  const textColor = isDarkMode ? '#E5E7EB' : '#4B5563';
  const mutedTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  
  // Size configurations
  const sizeConfig = {
    small: { inner: 40, outer: 60, height: 200 },
    medium: { inner: 60, outer: 80, height: 250 },
    large: { inner: 80, outer: 100, height: 300 }
  };
  
  const { inner, outer, height } = sizeConfig[size] || sizeConfig.medium;
  
  // Check if data is empty or all zero values
  const isDataEmpty = !data || 
                      data.length === 0 || 
                      !data.some(item => item.value > 0);
  
  // Calculate total for center label
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Default colors if not provided
  const defaultColors = [
    '#0CCE68', '#3B82F6', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#10B981', '#F97316'
  ];
  
  // Process data with colors
  const processedData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));
  
  // Custom label renderer
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDarkMode ? '#FFFFFF' : '#000000'}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {showPercentages ? `${(percent * 100).toFixed(0)}%` : value}
      </text>
    );
  };
  
  // Custom center label
  const renderCenterLabel = () => {
    if (!centerLabel && size === 'small') return null;
    
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill={textColor}
        fontSize={size === 'large' ? '16' : '14'}
        fontWeight="600"
      >
        <tspan x="50%" dy="-0.3em">
          {centerLabel || 'Total'}
        </tspan>
        <tspan x="50%" dy="1.2em" fontSize={size === 'large' ? '20' : '16'} fontWeight="700">
          {total}
        </tspan>
      </text>
    );
  };
  
  // Mouse event handlers
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium" style={{ color: textColor }}>
              {data.name}
            </span>
          </div>
          <div style={{ color: mutedTextColor }}>
            <div>Count: <span className="font-semibold">{data.value}</span></div>
            <div>Percentage: <span className="font-semibold">{((data.value / total) * 100).toFixed(1)}%</span></div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: textColor }}
            >
              {entry.value}
            </span>
            {showValues && (
              <span 
                className="text-xs"
                style={{ color: mutedTextColor }}
              >
                ({entry.payload.value})
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (isDataEmpty) {
    return (
      <div className="h-full flex flex-col items-center justify-center" style={{ minHeight: height }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {emptyMessage}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Data will appear here when available
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            label={renderLabel}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={activeIndex === index ? (isDarkMode ? '#374151' : '#E5E7EB') : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
                style={{
                  filter: activeIndex !== null && activeIndex !== index ? 'opacity(0.6)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          
          {/* Center label for donut chart */}
          {renderCenterLabel()}
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            content={<CustomLegend />}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}