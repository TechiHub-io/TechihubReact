// src/components/applications/ApplicationsTable.jsx

'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
import { useApplicationMessaging } from '@/hooks/useApplicationMessaging';
import { useStore } from '@/hooks/useZustandStore';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';
import { 
  Eye, 
  MessageCircle, 
  User, 
  Calendar, 
  Briefcase,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';

const STATUS_COLORS = {
  applied: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  screening: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  hired: 'bg-green-200 text-green-900 dark:bg-green-800/20 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300'
};

const SORT_OPTIONS = [
  { value: 'applied_date', label: 'Date Applied (Newest)', direction: 'desc' },
  { value: 'applied_date', label: 'Date Applied (Oldest)', direction: 'asc' },
  { value: 'status', label: 'Status', direction: 'asc' },
  { value: 'applicant_name', label: 'Applicant Name', direction: 'asc' },
  { value: 'updated_at', label: 'Last Updated', direction: 'desc' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'pending', label: 'Pending' },
  { value: 'screening', label: 'Screening' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
];

export default function ApplicationsTable({ jobId = null, showJobColumn = true }) {
  const { 
    applications, 
    fetchApplications, 
    fetchJobApplications,
    updateApplicationStatus,
    loading, 
    error,
    pagination
  } = useApplications();

  const { 
    startConversationWithApplicant, 
    loading: messagingLoading, 
    error: messagingError,
    clearError: clearMessagingError 
  } = useApplicationMessaging();
  
  const router = useRouter();
  const { company } = useStore(state => ({ company: state.company }));
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    date_from: '',
    date_to: ''
  });
  
  const [sortBy, setSortBy] = useState('applied_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure applications is always an array
  const applicationsArray = Array.isArray(applications) ? applications : [];

  // Load applications
  useEffect(() => {
    const loadApplications = async () => {
      const searchParams = {
        ...filters,
        ordering: sortDirection === 'desc' ? `-${sortBy}` : sortBy,
        page: currentPage
      };

      // Remove empty filters
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key] || searchParams[key] === '') {
          delete searchParams[key];
        }
      });

      try {
        if (jobId) {
          await fetchJobApplications(jobId, searchParams);
        } else {
          await fetchApplications(searchParams);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
      }
    };

    loadApplications();
  }, [filters, sortBy, sortDirection, currentPage, jobId, fetchApplications, fetchJobApplications]);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection]);

  useEffect(() => {
    if (messagingError) {
      console.error('Messaging error:', messagingError);
      // You could show a toast notification here
      setTimeout(() => {
        clearMessagingError();
      }, 5000);
    }
  }, [messagingError, clearMessagingError]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Page will be reset to 1 by the useEffect above
  };

  // Handle sort change
  const handleSortChange = (field, direction) => {
    setSortBy(field);
    setSortDirection(direction);
    // Page will be reset to 1 by the useEffect above
  };

  // Handle status update
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, { status: newStatus });
      
      // Reload applications (keep current page)
      const searchParams = {
        ...filters,
        ordering: sortDirection === 'desc' ? `-${sortBy}` : sortBy,
        page: currentPage
      };
      
      // Remove empty filters
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key] || searchParams[key] === '') {
          delete searchParams[key];
        }
      });
      
      if (jobId) {
        await fetchJobApplications(jobId, searchParams);
      } else {
        await fetchApplications(searchParams);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
  };

  // Handle bulk actions
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedApplications.length === 0) return;
    
    try {
      await Promise.all(
        selectedApplications.map(id => updateApplicationStatus(id, { status: newStatus }))
      );
      
      // Clear selection and reload (keep current page)
      setSelectedApplications([]);
      const searchParams = {
        ...filters,
        ordering: sortDirection === 'desc' ? `-${sortBy}` : sortBy,
        page: currentPage
      };
      
      // Remove empty filters
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key] || searchParams[key] === '') {
          delete searchParams[key];
        }
      });
      
      if (jobId) {
        await fetchJobApplications(jobId, searchParams);
      } else {
        await fetchApplications(searchParams);
      }
    } catch (error) {
      console.error('Failed to update statuses:', error);
    }
  };

  // Handle selection
  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applicationsArray.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applicationsArray.map(app => app.id));
    }
  };

  // Get display name for applicant
  const getApplicantDisplayName = (application) => {
    return application.applicant_name || 'Unknown Applicant';
  };

  // Get status display text
  const getStatusDisplay = (application) => {
    return application.status_display || application.status || 'Unknown';
  };

  if (loading && applicationsArray.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Applications ({pagination?.totalCount || applicationsArray.length})
          </h2>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
            
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                handleSortChange(field, direction);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-[#0CCE68] focus:border-[#0CCE68] px-3 py-2"
            >
              {SORT_OPTIONS.map(option => (
                <option key={`${option.value}-${option.direction}`} value={`${option.value}-${option.direction}`}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Applicants
            </label>
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
            type="text"
            placeholder="Search by name, email, or profile..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68] px-3 py-2"
            />
            </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-[#0CCE68] focus:border-[#0CCE68] px-3 py-2"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68] px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68] px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected
            </span>
            
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="text-sm border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1"
              >
                <option value="">Update Status...</option>
                {STATUS_OPTIONS.slice(1).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setSelectedApplications([])}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={applicationsArray.length > 0 && selectedApplications.length === applicationsArray.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Applicant
              </th>
              {showJobColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
           {applicationsArray.length === 0 ? (
             <tr>
               <td colSpan={showJobColumn ? 6 : 5} className="px-6 py-12 text-center">
                 <div className="flex flex-col items-center">
                   <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                     No applications found
                   </h3>
                   <p className="text-gray-600 dark:text-gray-400">
                     {filters.search || filters.status 
                       ? 'Try adjusting your filters to see more applications.' 
                       : 'Applications will appear here when candidates apply to your jobs.'}
                   </p>
                 </div>
               </td>
             </tr>
           ) : (
             applicationsArray.map((application) => (
               <tr key={application.id} onClick={() => router.push(`/applications/${application.id}`)} className="hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700/50">
                 <td className="px-6 py-4">
                   <input
                     type="checkbox"
                     checked={selectedApplications.includes(application.id)}
                     onChange={() => handleSelectApplication(application.id)}
                     className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
                   />
                 </td>
                 
                 <td className="px-6 py-4">
                   <div className="flex items-center">
                     <div className="flex-shrink-0 h-10 w-10">
                       <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                         <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                       </div>
                     </div>
                     <div className="ml-4">
                       <div className="text-sm font-medium text-gray-900 dark:text-white">
                         {getApplicantDisplayName(application)}
                       </div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">
                         Applied {formatDate(application.applied_date, 'short')}
                       </div>
                     </div>
                   </div>
                 </td>
                 
                 {showJobColumn && (
                   <td className="px-6 py-4">
                     <div className="text-sm text-gray-900 dark:text-white">
                       {application.job?.title || 'Unknown Job'}
                     </div>
                     <div className="text-sm text-gray-500 dark:text-gray-400">
                       {application.job?.company?.name || company?.name || 'My Company'}
                     </div>
                   </td>
                 )}
                 
                 <td className="px-6 py-4">
                   <select
                     value={application.status}
                     onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                     disabled={loading}
                     className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed ${
                       STATUS_COLORS[application.status] || STATUS_COLORS.pending
                     }`}
                   >
                     {STATUS_OPTIONS.slice(1).map(option => (
                       <option key={option.value} value={option.value}>
                         {option.label}
                       </option>
                     ))}
                   </select>
                 </td>
                 
                 <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                   <div className="flex items-center">
                     <Calendar className="w-4 h-4 mr-1" />
                     {formatDate(application.applied_date, 'short')}
                   </div>
                   {application.updated_at !== application.applied_date && (
                     <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                       Updated {formatDate(application.updated_at, 'short')}
                     </div>
                   )}
                 </td>
                 
                 <td className="px-6 py-4 text-sm font-medium">
                   <div className="flex items-center space-x-2">
                     <Link
                       href={`/applications/${application.id}`}
                       className="text-[#0CCE68] hover:text-[#0BBE58] flex items-center"
                       title="View Details"
                     >
                       <Eye className="w-4 h-4" />
                     </Link>
                     
                     <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        startConversationWithApplicant(application);
                      }}
                      disabled={messagingLoading}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send Message"
                    >
                      {messagingLoading ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                    </button>
                     
                     {application.resume && (
                       <a
                         href={application.resume}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 flex items-center"
                         title="Download Resume"
                       >
                         <Download className="w-4 h-4" />
                       </a>
                     )}
                   </div>
                 </td>
               </tr>
             ))
           )}
         </tbody>
       </table>
     </div>

     {/* Pagination */}
     {pagination && pagination.totalPages > 1 && (
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Previous
            </button>
            
            {/* Page numbers for better UX */}
            <div className="flex items-center space-x-1">
              {/* Show page numbers around current page */}
              {(() => {
                const pages = [];
                const currentPage = pagination.page;
                const totalPages = pagination.totalPages;
                
                // Show first page if we're not near the beginning
                if (currentPage > 3) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      1
                    </button>
                  );
                  if (currentPage > 4) {
                    pages.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
                  }
                }
                
                // Show pages around current page
                for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      disabled={loading}
                      className={`px-2 py-1 text-sm border rounded transition-colors disabled:opacity-50 ${
                        i === currentPage
                          ? 'bg-[#0CCE68] text-white border-[#0CCE68]'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Show last page if we're not near the end
                if (currentPage < totalPages - 2) {
                  if (currentPage < totalPages - 3) {
                    pages.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )}

     {/* Error Message */}
     {error && (
       <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
         <div className="text-red-600 dark:text-red-400 text-sm flex items-center">
           <span className="mr-2">⚠️</span>
           {error}
         </div>
       </div>
     )}
   </div>
 );
}