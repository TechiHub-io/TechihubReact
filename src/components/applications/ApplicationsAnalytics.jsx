// src/components/applications/ApplicationsAnalytics.jsx
import React, { useState, useEffect } from 'react';
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

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  hired: 'bg-green-200 text-green-900 dark:bg-green-800/20 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300'
};

export default function ApplicationsAnalytics({ jobId = null, className = "" }) {
  const { fetchApplicationStats, fetchJobApplicationStats, loading, error } = useApplicationAnalytics();
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0] // Today
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
    return null;
  }

  const {
    total_applications = 0,
    status_breakdown = [],
    conversion_rate = 0,
    average_fill_time_days = 0,
    daily_applications = [],
    top_sources = []
  } = analytics;

  // Calculate metrics
  const totalHired = status_breakdown.find(s => s.status === 'hired')?.count || 0;
  const hireRate = total_applications > 0 ? ((totalHired / total_applications) * 100).toFixed(1) : 0;

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
            {conversion_rate}%
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
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || STATUS_COLORS.pending} mb-2`}>
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

      {/* Daily Applications Chart */}
      {daily_applications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Trends</h3>
          <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-end space-x-1">
            {daily_applications.slice(-14).map((day, index) => {
              const maxCount = Math.max(...daily_applications.slice(-14).map(d => d.count));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-[#0CCE68] rounded-t w-full min-h-[4px] transition-all duration-300"
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${day.count} applications`}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 transform -rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Sources */}
      {top_sources.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Application Sources</h3>
          <div className="space-y-2">
            {top_sources.slice(0, 5).map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{source.source || 'Direct'}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-[#0CCE68] h-2 rounded-full"
                      style={{ width: `${source.percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {source.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}