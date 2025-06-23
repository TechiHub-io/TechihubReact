// src/components/ui/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ size = 'md', color = '#0CCE68' }) {
  // Size mappings
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  // Get the appropriate size class or default to medium
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`animate-spin rounded-full ${sizeClass} border-t-2 border-b-2`} style={{ borderColor: color }}>
    </div>
  );
}