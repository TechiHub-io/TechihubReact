// src/components/admin/CompanySelector.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Building2, MapPin } from 'lucide-react';

export default function CompanySelector({
  companies = [],
  selectedCompanyId = null,
  onCompanySelect,
  disabled = false,
  loading = false,
  error = null,
  placeholder = 'Select a company...',
  searchPlaceholder = 'Search companies...',
  className = '',
  name = 'companyId',
  id = 'company-selector'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name?.toLowerCase().includes(searchLower) ||
      company.location?.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  const handleCompanySelect = (company) => {
    onCompanySelect(company.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  const renderSelectedCompany = (company) => {
    if (!company) return placeholder;
    return (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {company.name}
          </div>
          {company.location && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {company.location}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCompanyOption = (company) => {
    return (
      <div className="flex items-center space-x-3 p-4 sm:p-3">
        <div className="flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-base sm:text-sm">
            {company.name}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1">
            {company.location && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                <span className="truncate">{company.location}</span>
              </div>
            )}
            {company.industry && (
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                <span className="hidden sm:inline">• </span>{company.industry}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        name={name}
        value={selectedCompanyId || ''}
      />
      
      {/* Select trigger */}
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`w-full bg-white dark:bg-gray-800 border rounded-md py-4 sm:py-3 px-4 text-left focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 flex items-center justify-between transition-all duration-200 touch-manipulation ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
        } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer hover:shadow-sm active:bg-gray-50 dark:active:bg-gray-700'}`}
      >
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mt-1 w-2/3 animate-pulse"></div>
              </div>
            </div>
          ) : (
            renderSelectedCompany(selectedCompany)
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ml-2 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-80 sm:max-h-96 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Search input */}
          <div className="p-4 sm:p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-10 py-3 sm:py-2 text-base sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-1 transition-all duration-200 touch-manipulation"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 sm:p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 sm:max-h-80 overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <div className="px-4 py-8 sm:py-6 text-center">
                <Building2 className="w-10 h-10 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-3 sm:mb-2" />
                <div className="text-base sm:text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No companies found matching your search' : 'No companies available'}
                </div>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => handleCompanySelect(company)}
                  className={`w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-[#0CCE68] transition-all duration-200 touch-manipulation active:bg-gray-100 dark:active:bg-gray-600 ${
                    company.id === selectedCompanyId ? 'bg-[#0CCE68]/10 border-r-2 border-[#0CCE68]' : ''
                  }`}
                >
                  {renderCompanyOption(company)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}