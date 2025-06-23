// src/components/jobs/JobSearchPage.jsx - Enhanced with all new features
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useStore } from '@/hooks/useZustandStore';
import JobFiltersSidebar from './JobFiltersSidebar';
import JobListItem from './JobListItem';
import SearchInput from './SearchInput';
import Pagination from '@/components/ui/Pagination';
import { FilterIcon, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import CompanyProfileLink from './CompanyProfileLink';

export default function JobSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  
  // Get user info
  const { isEmployer, user, company } = useStore(state => ({
    isEmployer: state.isEmployer,
    user: state.user,
    company: state.company
  }));
  
  // Job search hook
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
  
  // Saved jobs hook (only for job seekers)
  const {
    isJobSaved,
    saveJob,
    unsaveJob,
    loading: savingLoading,
    error: saveError
  } = useSavedJobs();

  // Get initial search parameters from URL
  useEffect(() => {
    const urlParams = {
      q: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      remote: searchParams.get('remote') === 'true',
      job_type: searchParams.get('job_type') || '', // Changed from 'type'
      experience_level: searchParams.get('experience_level') || '', // Changed from 'experience'
      min_salary: searchParams.get('min_salary') || '',
      max_salary: searchParams.get('max_salary') || '',
      skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
      posted_within: searchParams.get('posted_within') || '',
      education_level: searchParams.get('education_level') || '',
      page: parseInt(searchParams.get('page') || '1', 10)
    };
    
    // Update search query and filters from URL
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
  }, []); // Only run on mount

  // Update URL when search changes
  const updateUrl = (searchQuery, filters, page = 1) => {
    const params = new URLSearchParams();
    
    // Use 'q' in URL but convert to 'search' for API
    if (searchQuery) params.set('q', searchQuery);
    if (filters.location) params.set('location', filters.location);
    if (filters.remote) params.set('remote', 'true');
    if (filters.job_type) params.set('job_type', filters.job_type); // Use job_type not type
    if (filters.experience_level) params.set('experience_level', filters.experience_level); // Use experience_level not experience
    if (filters.min_salary) params.set('min_salary', filters.min_salary);
    if (filters.max_salary) params.set('max_salary', filters.max_salary);
    if (filters.skills?.length > 0) params.set('skills', filters.skills.join(','));
    if (filters.posted_within) params.set('posted_within', filters.posted_within);
    if (filters.education_level) params.set('education_level', filters.education_level);
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = params.toString() ? `/dashboard/jobseeker/jobs/search?${params.toString()}` : '/dashboard/jobseeker/jobs/search';
    router.replace(newUrl);
  };

  // Handle search
  const handleSearch = (query) => {
    updateSearchQuery(query);
    updateUrl(query, filters, 1);
  };

  // Handle manual search (Enter key or search button)
  const handleManualSearch = (query) => {
    performSearch();
    updateUrl(query || searchQuery, filters, 1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    updateUrl(searchQuery, newFilters, 1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
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
  };

  // Handle pagination
  const handlePageChange = (page) => {
    goToPage(page);
    updateUrl(searchQuery, filters, page);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle save job
  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  // Handle unsave job
  const handleUnsaveJob = async (jobId) => {
    try {
      await unsaveJob(jobId);
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value && value !== '';
  }).length;

  const isJobOwner = (job) => {
    if (!isEmployer || !company) return false;
    return job.company_id === company.id || job.company_name === company.name;
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // You'll need to add this to your useJobs hook
      const { deleteJob } = useJobs();
      await deleteJob(jobId);
      
      // Refresh the search results
      searchJobs({}, pagination.currentPage);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Find Your Next Job
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover opportunities that match your skills and interests
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          onSearch={handleManualSearch}
          loading={loading}
          placeholder="Job title, keywords, or company name"
        />
      </div>
      
      {/* Mobile filters toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={toggleFilters}
          className="flex items-center justify-between w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5 mr-2" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-[#0CCE68] text-white rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {showFilters ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-4">
          <JobFiltersSidebar
            filters={filters}
            onFiltersChange={handleFilterChange}
            expanded={true}
            showAdvancedFilters={true}
            isAuthenticated={true}
          />
          </div>
        </div>
        
        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                <span>Searching...</span>
              ) : (
                <span>
                  Showing {jobs.length > 0 ? ((pagination.currentPage - 1) * pagination.pageSize + 1) : 0}-
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} of {pagination.count} jobs
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </span>
              )}
            </div>
            
            {/* Clear all filters button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  Location: {filters.location}
                  <button
                    onClick={() => handleFilterChange({ ...filters, location: '' })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.remote && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                  Remote
                  <button
                    onClick={() => handleFilterChange({ ...filters, remote: false })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.job_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
                  {filters.job_type.replace('_', ' ')}
                  <button
                    onClick={() => handleFilterChange({ ...filters, job_type: '' })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.skills?.map((skill) => (
                <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
                  {skill}
                  <button
                    onClick={() => handleFilterChange({ 
                      ...filters, 
                      skills: filters.skills.filter(s => s !== skill) 
                    })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Error Message */}
          {(error || saveError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span>{error || saveError}</span>
                <button
                  onClick={() => {
                    clearError();
                    // Clear save error if exists
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                      <div className="flex space-x-4 mb-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            /* No Results */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FilterIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || activeFiltersCount > 0
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
            </div>
          ) : (
            /* Job Results */
            <>
              <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="relative">
                      <JobListItem 
                        job={job}
                        isSaved={!isEmployer && isJobSaved(job.id)}
                        onSave={!isEmployer ? handleSaveJob : undefined}
                        onUnsave={!isEmployer ? handleUnsaveJob : undefined}
                        isEmployer={isEmployer}
                        showActions={true}
                      />
                      
                      {/* Smart company profile link */}
                      {job.company_name && !isEmployer && (
                        <div className="absolute top-2 right-4">
                          <CompanyProfileLink 
                            job={job}
                            className="text-xs text-gray-500 hover:text-[#0CCE68] transition-colors"
                          >
                            <span className="flex items-center">
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
  );
}