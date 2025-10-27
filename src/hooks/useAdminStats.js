// src/hooks/useAdminStats.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import api from '@/lib/api';

export function useAdminStats() {
  const { isAdmin, accessibleCompanies } = useAdminAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    recentJobs: [],
    dailyApplications: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (!isAdmin || loading) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch multiple endpoints in parallel
      const [
        dashboardResponse,
        applicationStatsResponse,
        jobsResponse
      ] = await Promise.allSettled([
        api.get('/analytics/dashboard/'),
        api.get('/analytics/application-stats/'),
        api.get('/jobs/admin-posted/')
      ]);

      let combinedStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalUsers: 0,
        recentJobs: [],
        dailyApplications: []
      };

      // Process dashboard analytics
      if (dashboardResponse.status === 'fulfilled') {
        const dashboardData = dashboardResponse.value.data;
        combinedStats.activeJobs = dashboardData.active_jobs_count || 0;
        combinedStats.totalApplications = dashboardData.total_applications || 0;
        combinedStats.recentJobs = dashboardData.recent_jobs || [];
      }

      // Process application stats
      if (applicationStatsResponse.status === 'fulfilled') {
        const appStatsData = applicationStatsResponse.value.data;
        combinedStats.totalApplications = appStatsData.total_applications || combinedStats.totalApplications;
        combinedStats.dailyApplications = appStatsData.daily_applications || [];
      }

      // Process jobs data
      if (jobsResponse.status === 'fulfilled') {
        const jobsData = jobsResponse.value.data;
        
        if (Array.isArray(jobsData)) {
          combinedStats.totalJobs = jobsData.length;
          combinedStats.activeJobs = jobsData.filter(job => job.is_active).length;
          
          // Use recent jobs from jobs endpoint if dashboard didn't provide them
          if (combinedStats.recentJobs.length === 0) {
            combinedStats.recentJobs = jobsData
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map(job => ({
                id: job.id,
                title: job.title,
                company_name: job.company?.name || 'Unknown Company',
                created_at: job.created_at,
                is_active: job.is_active,
                application_count: job.applications?.length || 0
              }));
          }
        } else if (jobsData && typeof jobsData === 'object' && jobsData.results) {
          // Handle paginated response
          combinedStats.totalJobs = jobsData.count || jobsData.results.length;
          combinedStats.activeJobs = jobsData.results.filter(job => job.is_active).length;
          
          if (combinedStats.recentJobs.length === 0) {
            combinedStats.recentJobs = jobsData.results
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map(job => ({
                id: job.id,
                title: job.title,
                company_name: job.company?.name || 'Unknown Company',
                created_at: job.created_at,
                is_active: job.is_active,
                application_count: job.applications?.length || 0
              }));
          }
        }
      }

      // Try to get user count from activities endpoint
      try {
        const activitiesResponse = await api.get('/analytics/activities/');
        // Extract user count from activities if available
        combinedStats.totalUsers = activitiesResponse.data?.total_users || 0;
      } catch (activitiesError) {

        combinedStats.totalUsers = 0;
      }

      setStats(combinedStats);

    } catch (err) {
      console.error('Error fetching admin stats:', err);
      
      let errorMessage = 'Failed to load admin statistics';
      if (err.response?.status === 404) {
        errorMessage = 'Admin analytics endpoints not found. Please check API configuration.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Admin permissions required.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin && accessibleCompanies.length > 0 && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchStats();
    } else if (!isAdmin) {
      fetchedRef.current = false;
      setStats({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalUsers: 0,
        recentJobs: [],
        dailyApplications: []
      });
    }
  }, [isAdmin, accessibleCompanies.length, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}