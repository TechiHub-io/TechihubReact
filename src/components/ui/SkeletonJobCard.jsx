// src/components/ui/SkeletonJobCard.jsx - Loading skeleton for job cards
import React from 'react';

export default function SkeletonJobCard({ compact = false }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow pr-4">
          {/* Job Title */}
          <div className={`h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2`}></div>
          
          {/* Company and Location */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        
        {/* Company Logo */}
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
      </div>

      {/* Description */}
      {!compact && (
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}

// Skeleton for multiple cards
export function SkeletonJobsList({ count = 6, compact = false }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonJobCard key={i} compact={compact} />
      ))}
    </div>
  );
}