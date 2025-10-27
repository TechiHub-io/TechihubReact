// src/components/ui/LoadingIndicators.jsx
'use client';
import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Spinner loading indicator
 */
export function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  ...props 
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-[#0CCE68]',
    secondary: 'text-gray-500',
    white: 'text-white',
    current: 'text-current'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    />
  );
}

/**
 * Dots loading indicator
 */
export function DotsLoader({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  count = 3 
}) {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'bg-[#0CCE68]',
    secondary: 'bg-gray-500',
    white: 'bg-white',
    current: 'bg-current'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
}

/**
 * Linear progress bar
 */
export function LinearProgress({ 
  progress = null, 
  color = 'primary', 
  height = 'sm',
  className = '',
  animated = true 
}) {
  const heightClasses = {
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-[#0CCE68]',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const isIndeterminate = progress === null;

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[height]} ${className}`}>
      <div
        className={`${heightClasses[height]} ${colorClasses[color]} rounded-full transition-all duration-300 ${
          isIndeterminate && animated ? 'animate-pulse' : ''
        }`}
        style={{
          width: isIndeterminate ? '100%' : `${Math.max(0, Math.min(100, progress))}%`,
          ...(isIndeterminate && animated && {
            animation: 'indeterminate 2s infinite linear',
            background: `linear-gradient(90deg, transparent, ${colorClasses[color].replace('bg-', '')}, transparent)`
          })
        }}
      />
    </div>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({ 
  progress = null, 
  size = 'md', 
  color = 'primary',
  strokeWidth = 2,
  className = '',
  showPercentage = false 
}) {
  const sizeValues = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48
  };

  const colorClasses = {
    primary: '#0CCE68',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  const sizeValue = sizeValues[size];
  const radius = (sizeValue - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const isIndeterminate = progress === null;
  
  const strokeDasharray = isIndeterminate ? circumference : circumference;
  const strokeDashoffset = isIndeterminate ? 0 : circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={sizeValue}
        height={sizeValue}
        className={isIndeterminate ? 'animate-spin' : ''}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius}
          stroke={colorClasses[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showPercentage && !isIndeterminate && (
        <span 
          className="absolute text-xs font-medium"
          style={{ fontSize: `${sizeValue / 4}px` }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

/**
 * Skeleton loader
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  animated = true,
  rounded = 'md' 
}) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${roundedClasses[rounded]} ${
        animated ? 'animate-pulse' : ''
      } ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Loading overlay
 */
export function LoadingOverlay({ 
  isVisible = true,
  message = 'Loading...',
  type = 'spinner',
  backdrop = true,
  dismissible = false,
  onDismiss = null,
  className = '',
  children = null
}) {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (dismissible && onDismiss && e.target === e.currentTarget) {
      onDismiss();
    }
  };

  const renderIndicator = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader size="lg" color="primary" />;
      case 'circular':
        return <CircularProgress size="lg" color="primary" />;
      case 'linear':
        return <LinearProgress color="primary" className="w-48" />;
      default:
        return <Spinner size="lg" color="primary" />;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      onClick={handleBackdropClick}
    >
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          {renderIndicator()}
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              {message}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline loading indicator with text
 */
export function InlineLoader({ 
  loading = false,
  text = 'Loading...',
  size = 'sm',
  color = 'primary',
  className = '',
  children = null
}) {
  if (!loading && !children) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {loading && <Spinner size={size} color={color} />}
      {loading && text && (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {text}
        </span>
      )}
      {!loading && children}
    </div>
  );
}

/**
 * Button with loading state
 */
export function LoadingButton({ 
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  children,
  className = '',
  size = 'md',
  variant = 'primary',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-[#0CCE68] hover:bg-[#0bb85c] text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center space-x-2 font-medium rounded-md
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]
        ${sizeClasses[size]} ${variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Spinner size="sm" color="current" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton({ 
  count = 1, 
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = true 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {showImage && (
            <Skeleton width="100%" height="200px" className="mb-4" />
          )}
          {showTitle && (
            <Skeleton width="75%" height="24px" className="mb-2" />
          )}
          {showDescription && (
            <>
              <Skeleton width="100%" height="16px" className="mb-2" />
              <Skeleton width="85%" height="16px" className="mb-4" />
            </>
          )}
          {showActions && (
            <div className="flex space-x-2">
              <Skeleton width="80px" height="32px" />
              <Skeleton width="80px" height="32px" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Table skeleton loader
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className = '',
  showHeader = true 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {showHeader && (
        <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} width="100%" height="20px" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );
}

// CSS for indeterminate animation (add to your global CSS)
export const loadingStyles = `
@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;