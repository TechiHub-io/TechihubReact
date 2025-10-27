// src/components/admin/AdminJobFilters.jsx
'use client';
import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Calendar, 
  Building2, 
  X, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AdminJobFilters({ 
  filters, 
  onFiltersChange, 
  accessibleCompanies = [],
  onClearFilters,
  totalJobs = 0,
  filteredJobs = 0
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Handle search with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      onFiltersChange('search', value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    onFiltersChange(filterName, value);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.company || 
           filters.status || 
           filters.search || 
           filters.date_from || 
           filters.date_to ||
           filters.order !== 'latest';
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.company) count++;
    if (filters.status) count++;
    if (filters.search) count++;
    if (filters.date_from) count++;
    if (filters.date_to) count++;
    if (filters.order !== 'latest') count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Main filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Company filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
          >
            <option value="">All Companies ({accessibleCompanies.length})</option>
            {accessibleCompanies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
          >
            <option value="">All Status</option>
            <option value="active">Active Jobs</option>
            <option value="inactive">Inactive Jobs</option>
          </select>
        </div>
        
        {/* Sort order */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="company_asc">Company (A-Z)</option>
            <option value="company_desc">Company (Z-A)</option>
          </select>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            defaultValue={filters.search}
            onChange={handleSearchChange}
            placeholder="Search jobs..."
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </button>

        <div className="flex items-center gap-4">
          {/* Filter summary */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredJobs !== totalJobs ? (
              <span>
                Showing {filteredJobs} of {totalJobs} jobs
                {hasActiveFilters() && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                  </span>
                )}
              </span>
            ) : (
              <span>Showing all {totalJobs} jobs</span>
            )}
          </div>

          {/* Clear filters button */}
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters panel */}
      {isAdvancedOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date range filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posted From
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full p-2.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posted To
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full p-2.5"
              />
            </div>

            {/* Quick date presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Filters
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    handleFilterChange('date_from', lastWeek.toISOString().split('T')[0]);
                    handleFilterChange('date_to', '');
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    handleFilterChange('date_from', lastMonth.toISOString().split('T')[0]);
                    handleFilterChange('date_to', '');
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastQuarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                    handleFilterChange('date_from', lastQuarter.toISOString().split('T')[0]);
                    handleFilterChange('date_to', '');
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                >
                  Last 3 months
                </button>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters() && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active filters:
                </span>
                
                {filters.company && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Company: {accessibleCompanies.find(c => c.id === filters.company)?.name || 'Unknown'}
                    <button
                      onClick={() => handleFilterChange('company', '')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Status: {filters.status === 'active' ? 'Active' : 'Inactive'}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.date_from && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    From: {new Date(filters.date_from).toLocaleDateString()}
                    <button
                      onClick={() => handleFilterChange('date_from', '')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.date_to && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    To: {new Date(filters.date_to).toLocaleDateString()}
                    <button
                      onClick={() => handleFilterChange('date_to', '')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}