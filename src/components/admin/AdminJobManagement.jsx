// src/components/admin/AdminJobManagement.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminJobs } from '@/hooks/useAdminJobs';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminJobErrorHandler } from '@/hooks/useErrorHandler';
import { useAdminJobLoadingState } from '@/hooks/useLoadingState';
import { formatDate, getRelativeTime } from '@/lib/utils/date';
import AdminJobFilters from './AdminJobFilters';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  Users,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Building2,
  Calendar,
  Shield,
  AlertCircle,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

export default function AdminJobManagement() {
  const router = useRouter();
  const { 
    fetchAdminJobs, 
    deleteAdminJob, 
    toggleAdminJobStatus,
    loading, 
    error 
  } = useAdminJobs();
  
  const { 
    isAdmin, 
    accessibleCompanies, 
    companiesLoading,
    refreshAccessibleCompanies 
  } = useAdminAuth();

  // Error handling with retry mechanisms
  const {
    error: errorHandlerError,
    isRetrying,
    hasError,
    executeJobDeletion,
    executeCompanyFetch,
    handleJobFetchError,
    handleJobDeletionError,
    clearError: clearHandlerError,
    canRetry,
    retry,
    getErrorSummary
  } = useAdminJobErrorHandler({
    onError: (processedError, rawError) => {
      console.error('Admin job management error:', processedError, rawError);
    }
  });

  // Loading state management
  const {
    isJobsLoading,
    isRefreshing,
    isJobDeleting,
    setJobsLoading,
    setRefreshing,
    setJobDeleting,
    canDeleteJob
  } = useAdminJobLoadingState();

  // State for jobs data
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    company: '',
    status: '',
    search: '',
    order: 'latest',
    date_from: '',
    date_to: ''
  });
  
  // UI states
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    jobId: null,
    jobTitle: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  
  // Refs for tracking changes
  const mountedRef = useRef(false);
  const prevFiltersRef = useRef(filters);

  // Load jobs when component mounts or filters change
  useEffect(() => {
    if (!isAdmin) return;
    
    // Skip if filters didn't actually change (except first render)
    if (mountedRef.current && 
        JSON.stringify(prevFiltersRef.current) === JSON.stringify(filters)) {
      return;
    }
    
    prevFiltersRef.current = filters;
    // Reset to page 1 when filters change
    setCurrentPage(1);
    loadAdminJobs();
    
    if (!mountedRef.current) {
      mountedRef.current = true;
    }
  }, [filters, isAdmin]);

  // Load jobs when page changes
  useEffect(() => {
    if (!isAdmin || !mountedRef.current) return;
    loadAdminJobs();
  }, [currentPage, pageSize]);

  // Load admin jobs with current filters
  const loadAdminJobs = async (isRefresh = false) => {
    try {
      // Set appropriate loading state
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setJobsLoading(true);
      }

      const apiFilters = createApiFilters(filters);
      // Add pagination parameters
      apiFilters.page = currentPage;
      apiFilters.page_size = pageSize;
      
      const jobsData = await fetchAdminJobs(apiFilters);
      
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
        setTotalJobs(jobsData.length);
        setHasNext(false);
        setHasPrevious(false);
      } else if (jobsData?.results) {
        setJobs(jobsData.results);
        setTotalJobs(jobsData.count || jobsData.results.length);
        setHasNext(!!jobsData.next);
        setHasPrevious(!!jobsData.previous);
      } else {
        setJobs([]);
        setTotalJobs(0);
        setHasNext(false);
        setHasPrevious(false);
      }
    } catch (error) {
      handleJobFetchError(error);
      setJobs([]);
      setTotalJobs(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      // Clear loading states
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setJobsLoading(false);
      }
    }
  };

  // Create API filters from UI filters
  const createApiFilters = (filters) => {
    const apiFilters = {};
    
    if (filters.company) {
      apiFilters.company_id = filters.company;
    }
    
    if (filters.status === 'active') {
      apiFilters.is_active = true;
    } else if (filters.status === 'inactive') {
      apiFilters.is_active = false;
    }
    
    if (filters.search) {
      apiFilters.search = filters.search;
    }
    
    if (filters.date_from) {
      apiFilters.created_after = filters.date_from;
    }
    
    if (filters.date_to) {
      apiFilters.created_before = filters.date_to;
    }
    
    // Ordering
    switch (filters.order) {
      case 'latest':
        apiFilters.ordering = '-created_at';
        break;
      case 'oldest':
        apiFilters.ordering = 'created_at';
        break;
      case 'title_asc':
        apiFilters.ordering = 'title';
        break;
      case 'title_desc':
        apiFilters.ordering = '-title';
        break;
      case 'company_asc':
        apiFilters.ordering = 'company__name';
        break;
      case 'company_desc':
        apiFilters.ordering = '-company__name';
        break;
      default:
        apiFilters.ordering = '-created_at';
    }
    
    return apiFilters;
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: newValue
      }));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle filters change from AdminJobFilters component
  const handleFiltersChange = (filterName, value) => {
    handleFilterChange(filterName, value);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      company: '',
      status: '',
      search: '',
      order: 'latest',
      date_from: '',
      date_to: ''
    });
    setCurrentPage(1); // Reset to first page
  };

  // Toggle job status
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      await toggleAdminJobStatus(jobId, !currentStatus);
      setSuccessMessage('Job status updated successfully!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadAdminJobs();
    } catch (error) {
      console.error('Error toggling job status:', error);
    }
  };

  // Show delete confirmation
  const confirmDelete = (jobId, jobTitle) => {
    setDeleteConfirm({
      show: true,
      jobId,
      jobTitle: jobTitle || 'Unknown Job'
    });
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({
      show: false,
      jobId: null,
      jobTitle: ''
    });
  };

  // Confirm job deletion
  const confirmDeleteJob = async () => {
    if (!deleteConfirm.jobId) return;
    
    try {
      setJobDeleting(deleteConfirm.jobId, true);
      await deleteAdminJob(deleteConfirm.jobId);
      setSuccessMessage('Job deleted successfully!');
      
      cancelDelete();
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadAdminJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      
      let errorMessage = 'Failed to delete job. Please try again.';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this job.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Job not found. It may have already been deleted.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // The error will be automatically set by the useAdminJobs hook
      // We could show a toast notification here if needed
    } finally {
      setJobDeleting(deleteConfirm.jobId, false);
    }
  };

  // Handle job selection for bulk operations
  const handleJobSelection = (jobId, isSelected) => {
    const newSelection = new Set(selectedJobs);
    if (isSelected) {
      newSelection.add(jobId);
    } else {
      newSelection.delete(jobId);
    }
    setSelectedJobs(newSelection);
  };

  // Select all jobs
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedJobs(new Set(jobs.map(job => job.id)));
    } else {
      setSelectedJobs(new Set());
    }
  };

  // Get company name - use direct company_name from job or lookup by ID
  const getCompanyName = (job) => {
    // First try to use the company_name field from the job serializer
    if (job.company_name) {
      return job.company_name;
    }
    
    // Fallback to lookup by company_id if company_name is not available
    if (job.company_id) {
      const company = accessibleCompanies.find(c => c.id === job.company_id);
      return company?.name || 'Company Name Not Available';
    }
    
    return 'Company Name Not Available';
  };

  // Get company logo - lookup by company_id
  const getCompanyLogo = (job) => {
    if (job.company_id) {
      const company = accessibleCompanies.find(c => c.id === job.company_id);
      return company?.logo_url || company?.logo || null;
    }
    return null;
  };

  // Refresh data
  const handleRefresh = async () => {
    await Promise.all([
      refreshAccessibleCompanies(),
      loadAdminJobs()
    ]);
  };

  // Show loading state if not admin or still loading
  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You need super admin privileges to access job management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#0CCE68]" />
            <div>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cross-Company Job Management
                </h2>
                <Tooltip 
                  content="As a super admin, you can manage ALL jobs across multiple companies - including jobs posted by employers and jobs you've posted on behalf of companies. This is different from employer job management which only shows their own company's jobs."
                  position="top"
                >
                  <HelpCircle className="w-5 h-5 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                </Tooltip>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-blue-500" />
                  Super Admin Access: Manage jobs across {accessibleCompanies.length} companies
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading || companiesLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${(loading || companiesLoading) ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <Link 
              href="/admin/jobs/create" 
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mt-4">
          <AdminJobFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            accessibleCompanies={accessibleCompanies}
            onClearFilters={clearFilters}
            totalJobs={totalJobs}
            filteredJobs={jobs.length}
          />
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && jobs.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading jobs...</span>
        </div>
      )}
      
      {/* Loading overlay for pagination */}
      {loading && jobs.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        </div>
      )}
      
      {/* Jobs table */}
      {!loading && (
        <>
          {!jobs || jobs.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filters.search || filters.company || filters.status ? 
                  'No jobs found matching your filters.' : 
                  'No admin jobs found.'
                }
              </p>
              <div className="flex justify-center gap-3">
                {(filters.search || filters.company || filters.status) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Clear Filters
                  </button>
                )}
                <Link 
                  href="/admin/jobs/create" 
                  className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Admin Job
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Bulk actions bar */}
              {selectedJobs.size > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedJobs.size} job{selectedJobs.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJobs(new Set())}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        Clear Selection
                      </button>
                      {/* Add bulk action buttons here in future */}
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedJobs.size === jobs.length && jobs.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-[#0CCE68] bg-gray-100 border-gray-300 rounded focus:ring-[#0CCE68] dark:focus:ring-[#0CCE68] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3">Job Title</th>
                      <th scope="col" className="px-6 py-3">Company</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Posted</th>
                      <th scope="col" className="px-6 py-3">Applications</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr 
                        key={job.id} 
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedJobs.has(job.id)}
                            onChange={(e) => handleJobSelection(job.id, e.target.checked)}
                            className="w-4 h-4 text-[#0CCE68] bg-gray-100 border-gray-300 rounded focus:ring-[#0CCE68] dark:focus:ring-[#0CCE68] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                        
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Link href={`/jobs/${job.id}`} className="hover:text-[#0CCE68]">
                              {job.title}
                            </Link>
                            {job.posted_by_admin ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin Posted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                <Building2 className="w-3 h-3 mr-1" />
                                Employer Posted
                              </span>
                            )}
                          </div>
                        </th>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getCompanyLogo(job) && (
                              <img 
                                src={getCompanyLogo(job)} 
                                alt={getCompanyName(job)}
                                className="w-6 h-6 rounded object-cover"
                              />
                            )}
                            <span className="text-sm">
                              {getCompanyName(job)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.is_active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {job.is_active ? (
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
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{formatDate(job.created_at, 'short')}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getRelativeTime(job.created_at)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                            <Link 
                              href={`/applications/job/${job.id}`} 
                              className="hover:text-[#0CCE68] hover:underline"
                            >
                              {job.application_count || 0}
                            </Link>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <Tooltip content="View job details" position="top">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-gray-500 hover:text-[#0CCE68] p-1 rounded transition-colors duration-200"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                            </Tooltip>
                            
                            <Tooltip content="Edit job posting" position="top">
                              <Link
                                href={`/admin/jobs/${job.id}/edit`}
                                className="text-gray-500 hover:text-[#0CCE68] p-1 rounded transition-colors duration-200"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                            </Tooltip>
                            
                            <Tooltip content={job.is_active ? 'Deactivate job posting' : 'Activate job posting'} position="top">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(job.id, job.is_active);
                                }}
                                className={`p-1 rounded transition-colors duration-200 ${job.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-[#0CCE68]'}`}
                              >
                                {job.is_active ? (
                                  <ToggleRight className="w-5 h-5" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5" />
                                )}
                              </button>
                            </Tooltip>
                            
                            <Tooltip content="Delete job posting permanently" position="top">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(job.id, job.title);
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout - Visible on mobile */}
              <div className="lg:hidden space-y-4">
                {jobs.map((job) => (
                  <div 
                    key={job.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Header with checkbox and title */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedJobs.has(job.id)}
                          onChange={(e) => handleJobSelection(job.id, e.target.checked)}
                          className="w-4 h-4 text-[#0CCE68] bg-gray-100 border-gray-300 rounded focus:ring-[#0CCE68] mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <Link href={`/jobs/${job.id}`} className="block">
                            <h3 className="font-medium text-gray-900 dark:text-white hover:text-[#0CCE68] transition-colors duration-200 truncate">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {job.posted_by_admin ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin Posted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                <Building2 className="w-3 h-3 mr-1" />
                                Employer Posted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {job.is_active ? (
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
                    </div>

                    {/* Company info */}
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        {getCompanyLogo(job) && (
                          <img 
                            src={getCompanyLogo(job)} 
                            alt={getCompanyName(job)}
                            className="w-5 h-5 rounded object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getCompanyName(job)}
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{getRelativeTime(job.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{job.application_count || 0} applications</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="p-2 text-gray-400 hover:text-[#0CCE68] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="p-2 text-gray-400 hover:text-[#0CCE68] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleToggleStatus(job.id, job.is_active)}
                        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          job.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-[#0CCE68]'
                        }`}
                        title={job.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {job.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => confirmDelete(job.id, job.title)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Summary */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} admin jobs
                    </span>
                    {selectedJobs.size > 0 && (
                      <span className="ml-2">
                        ({selectedJobs.size} selected)
                      </span>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    {/* Page size selector */}
                    <div className="flex items-center gap-2">
                      <label htmlFor="pageSize" className="text-sm text-gray-600 dark:text-gray-400">
                        Per page:
                      </label>
                      <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    {/* Page navigation */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={!hasPrevious || loading}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={!hasPrevious || loading}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {Math.ceil(totalJobs / pageSize)}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!hasNext || loading}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.ceil(totalJobs / pageSize))}
                        disabled={!hasNext || loading}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      
      {/* Delete confirmation modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={cancelDelete}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 z-10">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Delete Job Posting
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{deleteConfirm.jobTitle}"</span>? 
                      This action cannot be undone and will permanently remove the job posting and all associated applications.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteJob}
                  disabled={isJobDeleting(deleteConfirm.jobId)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJobDeleting(deleteConfirm.jobId) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Job'
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isJobDeleting(deleteConfirm.jobId)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}