// src/components/jobs/PublicJobsList.jsx 
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { parseUrlToFilters, filtersToUrlPath } from '@/lib/utils/urlParser';
import { useStore } from '@/hooks/useZustandStore';
import JobListItem from './JobListItem';
import JobFiltersSidebar from './JobFiltersSidebar';
import SearchInput from './SearchInput';
import Pagination from '@/components/ui/Pagination';
import CompanyProfileLink from './CompanyProfileLink';
import { FilterIcon, X, ChevronDown, ChevronUp, MapPin, Briefcase, DollarSign, Globe, ExternalLink } from 'lucide-react';

export default function PublicJobsList({ 
  initialFilters = {},
  initialPathSegments = [],
  showTitle = true 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const hasInitiallyLoaded = useRef(false);

  // Get authentication status and user info
  const { isAuthenticated, isEmployer, user } = useStore(state => ({
    isAuthenticated: state.isAuthenticated || false,
    isEmployer: state.isEmployer || false,
    user: state.user
  }));
  
  // Job search hook (same as JobSearchPage)
  const {
    searchQuery,
    filters,
    jobs,
    loading,
    error,
    pagination,
    searchJobs,
    performSearch,
    updateSearchQuery,
    updateFilters,
    goToPage,
    clearFilters,
    clearError
  } = useJobSearch();
  
  // Saved jobs hook (only for authenticated job seekers)
  const {
    isJobSaved,
    saveJob,
    unsaveJob,
    loading: savingLoading,
    error: saveError
  } = useSavedJobs();

  // Get initial search parameters from URL or props
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      // First check for URL params (for /jobs page with search params)
      const urlParams = {
        q: searchParams.get('q') || '',
        location: searchParams.get('location') || '',
        remote: searchParams.get('remote') === 'true',
        job_type: searchParams.get('job_type') || '',
        experience_level: searchParams.get('experience_level') || '',
        min_salary: searchParams.get('min_salary') || '',
        max_salary: searchParams.get('max_salary') || '',
        skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
        posted_within: searchParams.get('posted_within') || '',
        education_level: searchParams.get('education_level') || '',
        page: parseInt(searchParams.get('page') || '1', 10)
      };
      
      // If no URL params, use initial filters from props (for SEO-friendly URLs)
      const hasUrlParams = Object.values(urlParams).some(value => 
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      );
      
      if (hasUrlParams) {
        // Update search query and filters from URL params
        if (urlParams.q !== searchQuery) {
          updateSearchQuery(urlParams.q);
        }
        
        // Update filters from URL (excluding page and query)
        const { q, page, ...urlFilters } = urlParams;
        updateFilters(urlFilters);
        
        // If there's a specific page, go to it
        if (urlParams.page > 1) {
          goToPage(urlParams.page);
        }
      } else if (Object.keys(initialFilters).length > 0) {
        // Use initial filters from props (SEO-friendly URLs)
        updateFilters(initialFilters);
        searchJobs({}, 1);
      } else {
        // Default search with no filters
        searchJobs({}, 1);
      }
      
      hasInitiallyLoaded.current = true;
    }
  }, []); // Only run on mount

  // Update URL when search changes (for /jobs page with search params)
  const updateUrl = useCallback((searchQuery, filters, page = 1) => {
    // Only update URL if we're on a page that uses search params (not SEO-friendly URLs)
    if (initialPathSegments.length === 0) {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('q', searchQuery);
      if (filters.location) params.set('location', filters.location);
      if (filters.remote) params.set('remote', 'true');
      if (filters.job_type) params.set('job_type', filters.job_type);
      if (filters.experience_level) params.set('experience_level', filters.experience_level);
      if (filters.min_salary) params.set('min_salary', filters.min_salary);
      if (filters.max_salary) params.set('max_salary', filters.max_salary);
      if (filters.skills?.length > 0) params.set('skills', filters.skills.join(','));
      if (filters.posted_within) params.set('posted_within', filters.posted_within);
      if (filters.education_level) params.set('education_level', filters.education_level);
      if (page > 1) params.set('page', page.toString());
      
      const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs';
      router.replace(newUrl);
    }
  }, [router, initialPathSegments.length]);

  // Handle search
  const handleSearch = useCallback((query) => {
    updateSearchQuery(query);
    updateUrl(query, filters, 1);
  }, [updateSearchQuery, filters, updateUrl]);

  // Handle manual search (Enter key or search button)
  const handleManualSearch = useCallback((query) => {
    updateSearchQuery(query);
    performSearch();
    updateUrl(query || searchQuery, filters, 1);
  }, [updateSearchQuery, performSearch, searchQuery, filters, updateUrl]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    updateFilters(newFilters);
    updateUrl(searchQuery, { ...filters, ...newFilters }, 1);
  }, [updateFilters, searchQuery, filters, updateUrl]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    clearFilters();
    updateUrl('', {
      location: '',
      remote: false,
      job_type: '',
      experience_level: '',
      min_salary: '',
      max_salary: '',
      skills: [],
      posted_within: '',
      education_level: ''
    }, 1);
  }, [clearFilters, updateUrl]);

  // Handle pagination
  const handlePageChange = useCallback((page) => {
    goToPage(page);
    updateUrl(searchQuery, filters, page);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goToPage, searchQuery, filters, updateUrl]);

  // Handle save job
  const handleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) return;
    try {
      await saveJob(jobId);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  }, [isAuthenticated, saveJob]);

  // Handle unsave job
  const handleUnsaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) return;
    try {
      await unsaveJob(jobId);
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  }, [isAuthenticated, unsaveJob]);

  // Calculate active filters count
  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'skills' && Array.isArray(value)) {
      return count + value.length;
    }
    if (value && value !== '' && value !== false) {
      return count + 1;
    }
    return count;
  }, 0);

  // Show filter tags
  const getFilterTags = () => {
    const tags = [];
    
    if (filters.location) tags.push({ key: 'location', label: `Location: ${filters.location}`, icon: MapPin });
    if (filters.remote) tags.push({ key: 'remote', label: 'Remote', icon: Globe });
    if (filters.job_type) tags.push({ key: 'job_type', label: `Type: ${filters.job_type}`, icon: Briefcase });
    if (filters.experience_level) tags.push({ key: 'experience_level', label: `Level: ${filters.experience_level}`, icon: Briefcase });
    if (filters.min_salary || filters.max_salary) {
      const salaryRange = filters.min_salary && filters.max_salary 
        ? `${filters.min_salary} - ${filters.max_salary}`
        : filters.min_salary 
        ? `From ${filters.min_salary}`
        : `Up to ${filters.max_salary}`;
      tags.push({ key: 'salary', label: `Salary: ${salaryRange}`, icon: DollarSign });
    }
    if (filters.skills?.length > 0) {
      filters.skills.forEach(skill => {
        tags.push({ key: `skill-${skill}`, label: skill, icon: null, isSkill: true });
      });
    }
    if (filters.education_level) tags.push({ key: 'education_level', label: `Education: ${filters.education_level}`, icon: Briefcase });
    if (filters.posted_within) tags.push({ key: 'posted_within', label: `Posted: ${filters.posted_within}`, icon: Briefcase });
    
    return tags;
  };

  const filterTags = getFilterTags();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        {showTitle && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Find Your Next Opportunity
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Discover thousands of job opportunities from top companies
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            onSubmit={handleManualSearch}
            placeholder="Search for jobs, companies, or keywords..."
            className="w-full"
          />
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-[#0CCE68] text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <JobFiltersSidebar
                filters={filters}
                onFiltersChange={handleFilterChange}
                expanded={filtersExpanded}
                onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
                showAdvancedFilters={true}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {filterTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filterTags.map((tag) => {
                  const IconComponent = tag.icon;
                  return (
                    <span
                      key={tag.key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0CCE68]/10 text-[#0CCE68] border border-[#0CCE68]/20"
                    >
                      {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                      {tag.label}
                      <button
                        onClick={() => {
                          if (tag.isSkill) {
                            const skill = tag.label;
                            handleFilterChange({
                              skills: filters.skills.filter(s => s !== skill)
                            });
                          } else if (tag.key === 'salary') {
                            handleFilterChange({ min_salary: '', max_salary: '' });
                          } else {
                            handleFilterChange({ [tag.key]: tag.key === 'remote' ? false : '' });
                          }
                        }}
                        className="ml-2 hover:text-[#0BBE58]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {!loading && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pagination.count > 0 ? (
                      <>
                        Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                        {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} of{' '}
                        {pagination.count} jobs
                        {searchQuery && ` for "${searchQuery}"`}
                      </>
                    ) : (
                      <>No jobs found{searchQuery && ` for "${searchQuery}"`}</>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={clearError}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && jobs.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {(searchQuery || activeFiltersCount > 0)
                    ? "Try adjusting your search criteria or filters to find more opportunities."
                    : "No jobs are currently available. Check back later for new opportunities."}
                </p>
                {(searchQuery || activeFiltersCount > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Job Results */}
            {!loading && jobs.length > 0 && (
              <>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="relative">
                      <JobListItem 
                        job={job}
                        isSaved={isAuthenticated && !isEmployer && isJobSaved(job.id)}
                        onSave={isAuthenticated && !isEmployer ? handleSaveJob : undefined}
                        onUnsave={isAuthenticated && !isEmployer ? handleUnsaveJob : undefined}
                        isEmployer={isEmployer}
                        showActions={true}
                      />
                      
                      {/* Company profile link */}
                      {job.company_name && !isEmployer && (
                        <div className="absolute top-2 right-4">
                          <CompanyProfileLink 
                            job={job}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#0CCE68] transition-colors"
                          >
                            <span className="flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Company
                            </span>
                          </CompanyProfileLink>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination 
                      currentPage={pagination.currentPage} 
                      totalPages={pagination.totalPages}
                      totalItems={pagination.count}
                      itemsPerPage={pagination.pageSize}
                      onPageChange={handlePageChange}
                      showInfo={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}