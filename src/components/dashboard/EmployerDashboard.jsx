// src/components/dashboard/employer/EmployerDashboard.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/hooks/useZustandStore';
import { useCompany } from '@/hooks/useCompany';
import useAuthAxios from '@/hooks/useAuthAxios';
import { PlusCircle, FileText, BarChart2 } from 'lucide-react';

// Import dashboard components
import StatsCard from '@/components/dashboard/StatsCard';
import ChartComponent from '@/components/dashboard/ChartComponent';
import PieChart from '@/components/dashboard/PieChart';
import JobsOverview from '@/components/dashboard/employer/JobsOverview';
import ApplicationsOverview from '@/components/dashboard/employer/ApplicationsOverview';
import RecentActivities from '@/components/dashboard/employer/RecentActivities';

export default function EmployerDashboard() {
  const router = useRouter();
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeJobsCount: 0,
    totalApplications: 0,
    profileViewsCount: 0,
    jobViewsCount: 0,
    statusBreakdown: [],
    recentApplications: [],
    recentJobs: [],
    recentActivities: [],
    dailyJobViews: [],
    dailyApplications: []
  });
  
  // Get store state
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isEmployer = useStore(state => state.isEmployer);
  const user = useStore(state => state.user);
  const jobs = useStore(state => state.jobs || []);
  const fetchJobs = useStore(state => state.fetchJobs);
  
  // Use company hook for company data
  const { company, initializeCompany } = useCompany();
  
  // Use a ref to track if data has been loaded to prevent multiple loads
  const dataLoaded = useRef(false);
  
  // Authentication effect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (isAuthenticated && !isEmployer) {
      router.push('/dashboard/jobseeker');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Data loading effect - with careful dependency management
  useEffect(() => {
    // Skip if not authenticated or not employer
    if (!isAuthenticated || !isEmployer) return;
      
    // Skip if data has already been loaded
    if (dataLoaded.current) return;
      
    // Mark data as loading
    setLoading(true);
      
    // Async function to load dashboard data
    const loadDashboardData = async () => {
      try {
        // Store company ID to prevent access after unmount
        let companyId = company?.id;
              
        // Initialize company if needed
        if (!companyId) {
          try {
            const companyData = await initializeCompany();
            companyId = companyData?.id;
          } catch (companyError) {
            console.error('Error initializing company:', companyError);
          }
        }
              
        // Only fetch jobs if we have a company ID and jobs haven't been loaded
        if (companyId && jobs.length === 0) {
          try {
            await fetchJobs({ company: companyId });
          } catch (jobsError) {
            console.error('Error fetching jobs:', jobsError);
            // Continue even if jobs fetch fails
          }
        }
              
        // API endpoint
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
              
        // Create empty stat containers
        let dashboardResults = null;
        let applicationsResults = null;
        let activityResults = null;
              
        // Try all API calls but don't fail if any of them fail
        try {
          // Fetch dashboard data
          const dashboardResponse = await axios.get(`${API_URL}/analytics/dashboard/`);
          dashboardResults = dashboardResponse.data;
        } catch (error) {
          console.error('Dashboard analytics unavailable, using defaults:', error);
          // Create empty dashboard data structure
          dashboardResults = {
            active_jobs_count: 0,
            total_applications: 0,
            profile_views_count: 0,
            job_views_count: 0,
            recent_applications: [],
            recent_jobs: [],
            daily_job_views: []
          };
        }
              
        try {
          // Fetch application stats
          const applicationsResponse = await axios.get(`${API_URL}/analytics/application-stats/`);
          applicationsResults = applicationsResponse.data;
        } catch (error) {
          console.error('Application stats unavailable, using defaults:', error);
          // Create empty application stats structure
          applicationsResults = {
            status_breakdown: [],
            daily_applications: []
          };
        }
              
        try {
          // Fetch activity data - if this fails, we just use an empty array
          const activityResponse = await axios.get(`${API_URL}/analytics/activities/`);
          activityResults = activityResponse.data;
        } catch (error) {
          console.error('Activities unavailable, using empty array:', error);
          activityResults = { activities: [] };
        }
              
        // Create empty data arrays if needed
        const dailyJobViews = dashboardResults?.daily_job_views || 
          Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
            count: 0
          })).reverse();
              
        const dailyApplications = applicationsResults?.daily_applications || 
          Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
            count: 0
          })).reverse();
              
        // Combine data with fallbacks
        const combinedData = {
          activeJobsCount: dashboardResults?.active_jobs_count || jobs.length || 0,
          totalApplications: dashboardResults?.total_applications || 0,
          profileViewsCount: dashboardResults?.profile_views_received || 0,
          jobViewsCount: dashboardResults?.job_views_received || 0,
          statusBreakdown: applicationsResults?.status_breakdown || [],
          recentApplications: dashboardResults?.recent_applications || [],
          recentJobs: dashboardResults?.recent_jobs || [],
          recentActivities: activityResults?.activities || [],
          dailyJobViews,
          dailyApplications
        };
              
        // Update state with the combined data
        setDashboardData(combinedData);
              
        // Mark data as loaded
        dataLoaded.current = true;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
      
    // Execute the data loading function
    loadDashboardData();
      
  }, [isAuthenticated, isEmployer]);

  // Format chart data
  const statusChartData = dashboardData.statusBreakdown?.map(status => ({
    name: status.status_display || status.status,
    value: status.count,
    color: getStatusColor(status.status)
  })) || [];

  const dailyViewChartData = dashboardData.dailyJobViews?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count || 0
  })) || [];

  const dailyApplicationChartData = dashboardData.dailyApplications?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count || 0
  })) || [];

  // Check if data exists for charts
  const hasStatusData = statusChartData.length > 0 && statusChartData.some(item => item.value > 0);
  const hasViewData = dailyViewChartData.length > 0 && dailyViewChartData.some(item => item.count > 0);
  const hasApplicationData = dailyApplicationChartData.length > 0 && dailyApplicationChartData.some(item => item.count > 0);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with welcome message and company info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.first_name || 'there'}!
        </h1>
        {company && (
          <div className="flex items-center">
            <p className="text-gray-600 dark:text-gray-300">
              Managing {company.name}
            </p>
           
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Active Jobs" 
          value={dashboardData.activeJobsCount} 
          icon="/images/dashboard/post.svg"
          bgColor="bg-gradient-to-r from-green-400 to-green-500"
          textColor="text-white"
        />
        <StatsCard 
          title="Total Applications" 
          value={dashboardData.totalApplications} 
          icon="/images/dashboard/briefcase.svg"
          bgColor="bg-gradient-to-r from-blue-400 to-blue-500"
          textColor="text-white"
        />
        <StatsCard 
          title="Profile Views" 
          value={dashboardData.profileViewsCount} 
          icon="/images/dashboard/user.svg"
          bgColor="bg-gradient-to-r from-cyan-400 to-cyan-500"
          textColor="text-white"
        />
        <StatsCard 
          title="Job Views" 
          value={dashboardData.jobViewsCount} 
          icon="/images/dashboard/eye.svg"
          bgColor="bg-gradient-to-r from-indigo-400 to-indigo-500"
          textColor="text-white"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link 
          href="/jobs/create" 
          className="flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Post New Job
        </Link>
        <Link 
          href="/dashboard/employer/applications" 
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FileText className="h-4 w-4 mr-2" />
          View Applications
        </Link>
        <Link 
          href="/dashboard/employer/analytics" 
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Analytics
        </Link>
      </div>
      
      {/* Charts and Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Application Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Status</h2>
          <div className="h-64">
            {hasStatusData ? (
              <PieChart data={statusChartData} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No application data available yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Job Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Views (Last 7 Days)</h2>
          <div className="h-64">
            {hasViewData ? (
              <ChartComponent 
                data={dailyViewChartData} 
                xKey="date" 
                yKey="count" 
                color="#0CCE68"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No job view data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Jobs and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Jobs</h2>
            <Link 
              href="/jobs/manage" 
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58]"
            >
              View All
            </Link>
          </div>
          {dashboardData.recentJobs && dashboardData.recentJobs.length > 0 ? (
            <JobsOverview jobs={dashboardData.recentJobs} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No recent jobs available</p>
              <Link href="/jobs/create" className="inline-block mt-3 text-[#0CCE68] hover:underline">
                Post your first job
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
            <Link 
              href="/applications" 
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58]"
            >
              View All
            </Link>
          </div>
          {dashboardData.recentApplications && dashboardData.recentApplications.length > 0 ? (
            <ApplicationsOverview applications={dashboardData.recentApplications} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No applications received yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Applications will appear here when candidates apply to your jobs
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Daily Applications Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Applications Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications (Last 7 Days)</h2>
          <div className="h-64">
            {hasApplicationData ? (
              <ChartComponent 
                data={dailyApplicationChartData} 
                xKey="date" 
                yKey="count" 
                color="#3B82F6"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No application data available yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 ? (
            <RecentActivities activities={dashboardData.recentActivities} />
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

// Helper functions for status colors
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