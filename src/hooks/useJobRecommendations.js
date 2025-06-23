// src/hooks/useJobRecommendations.js
import { useState, useCallback, useEffect } from 'react';
import useAuthAxios from './useAuthAxios';

export function useJobRecommendations() {
  const axios = useAuthAxios();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendationCount, setRecommendationCount] = useState(0);

  // Fetch job recommendations
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/analytics/job-recommendations/`);
      
      const data = response.data;
      setRecommendations(data.recommendations || []);
      setRecommendationCount(data.recommendation_count || 0);
      
      setLoading(false);
      return data.recommendations || [];
    } catch (err) {
      console.error('Error fetching job recommendations:', err);
      
      // Handle specific errors
      if (err.response?.status === 400) {
        setError('Job recommendations are only available for job seekers');
      } else if (err.response?.status === 404) {
        setError('Profile not found. Please complete your profile to get recommendations.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch job recommendations');
      }
      
      setLoading(false);
      return [];
    }
  }, [axios]);

  // Sort recommendations by different criteria
  const sortRecommendations = useCallback((criteria = 'match') => {
    const sorted = [...recommendations].sort((a, b) => {
      switch (criteria) {
        case 'match':
          return (b.match_percentage || 0) - (a.match_percentage || 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'company':
          return (a.company_name || '').localeCompare(b.company_name || '');
        default:
          return 0;
      }
    });
    
    setRecommendations(sorted);
  }, [recommendations]);

  // Get recommendations by match score threshold
  const getHighMatchRecommendations = useCallback((threshold = 70) => {
    return recommendations.filter(job => (job.match_percentage || 0) >= threshold);
  }, [recommendations]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    recommendationCount,
    loading,
    error,
    fetchRecommendations,
    sortRecommendations,
    getHighMatchRecommendations,
    clearError
  };
}