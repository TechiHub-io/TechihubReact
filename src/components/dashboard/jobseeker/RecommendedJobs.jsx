// src/components/dashboard/jobseeker/RecommendedJobs.jsx
import Link from 'next/link';
import { useState } from 'react';
import { 
  Building, 
  MapPin, 
  ChevronRight, 
  ExternalLink, 
  AlertCircle, 
  Lightbulb, 
  Clock,
  RefreshCw,
  Filter,
  TrendingUp,
  Calendar,
  Building2
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import SaveJobButton from '@/components/jobs/SaveJobButton';
import { useSavedJobs } from '@/hooks/useSavedJobs';

export default function RecommendedJobs({ 
  jobs = [], 
  recommendationCount = 0,
  loading = false,
  error = null,
  onViewAll, 
  onSort,
  onRefresh
}) {
  const [sortBy, setSortBy] = useState('match');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Saved jobs functionality
  const { isJobSaved, saveJob, unsaveJob } = useSavedJobs();

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    if (onSort) {
      onSort(criteria);
    }
    setShowSortOptions(false);
  };

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await unsaveJob(jobId);
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  // Get match color based on percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getMatchBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recommended Jobs
          </h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recommended Jobs
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-[#0CCE68] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh recommendations"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={onViewAll}
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Unable to load job recommendations
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">
              {error}
            </p>
            <button 
              onClick={onRefresh} 
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recommended Jobs
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
          <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Complete your profile to get personalized job recommendations based on your skills and experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/dashboard/jobseeker/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-[#0CCE68] text-[#0CCE68] rounded-md hover:bg-[#0CCE68] hover:text-white transition-colors text-sm"
            >
              Complete Profile
            </Link>
            <Link 
              href="/dashboard/jobseeker/jobs/search" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Browse all jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended Jobs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {recommendationCount > 0 
                ? `${recommendationCount} personalized recommendations`
                : "Based on your profile and preferences"
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Filter className="h-4 w-4 mr-1" />
                Sort
              </button>
              
              {showSortOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {[
                      { value: 'match', label: 'Best Match', icon: TrendingUp },
                      { value: 'newest', label: 'Newest First', icon: Calendar },
                      { value: 'company', label: 'Company Name', icon: Building2 }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleSortChange(value)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                          sortBy === value 
                            ? 'text-[#0CCE68] bg-gray-50 dark:bg-gray-700' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-[#0CCE68] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh recommendations"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button
              onClick={onViewAll}
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {jobs.slice(0, 5).map(job => (
            <div
              key={job.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <Link href={`/jobs/${job.id}`} className="block">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[#0CCE68] transition-colors truncate mb-1">
                      {job.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.company_name}</span>
                  </div>
                  
                  {job.location && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Match percentage */}
                  {job.match_percentage && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getMatchColor(job.match_percentage)}`}>
                        {job.match_percentage}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        match
                      </div>
                    </div>
                  )}
                  
                  {/* Save button */}
                  <SaveJobButton
                    jobId={job.id}
                    isSaved={isJobSaved(job.id)}
                    onSave={handleSaveJob}
                    onUnsave={handleUnsaveJob}
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Match reason */}
              {job.reason && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {job.reason}
                  </span>
                </div>
              )}
              
              {/* Job details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                {job.created_at && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Posted {formatDistance(new Date(job.created_at), new Date(), { addSuffix: true })}</span>
                  </div>
                )}
                
                {job.job_type && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    {job.job_type_display || job.job_type}
                  </span>
                )}
                
                {job.is_remote && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded">
                    Remote
                  </span>
                )}
              </div>
              
              {/* Match percentage bar */}
              {job.match_percentage && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${getMatchBgColor(job.match_percentage)}`}
                      style={{ width: `${job.match_percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {jobs.length > 5 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Showing 5 of {jobs.length} recommendations
            </p>
            <Link 
              href="/dashboard/jobseeker/jobs/search" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View All Recommendations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}