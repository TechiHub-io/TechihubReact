// src/components/analytics/AnalyticsDashboard.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompany } from '@/hooks/useCompany';
import useAuthAxios from '@/hooks/useAuthAxios';
import { useStore } from '@/hooks/useZustandStore';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartComponent from '@/components/dashboard/ChartComponent';
import PieChart from '@/components/dashboard/PieChart';
import { 
  Calendar, 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp, 
  PlusCircle, 
  BarChart2,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const axios = useAuthAxios();
  const [analyticsData, setAnalyticsData] = useState({
    jobViews: [],
    applicationStats: {
      statusBreakdown: [],
      timeToHire: 0,
      conversionRate: 0
    },
    jobPerformance: [],
    topSources: []
  });

  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState(null);
  
  const isDarkMode = useStore(state => state.isDarkMode);
  const { company } = useCompany();
  
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    if (!company?.id) return;
    
    setLoading(true);
    
    const fetchAnalyticsData = async () => {
      try {
        const allData = {
          jobViews: [],
          applicationStats: {
            statusBreakdown: [],
            timeToHire: 0,
            conversionRate: 0
          },
          jobPerformance: [],
          topSources: []
        };
        
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
        // Fetch application stats (this is working)
        try {
          const applicationStatsResponse = await axios.get(`${API_URL}/analytics/application-stats/`);
          const data = applicationStatsResponse.data;
          
          console.log("Application stats response:", data);
          
          allData.applicationStats = {
            statusBreakdown: data.status_breakdown || [],
            timeToHire: data.average_fill_time_days || 0,
            conversionRate: data.conversion_rate || 0
          };
          
          // Fix: Use the correct field names from your backend
          allData.jobPerformance = data.applications_per_job || [];
        } catch (error) {
          console.error("Failed to fetch application stats:", error);
        }
        
        // Fetch dashboard analytics for job views
        try {
          const dashboardResponse = await axios.get(`${API_URL}/analytics/dashboard/`);
          const dashData = dashboardResponse.data;
          
          console.log("Dashboard response:", dashData);
          
          // Create mock daily job views if not available
          if (dashData.daily_job_views && dashData.daily_job_views.length > 0) {
            allData.jobViews = dashData.daily_job_views;
          } else {
            // Create last 7 days with zero data
            allData.jobViews = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              return {
                date: date.toISOString().split('T')[0],
                count: 0
              };
            }).reverse();
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          // Create empty job views data
          allData.jobViews = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
              date: date.toISOString().split('T')[0],
              count: 0
            };
          }).reverse();
        }
        
        // Mock top sources data since it's not available yet
        allData.topSources = [
          { source: 'Direct', count: 0 },
          { source: 'Job Boards', count: 0 },
          { source: 'Social Media', count: 0 }
        ];
        
        console.log("Final analytics data:", allData);
        setAnalyticsData(allData);
        setDataFetched(true);
        
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setError(error.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
    
  }, [company?.id, dateRange, axios]);
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Format data for charts
  const jobViewsChartData = analyticsData.jobViews.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count || 0
  }));
  
  const statusChartData = analyticsData.applicationStats.statusBreakdown.map(status => ({
    name: status.status_display || status.status,
    value: status.count,
    color: getStatusColor(status.status)
  }));
  
  const sourcesChartData = analyticsData.topSources.map((source, index) => ({
    name: source.source,
    value: source.count,
    color: getSourceColor(index)
  }));
  
  // Check if data exists for charts - allow zero data to show
  const hasJobViewsData = jobViewsChartData.length > 0;
  const hasStatusData = statusChartData.length > 0;
  const hasSourcesData = sourcesChartData.length > 0;
  const hasJobPerformanceData = analyticsData.jobPerformance && analyticsData.jobPerformance.length > 0;
  
  // Calculate totals
  const totalJobViews = analyticsData.jobViews.reduce((sum, item) => sum + (item.count || 0), 0);
  const totalApplications = analyticsData.applicationStats.statusBreakdown.reduce((sum, item) => sum + item.count, 0);
  
  const handleRetry = () => {
    setError(null);
    setDataFetched(false);
  };
  
  if (loading && !dataFetched) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-red-700 dark:text-red-300">
          <h2 className="text-lg font-semibold mb-2">Error Loading Analytics</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track performance metrics for your job postings and applications
        </p>
      </header>
      
      {/* Date Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Date Range
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <input
                type="date"
                id="from"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="date"
                id="to"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Job Views" 
          value={totalJobViews} 
          icon="/images/dashboard/eye.svg"
          bgColor="bg-gradient-to-r from-blue-400 to-blue-500"
          textColor="text-white"
        />
        <StatsCard 
          title="Total Applications" 
          value={totalApplications} 
          icon="/images/dashboard/briefcase.svg"
          bgColor="bg-gradient-to-r from-green-400 to-green-500"
          textColor="text-white"
        />
        {/* <StatsCard 
          title="Conversion Rate" 
          value={`${analyticsData.applicationStats.conversionRate || 0}%`} 
          icon="/images/dashboard/post.svg"
          bgColor="bg-gradient-to-r from-purple-400 to-purple-500"
          textColor="text-white"
        /> */}
        <StatsCard 
          title="Avg. Time to Hire" 
          value={`${analyticsData.applicationStats.timeToHire || 0} days`} 
          icon="/images/dashboard/user.svg"
          bgColor="bg-gradient-to-r from-orange-400 to-orange-500"
          textColor="text-white"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Job Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Views Over Time
          </h2>
          <div className="h-64">
            {hasJobViewsData ? (
              <ChartComponent 
                data={jobViewsChartData} 
                xKey="date" 
                yKey="count" 
                color="#60A5FA"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <BarChart2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500">No job view data available yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Application Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Application Status Breakdown
          </h2>
          <div className="h-64">
            {hasStatusData ? (
              <PieChart data={statusChartData} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500">No application status data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Performance
        </h2>
        
        {!hasJobPerformanceData ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No job performance data available yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Job Title</th>
                  <th scope="col" className="px-6 py-3">Applications</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.jobPerformance.map((job, index) => (
                  <tr 
                    key={job.job_id || index} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {job.job_title || "Unknown Job"}
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {job.application_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {job.job_id && (
                        <Link 
                          href={`/jobs/${job.job_id}`}
                          className="text-[#0CCE68] hover:underline text-sm"
                        >
                          View Job
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for chart colors
function getStatusColor(status) {
  const colorMap = {
    'applied': '#60A5FA',      // blue-400
    'screening': '#F59E0B',    // amber-500
    'interview': '#8B5CF6',    // violet-500
    'assessment': '#EC4899',   // pink-500
    'offer': '#10B981',        // emerald-500
    'hired': '#34D399',        // green-400
    'rejected': '#EF4444',     // red-500
    'withdrawn': '#9CA3AF',    // gray-400
  };
  
  return colorMap[status] || '#9CA3AF';
}

function getSourceColor(index) {
  const colors = [
    '#60A5FA',  // blue-400
    '#34D399',  // green-400
    '#F59E0B',  // amber-500
    '#8B5CF6',  // violet-500
    '#EC4899',  // pink-500
    '#F97316',  // orange-500
    '#10B981',  // emerald-500
    '#6366F1',  // indigo-500
  ];
  
  return colors[index % colors.length];
}