// src/components/dashboard/jobseeker/ApplicationsOverview.jsx
import Link from 'next/link';
import { ChevronRight, Building, Clock, AlertCircle, Briefcase } from 'lucide-react';
import { formatDistance } from 'date-fns';

export default function ApplicationsOverview({ applications = [], onViewAll, error }) {
  // Status colors mapping
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    screening: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    interview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
    assessment: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
    offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    hired: 'bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-100',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };
  
  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Applications
          </h2>
          <button 
            onClick={onViewAll}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Unable to load applications
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Applications
          </h2>
          <button 
            onClick={onViewAll}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No applications yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start applying to jobs that match your skills and interests.
          </p>
          <Link 
            href="/dashboard/jobseeker/jobs/search" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] transition-colors"
          >
            Find Jobs to Apply
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate statistics
  const stats = {
    total: applications.length,
    active: applications.filter(app => 
      ['applied', 'screening', 'interview', 'offer'].includes(app.status)
    ).length,
    successful: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            Your Applications
          </h2>
          <button 
            onClick={onViewAll}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center self-start sm:self-auto"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Stats summary - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Active</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hired</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.successful}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
          </div>
        </div>
        
        {/* Recent applications */}
        <div className="space-y-3">
          {applications.slice(0, 3).map(application => (
            <Link 
              key={application.id} 
              href={`/dashboard/jobseeker/applications/${application.id}`}
              className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-[#0CCE68] transition-colors">
                    {application.job_title}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{application.company_name}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-2">
                    <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>
                      Applied {application.applied_date ? formatDistance(new Date(application.applied_date), new Date(), { addSuffix: true }) : 'recently'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 self-start">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {application.status_display || application.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}