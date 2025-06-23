// src/hooks/useApplicationAnalytics.js
import { useState, useCallback } from 'react';
import useAuthAxios from './useAuthAxios';

export function useApplicationAnalytics() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get application analytics
  const fetchApplicationStats = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.job_id) queryParams.set('job_id', filters.job_id);
      if (filters.date_from) queryParams.set('date_from', filters.date_from);
      if (filters.date_to) queryParams.set('date_to', filters.date_to);
      
      const response = await axios.get(`${API_URL}/analytics/application-stats/?${queryParams}`);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error fetching application analytics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
      setLoading(false);
      return null;
    }
  }, [axios]);
  
  // Get job-specific application stats
  const fetchJobApplicationStats = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/applications/job/${jobId}/stats/`);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error fetching job application stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch job stats');
      setLoading(false);
      return null;
    }
  }, [axios]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    fetchApplicationStats,
    fetchJobApplicationStats,
    loading,
    error,
    clearError
  };
}