// src/components/ui/SearchableSelect.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export default function SearchableSelect({
  options = [],
  value = '',
  onChange,
  onBlur,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  className = '',
  error = false,
  disabled = false,
  renderOption = null,
  renderSelected = null,
  name = '',
  id = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Check if mobile screen size
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      option.code?.toLowerCase().includes(searchLower) ||
      option.name?.toLowerCase().includes(searchLower) ||
      option.country?.toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        if (onBlur) {
          onBlur({ target: { name, value } });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [name, value, onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  const handleOptionSelect = (option) => {
    onChange({ target: { name, value: option.code } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOption = options.find(opt => opt.code === value);

  const defaultRenderSelected = (option) => {
    if (!option) return placeholder;
    if (isMobile) {
      return option.code;
    }
    return `${option.code} (${option.symbol}) - ${option.name}`;
  };

  const defaultRenderOption = (option) => {
    if (isMobile) {
      return (
        <div className="flex items-center justify-between">
          <span className="font-medium">{option.code}</span>
          <span className="text-sm text-gray-500">{option.symbol}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">{option.code}</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">({option.symbol})</span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">- {option.name}</span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">{option.country}</span>
      </div>
    );
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        name={name}
        value={value}
      />
      
      {/* Select trigger */}
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-left text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent flex items-center justify-between ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'}`}
      >
        <span className="truncate">
          {renderSelected ? renderSelected(selectedOption) : defaultRenderSelected(selectedOption)}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-[#0CCE68] focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 ${
                    option.code === value ? 'bg-[#0CCE68] text-white hover:bg-[#0BBE58]' : ''
                  }`}
                >
                  {renderOption ? renderOption(option) : defaultRenderOption(option)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}