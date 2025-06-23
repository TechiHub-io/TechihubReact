// src/hooks/useCompanyReviews.js
import { useState, useCallback } from 'react';
import useAuthAxios from './useAuthAxios';

export function useCompanyReviews() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Submit a company review
  const submitReview = useCallback(async (companyId, reviewData) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/companies/${companyId}/add_review/`, reviewData);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit review');
      setLoading(false);
      throw err;
    }
  }, [axios]);

  // Get company reviews (from company details)
  const getCompanyReviews = useCallback(async (companyId) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/companies/${companyId}/`);
      
      setLoading(false);
      return response.data.reviews || [];
    } catch (err) {
      console.error('Error fetching company reviews:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch reviews');
      setLoading(false);
      return [];
    }
  }, [axios]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    submitReview,
    getCompanyReviews,
    loading,
    error,
    clearError
  };
}