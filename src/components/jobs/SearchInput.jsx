// src/components/jobs/SearchInput.jsx - Enhanced for job filtering
'use client';
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ 
  value = '', 
  onChange, 
  onSubmit, // Add onSubmit prop for manual search
  loading = false, 
  placeholder = "Search jobs, companies, or keywords...",
  className = ""
}) {
  const [inputValue, setInputValue] = useState(value);

  // Update input when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Call onChange for real-time updates (but don't trigger search)
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    // Clear both the input and trigger search
    if (onChange) onChange('');
    if (onSubmit) onSubmit('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    // Trigger manual search on form submit (Enter key)
    if (onSubmit) {
      onSubmit(trimmedValue);
    } else if (onChange) {
      onChange(trimmedValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      // Trigger manual search on Enter
      if (onSubmit) {
        onSubmit(trimmedValue);
      } else if (onChange) {
        onChange(trimmedValue);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          disabled={loading}
        />
        
        {/* Clear button */}
        {inputValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0CCE68]"></div>
          </div>
        )}
      </div>
      
      {/* Search hint - only show when there's a difference and not loading */}
      {!loading && inputValue !== value && inputValue.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 shadow-sm z-10">
          Press Enter to search for "{inputValue}"
        </div>
      )}
      
      {/* Search suggestions (optional - can be added later) */}
      {!loading && inputValue.length > 2 && inputValue !== value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Search suggestions
          </div>
          <div className="max-h-40 overflow-y-auto">
            {/* Popular searches or suggestions can be added here */}
            <button
              type="button"
              onClick={() => {
                setInputValue(inputValue);
                if (onSubmit) onSubmit(inputValue);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <Search className="h-4 w-4 mr-2 text-gray-400" />
              Search for "{inputValue}"
            </button>
          </div>
        </div>
      )}
    </form>
  );
}