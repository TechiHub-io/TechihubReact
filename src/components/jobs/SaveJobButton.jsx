// src/components/jobs/SaveJobButton.jsx
import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';

export default function SaveJobButton({ 
  jobId, 
  isSaved = false, 
  onSave, 
  onUnsave,
  size = 'md',
  showText = false,
  className = ""
}) {
  const [loading, setLoading] = useState(false);
  const [optimisticSaved, setOptimisticSaved] = useState(isSaved);

  // Size variants
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Optimistic update
      setOptimisticSaved(!optimisticSaved);
      
      if (optimisticSaved) {
        // Currently saved, so unsave
        if (onUnsave) {
          await onUnsave(jobId);
        }
      } else {
        // Currently not saved, so save
        if (onSave) {
          await onSave(jobId);
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticSaved(optimisticSaved);
      console.error('Error toggling save status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${optimisticSaved 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500'
        }
        transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${showText ? 'flex items-center space-x-2' : ''}
        ${className}
      `}
      title={optimisticSaved ? 'Remove from saved jobs' : 'Save job'}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart 
          className={`${iconSizes[size]} ${optimisticSaved ? 'fill-current' : ''}`} 
        />
      )}
      
      {showText && (
        <span className="text-sm font-medium">
          {optimisticSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}