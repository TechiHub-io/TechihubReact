// src/components/dashboard/ChartComponent.jsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useStore } from '@/hooks/useZustandStore';

export default function ChartComponent({ 
  data, 
  xKey, 
  yKey, 
  color = '#0CCE68', 
  emptyMessage = "No data available",
  chartType = 'line', // 'line' or 'area'
  showGrid = true,
  showDots = true,
  animate = true,
  height = '100%'
}) {
  const isDarkMode = useStore((state) => state.isDarkMode);
  
  // Enhanced color scheme
  const theme = {
    textColor: isDarkMode ? '#E5E7EB' : '#4B5563',
    gridColor: isDarkMode ? '#374151' : '#E5E7EB',
    tooltipBg: isDarkMode ? '#1F2937' : '#FFFFFF',
    tooltipBorder: isDarkMode ? '#4B5563' : '#D1D5DB',
    emptyTextColor: isDarkMode ? '#9CA3AF' : '#6B7280',
    backgroundColor: isDarkMode ? '#111827' : '#F9FAFB'
  };
  
  // Check if data exists and has meaningful content
  const hasData = data && data.length > 0;
  const hasNonZeroData = hasData && data.some(item => item[yKey] > 0);
  
  // Calculate max value for better Y-axis scaling
  const maxValue = hasData ? Math.max(...data.map(item => item[yKey] || 0)) : 0;
  const yAxisDomain = maxValue > 0 ? [0, Math.ceil(maxValue * 1.1)] : [0, 5];
  
  // Custom tooltip with better formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div 
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
          style={{
            backgroundColor: theme.tooltipBg,
            borderColor: theme.tooltipBorder,
            color: theme.textColor
          }}
        >
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-lg font-bold" style={{ color }}>
            {Math.floor(value).toLocaleString()} {/* No decimals, with thousand separators */}
          </p>
          <p className="text-xs opacity-75">
            {value === 1 ? '1 item' : `${Math.floor(value)} items`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot component for better interactivity
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const value = payload[yKey];
    
    // Only show dots for non-zero values or make them subtle for zero values
    const dotColor = value > 0 ? color : theme.gridColor;
    const dotRadius = value > 0 ? 4 : 2;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={dotRadius} 
        fill={dotColor}
        stroke="#fff"
        strokeWidth={value > 0 ? 2 : 1}
        className="transition-all duration-200 hover:r-6"
      />
    );
  };

  // Y-axis tick formatter (no decimals)
  const formatYAxisTick = (value) => {
    return Math.floor(value).toLocaleString();
  };

  // Empty state with better styling
  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-gray-400 dark:text-gray-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Show chart even with zero data, but with helpful message
  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === 'area' ? (
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} opacity={0.3} />}
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: theme.textColor, fontSize: 12 }} 
            axisLine={{ stroke: theme.gridColor }}
            tickLine={{ stroke: theme.gridColor }}
          />
          <YAxis 
            tick={{ fill: theme.textColor, fontSize: 12 }} 
            axisLine={{ stroke: theme.gridColor }}
            tickLine={{ stroke: theme.gridColor }}
            domain={yAxisDomain}
            tickFormatter={formatYAxisTick}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={2}
            dot={showDots ? <CustomDot /> : false}
            activeDot={{ 
              r: 6, 
              fill: color,
              stroke: '#fff',
              strokeWidth: 2,
              className: 'drop-shadow-lg'
            }}
            animationDuration={animate ? 1000 : 0}
          />
        </AreaChart>
      ) : (
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} opacity={0.3} />}
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: theme.textColor, fontSize: 12 }} 
            axisLine={{ stroke: theme.gridColor }}
            tickLine={{ stroke: theme.gridColor }}
          />
          <YAxis 
            tick={{ fill: theme.textColor, fontSize: 12 }} 
            axisLine={{ stroke: theme.gridColor }}
            tickLine={{ stroke: theme.gridColor }}
            domain={yAxisDomain}
            tickFormatter={formatYAxisTick}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color}
            strokeWidth={2}
            dot={showDots ? <CustomDot /> : false}
            activeDot={{ 
              r: 6, 
              fill: color,
              stroke: '#fff',
              strokeWidth: 2,
              className: 'drop-shadow-lg'
            }}
            animationDuration={animate ? 1000 : 0}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <div className="relative h-full">
      {chartContent}
      
      {/* Overlay message for zero data */}
      {hasData && !hasNonZeroData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              📊 No activity in the selected period
            </p>
          </div>
        </div>
      )}
    </div>
  );
}