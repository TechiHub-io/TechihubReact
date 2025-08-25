

// src/components/applications/ApplicationsAnalytics.jsx
// Replace the entire component with this improved version:

import React, { useState, useEffect, useMemo } from 'react';
import { useApplicationAnalytics } from '@/hooks/useApplicationAnalytics';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Calendar,
  Filter
} from 'lucide-react';

// Updated STATUS_COLORS to match your backend STATUS_CHOICES
const STATUS_COLORS = {
  applied: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  screening: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  assessment: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300'
};

export default function ApplicationsAnalytics({ jobId = null, className = "" }) {
  const { fetchApplicationStats, fetchJobApplicationStats, loading, error } = useApplicationAnalytics();
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        let data;
        if (jobId) {
          data = await fetchJobApplicationStats(jobId);
        } else {
          data = await fetchApplicationStats({
            date_from: dateRange.from,
            date_to: dateRange.to
          });
        }
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();
  }, [jobId, dateRange, fetchApplicationStats, fetchJobApplicationStats]);

  // Process and sort daily applications data
  const sortedDailyApplications = useMemo(() => {
    if (!analytics?.daily_applications) return [];
    
    return [...analytics.daily_applications]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        ...day,
        formattedDate: new Date(day.date).toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: new Date(day.date).toLocaleDateString()
      }));
  }, [analytics?.daily_applications]);


  if (loading && !analytics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          No analytics data available yet
        </div>
      </div>
    );
  }

  // Extract data with proper fallbacks
  const {
    total_applications = 0,
    status_breakdown = [],
    applications_per_job = [],
    average_fill_time_days = 0
  } = analytics;

  // Calculate metrics
  const totalHired = status_breakdown.find(s => s.status === 'hired')?.count || 0;
  const totalInProgress = status_breakdown.filter(s => 
    ['screening', 'interview', 'assessment', 'offer'].includes(s.status)
  ).reduce((sum, item) => sum + item.count, 0);
  
  const hireRate = total_applications > 0 ? ((totalHired / total_applications) * 100).toFixed(1) : 0;
  const totalApplied = status_breakdown.find(s => s.status === 'applied')?.count || 0;
  const conversionRate = total_applications > 0 ? ((totalHired / total_applications) * 100).toFixed(1) : 0;
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Application Analytics
        </h2>
        
        {!jobId && (
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Applications</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {total_applications}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-medium text-green-800 dark:text-green-300">Hire Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {hireRate}%
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {conversionRate}%
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Avg. Time to Hire</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
            {average_fill_time_days} days
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {status_breakdown.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Status Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {status_breakdown.map((item) => (
              <div key={item.status} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || STATUS_COLORS.applied} mb-2`}>
                  {item.status_display || item.status}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {total_applications > 0 ? Math.round((item.count / total_applications) * 100) : 0}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Applications Chart - IMPROVED SORTING */}
      {sortedDailyApplications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Application Trends ({sortedDailyApplications.length} Days)
          </h3>
          <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-end justify-between">
            {sortedDailyApplications.map((day, index) => {
              const maxCount = Math.max(...sortedDailyApplications.map(d => d.count));
              const height = maxCount > 0 ? Math.max((day.count / maxCount) * 100, 2) : 2; // Minimum 2% height
              
              return (
                <div key={index} className="flex flex-col items-center" style={{ width: `${100 / sortedDailyApplications.length}%` }}>
                  <div className="flex flex-col items-center justify-end h-full">
                    {/* Count label above bar */}
                    {day.count > 0 && (
                      <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {day.count}
                      </span>
                    )}
                    
                    {/* Bar */}
                    <div 
                      className="bg-[#0CCE68] rounded-t w-4 transition-all duration-300 min-h-[2px]"
                      style={{ height: `${height}%` }}
                      title={`${day.fullDate}: ${day.count} applications`}
                    />
                  </div>
                  
                  {/* Date label */}
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 transform -rotate-45 origin-center whitespace-nowrap">
                    {day.formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Summary info */}
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>
              {sortedDailyApplications.length > 0 && (
                <>
                  {sortedDailyApplications[0].fullDate} - {sortedDailyApplications[sortedDailyApplications.length - 1].fullDate}
                </>
              )}
            </span>
            <span>
              Total: {sortedDailyApplications.reduce((sum, day) => sum + day.count, 0)} applications
            </span>
          </div>
          
          {/* Show message if all days are zero */}
          {sortedDailyApplications.every(d => d.count === 0) && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              <p className="text-sm">No applications in the selected period</p>
              {total_applications > 0 && (
                <p className="text-xs">Total applications outside this period: {total_applications}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Applications per Job */}
      {applications_per_job.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Applications per Job</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {applications_per_job
              .sort((a, b) => b.application_count - a.application_count) // Sort by count descending
              .slice(0, 10)
              .map((job) => (
                <div key={job.job_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {job.job_title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-[#0CCE68] h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((job.application_count / Math.max(...applications_per_job.map(j => j.application_count))) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                        {job.application_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {applications_per_job.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalInProgress}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Successful Hires</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalHired}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// const conversionRate = total_applications > 0 ? ((totalHired / total_applications) * 100).toFixed(1) : 0;
