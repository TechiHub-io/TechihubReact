// src/components/jobs/JobsManagementTable.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/hooks/useJobs';
import { formatDate } from '@/lib/utils/date';
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
  ToggleRight 
} from 'lucide-react';

export default function JobsManagementTable() {
  const { 
    jobs, 
    fetchJobs, 
    toggleJobStatus, 
    deleteJob,
    loading, 
    error 
  } = useJobs();
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    order: 'latest'
  });
  
  // Confirmation modal for delete
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    jobId: null,
    jobTitle: ''
  });
  
  // Success message
  const [successMessage, setSuccessMessage] = useState('');
  
  // navigation
  const router = useRouter();

  // Refs to track filter changes and mounted state
  const mountedRef = useRef(false);
  const prevFiltersRef = useRef(filters);
  
  // Load jobs on component mount and when filters change
  useEffect(() => {
    // Skip if filters didn't actually change (first render is handled below)
    if (mountedRef.current && 
        JSON.stringify(prevFiltersRef.current) === JSON.stringify(filters)) {
      return;
    }
    
    // Update the previous filters ref
    prevFiltersRef.current = filters;
    
    const loadJobs = async () => {
      try {
        // Convert filter status to API parameter
        const apiFilters = {};
        
        if (filters.status === 'active') {
          apiFilters.is_active = true;
        } else if (filters.status === 'inactive') {
          apiFilters.is_active = false;
        }
        
        if (filters.search) {
          apiFilters.search = filters.search;
        }
        
        if (filters.order === 'latest') {
          apiFilters.ordering = '-created_at';
        } else if (filters.order === 'oldest') {
          apiFilters.ordering = 'created_at';
        } else if (filters.order === 'title_asc') {
          apiFilters.ordering = 'title';
        } else if (filters.order === 'title_desc') {
          apiFilters.ordering = '-title';
        }
        
        await fetchJobs(apiFilters);
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    
    loadJobs();
    
    // Set mounted ref to true after first load
    if (!mountedRef.current) {
      mountedRef.current = true;
    }
  }, [filters, fetchJobs]);
  
  // Additional effect to handle reload after operations like toggle status or delete
  useEffect(() => {
    return () => {
      // Cleanup: set mounted ref to false when component unmounts
      mountedRef.current = false;
    };
  }, []);
  
  // Handle search input change - debounced
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    
    // Debounce search input
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: newValue
      }));
    }, 500); // Wait 500ms before applying the search
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      status: e.target.value
    }));
  };
  
  // Handle ordering change
  const handleOrderChange = (e) => {
    setFilters(prev => ({
      ...prev,
      order: e.target.value
    }));
  };
  
  // Toggle job status (active/inactive)
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      await toggleJobStatus(jobId, !currentStatus);
      setSuccessMessage('Job status updated successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Reload jobs after status change
      const apiFilters = createApiFilters(filters);
      await fetchJobs(apiFilters);
    } catch (error) {
      console.error('Error toggling job status:', error);
    }
  };
  
  // Helper function to create API filters
  const createApiFilters = (filters) => {
    const apiFilters = {};
    
    if (filters.status === 'active') {
      apiFilters.is_active = true;
    } else if (filters.status === 'inactive') {
      apiFilters.is_active = false;
    }
    
    if (filters.search) {
      apiFilters.search = filters.search;
    }
    
    if (filters.order === 'latest') {
      apiFilters.ordering = '-created_at';
    } else if (filters.order === 'oldest') {
      apiFilters.ordering = 'created_at';
    } else if (filters.order === 'title_asc') {
      apiFilters.ordering = 'title';
    } else if (filters.order === 'title_desc') {
      apiFilters.ordering = '-title';
    }
    
    return apiFilters;
  };
  
  // Show delete confirmation modal
  const confirmDelete = (jobId, jobTitle) => {
    setDeleteConfirm({
      show: true,
      jobId,
      jobTitle
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
  
  // Proceed with job deletion
  const confirmDeleteJob = async () => {
    if (!deleteConfirm.jobId) return;
    
    try {
      await deleteJob(deleteConfirm.jobId);
      setSuccessMessage('Job deleted successfully!');
      
      // Reset delete confirmation
      cancelDelete();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Reload jobs after deletion
      const apiFilters = createApiFilters(filters);
      await fetchJobs(apiFilters);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table header with filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Jobs
          </h2>
          
          <Link 
            href="/jobs/create" 
            className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <select
              value={filters.status}
              onChange={handleStatusFilterChange}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
            >
              <option value="">All Jobs</option>
              <option value="active">Active Jobs</option>
              <option value="inactive">Inactive Jobs</option>
            </select>
          </div>
          
          {/* Sort order */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <select
              value={filters.order}
              onChange={handleOrderChange}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full pl-10 p-2.5"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
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
          </div>
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
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      )}
      
      {/* Table content */}
      {!loading && (
        <>
          {!jobs || !Array.isArray(jobs) || jobs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No jobs found.</p>
              <Link 
                href="/jobs/create" 
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Job Title</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Posted</th>
                    <th scope="col" className="px-6 py-3">Applications</th>
                    {/* <th scope="col" className="px-6 py-3">Views</th> */}
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(jobs) && jobs.map((job) => (
                    <tr 
                      key={job.id} 
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <Link href={`/jobs/${job.id}`} className="hover:text-[#0CCE68]">
                          {job.title}
                        </Link>
                      </th>
                      
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
                        {formatDate(job.created_at, 'short')}
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
                      
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                          <span>{job.view_count || 0}</span>
                        </div>
                      </td> */}
                      
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-gray-500 hover:text-[#0CCE68]"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          
                          <Link
                            href={`/jobs/${job.id}/edit`}
                            className="text-gray-500 hover:text-[#0CCE68]"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          
                          <button
                            onClick={() => handleToggleStatus(job.id, job.is_active)}
                            className={job.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-[#0CCE68]'}
                            title={job.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {job.is_active ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => confirmDelete(job.id, job.title)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Delete confirmation modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete the job <strong>"{deleteConfirm.jobTitle}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}