// src/components/jobs/JobStatusBadge.jsx
import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function JobStatusBadge({ status, className = '' }) {
  // Status can be either a boolean (is_active) or a string ('active', 'inactive', etc.)
  const isActive = typeof status === 'boolean' ? status : status === 'active';
  
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const activeClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  const inactiveClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  
  return (
    <span className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}>
      {isActive ? (
        <>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </>
      )}
    </span>
  );
}