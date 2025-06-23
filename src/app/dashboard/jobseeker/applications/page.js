// src/app/dashboard/jobseeker/applications/page.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ApplicationCard from '@/components/applications/ApplicationCard';
import { FileText, AlertCircle, Search } from 'lucide-react';

export default function ApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { 
    applications, 
    loading, 
    error, 
    fetchApplications,
    withdrawApplication,
    clearError 
  } = useApplications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredApplications, setFilteredApplications] = useState([]);
  
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
  
  // Fetch applications on mount
  useEffect(() => {
    if (isAuthenticated && !isEmployer) {
      fetchApplications();
    }
  }, [isAuthenticated, isEmployer, fetchApplications]);
  
  // Filter applications
  useEffect(() => {
    let filtered = applications || [];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(term) || 
        app.job?.company_name?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);
  
  // Handle withdraw application
  const handleWithdraw = async (applicationId) => {
    try {
      const result = await withdrawApplication(applicationId);
      return result;
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      return { success: false, message: 'Failed to withdraw application. Please try again.' };
    }
  };

  const handleRefresh = useCallback(async () => {
    try {
      await fetchApplications();
    } catch (error) {
      console.error('Failed to refresh applications:', error);
    }
  }, [fetchApplications]);

  if (!isAuthenticated || isEmployer) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Applications
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track the status of your job applications
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
            className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
          >
            Find More Jobs
          </button>
        </div>
        
        {/* Filters */}
        {applications && applications.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or company"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="assessment">Assessment</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
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
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !applications || applications.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 py-12 px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No applications yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start applying to jobs to see your applications here. Your application history and status updates will appear in this section.
              </p>
              <button
                onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
                className="inline-flex items-center px-6 py-3 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          /* No Search Results */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 py-12 px-4 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No applications match your search
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or filters to find your applications.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          /* Applications List */
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
            
            <div className="space-y-4">
              {filteredApplications.map(application => (
                <ApplicationCard 
                  key={application.id} 
                  application={application}
                  onWithdraw={handleWithdraw}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}