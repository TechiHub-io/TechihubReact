// src/components/analytics/ConversionRateCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ConversionRateCard({ 
  title, 
  rate = 0, 
  previousRate = null, 
  description, 
  icon 
}) {
  // Calculate change percentage if previous rate is provided
  const calculateChange = () => {
    if (previousRate === null) return null;
    
    if (previousRate === 0) {
      return rate > 0 ? 100 : 0;
    }
    
    return ((rate - previousRate) / previousRate) * 100;
  };
  
  const change = calculateChange();
  const isPositiveChange = change > 0;
  const isNeutralChange = change === 0 || change === null;
  
  const renderChangeIcon = () => {
    if (isNeutralChange) {
      return <Minus className="w-4 h-4" />;
    }
    
    return isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };
  
  const getChangeColor = () => {
    if (isNeutralChange) {
      return 'text-gray-500 dark:text-gray-400';
    }
    
    return isPositiveChange ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {typeof rate === 'number' ? `${rate.toFixed(1)}%` : rate}
            </p>
            
            {change !== null && (
              <p className={`ml-2 flex items-center text-sm ${getChangeColor()}`}>
                {renderChangeIcon()}
                <span className="ml-1">{Math.abs(change).toFixed(1)}%</span>
              </p>
            )}
          </div>
          
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 p-3 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/20 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}