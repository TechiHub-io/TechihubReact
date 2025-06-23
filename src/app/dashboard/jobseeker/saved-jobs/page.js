// src/app/dashboard/jobseeker/saved-jobs/page.js 
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobListItem from '@/components/jobs/JobListItem';
import SearchInput from '@/components/jobs/SearchInput';
import { Bookmark, AlertCircle, Trash2 } from 'lucide-react';

export default function SavedJobsPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { 
    savedJobs, 
    loading, 
    error, 
    unsaveJob, 
    fetchSavedJobs,
    clearError 
  } = useSavedJobs();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (isEmployer) {
      router.push('/dashboard/employer');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Filter saved jobs based on search
  useEffect(() => {
    if (!savedJobs) return;
    
    let filtered = savedJobs.map(item => item.job).filter(job => job);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(term) || 
        job.company_name?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    }
    
    setFilteredJobs(filtered);
  }, [savedJobs, searchTerm]);
  
  // Handle job unsave
  const handleUnsaveJob = async (jobId) => {
    try {
      await unsaveJob(jobId);
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  // Refresh saved jobs
  const handleRefresh = () => {
    fetchSavedJobs();
  };

  if (!isAuthenticated || isEmployer) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Saved Jobs
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Jobs you've saved for later review
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
            >
              Find More Jobs
            </button>
          </div>
        </div>
        
        {/* Search */}
        {savedJobs && savedJobs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search saved jobs by title, company, or location"
            />
          </div>
        )}
        
       {/* Error Message */}
       {error && (
         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <AlertCircle className="h-5 w-5 mr-2" />
               <span>{error}</span>
             </div>
             <button
               onClick={clearError}
               className="text-red-500 hover:text-red-700"
             >
               ×
             </button>
           </div>
         </div>
       )}
       
       {/* Content */}
       {loading ? (
         /* Loading State */
         <div className="space-y-4">
           {[...Array(3)].map((_, index) => (
             <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex-1">
                   <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                   <div className="flex space-x-4 mb-3">
                     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                   </div>
                 </div>
                 <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
               </div>
             </div>
           ))}
         </div>
       ) : !savedJobs || savedJobs.length === 0 ? (
         /* Empty State */
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 py-12 px-4 text-center">
           <div className="max-w-md mx-auto">
             <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
               <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-500" />
             </div>
             <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
               No saved jobs yet
             </h2>
             <p className="text-gray-600 dark:text-gray-400 mb-6">
               Save jobs you're interested in to revisit them later. Look for the heart icon on job listings.
             </p>
             <button
               onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
               className="inline-flex items-center px-6 py-3 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
             >
               Browse Jobs
             </button>
           </div>
         </div>
       ) : filteredJobs.length === 0 ? (
         /* No Search Results */
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 py-12 px-4 text-center">
           <div className="max-w-md mx-auto">
             <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
               <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-500" />
             </div>
             <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
               No jobs match your search
             </h2>
             <p className="text-gray-600 dark:text-gray-400 mb-6">
               Try adjusting your search terms or clear the search to see all saved jobs.
             </p>
             <button
               onClick={() => setSearchTerm('')}
               className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
             >
               Clear Search
             </button>
           </div>
         </div>
       ) : (
         /* Saved Jobs List */
         <>
           {/* Results Count */}
           <div className="flex items-center justify-between mb-4">
             <p className="text-sm text-gray-600 dark:text-gray-400">
               {filteredJobs.length} saved job{filteredJobs.length !== 1 ? 's' : ''}
               {searchTerm && <span> matching "{searchTerm}"</span>}
             </p>
             
             {/* Clear Search */}
             {searchTerm && (
               <button
                 onClick={() => setSearchTerm('')}
                 className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
               >
                 Clear search
               </button>
             )}
           </div>

           {/* Jobs Grid */}
           <div className="space-y-4">
             {filteredJobs.map(job => (
               <div key={job.id} className="relative">
                 <JobListItem 
                   job={job} 
                   isSaved={true}
                   onUnsave={handleUnsaveJob}
                   showActions={true}
                   isEmployer={false}
                 />
                 
                 {/* Additional saved job info */}
                 <div className="absolute top-4 right-16 text-xs text-gray-500 dark:text-gray-400">
                   Saved {(() => {
                     const savedItem = savedJobs.find(item => item.job.id === job.id);
                     return savedItem ? new Date(savedItem.created_at).toLocaleDateString() : '';
                   })()}
                 </div>
               </div>
             ))}
           </div>

           {/* Bulk Actions */}
           {savedJobs.length > 1 && (
             <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-between">
                 <p className="text-sm text-gray-600 dark:text-gray-400">
                   Manage your saved jobs
                 </p>
                 <button
                   onClick={() => {
                     if (confirm('Are you sure you want to remove all saved jobs? This action cannot be undone.')) {
                       // Remove all saved jobs
                       Promise.all(savedJobs.map(item => unsaveJob(item.job.id)))
                         .catch(console.error);
                     }
                   }}
                   className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                 >
                   <Trash2 className="h-4 w-4 mr-1" />
                   Clear all saved jobs
                 </button>
               </div>
             </div>
           )}
         </>
       )}
     </div>
   </DashboardLayout>
 );
}