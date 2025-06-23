// src/hooks/useDashboardAnalytics.js
import { useState, useCallback } from 'react';
import useAuthAxios from './useAuthAxios';

export function useDashboardAnalytics() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    profileViews: null,
    applications: [],
    savedJobs: [],
    applicationsOverTime: {}
  });

  // Fetch profile views analytics
  const fetchProfileViews = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/analytics/profile-views/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile views:', error);
      return null;
    }
  }, [axios]);

  // Fetch applications and group by time period
  const fetchApplicationsData = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/applications/`);
      const applications = response.data.results || response.data || [];
      
      // Group applications by month for chart
      const groupedByMonth = applications.reduce((acc, app) => {
        const month = new Date(app.applied_date).toISOString().substring(0, 7);
        const monthName = new Date(app.applied_date).toLocaleString('default', { month: 'short' });
        acc[monthName] = (acc[monthName] || 0) + 1;
        return acc;
      }, {});

      return { applications, groupedByMonth };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { applications: [], groupedByMonth: {} };
    }
  }, [axios]);

  // Fetch saved jobs
  const fetchSavedJobs = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/favorites/jobs/`);
      return response.data.results || response.data || [];
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return [];
    }
  }, [axios]);

  // Fetch all dashboard data
  const fetchDashboardAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileViews, applicationsData, savedJobs] = await Promise.all([
        fetchProfileViews(),
        fetchApplicationsData(),
        fetchSavedJobs()
      ]);

      setAnalyticsData({
        profileViews,
        applications: applicationsData.applications,
        savedJobs,
        applicationsOverTime: applicationsData.groupedByMonth
      });

      setLoading(false);
      return { profileViews, applicationsData, savedJobs };
    } catch (error) {
      setError(error.message || 'Failed to fetch dashboard analytics');
      setLoading(false);
      throw error;
    }
  }, [fetchProfileViews, fetchApplicationsData, fetchSavedJobs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyticsData,
    loading,
    error,
    fetchDashboardAnalytics,
    clearError
  };
}