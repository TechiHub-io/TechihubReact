// Custom hook for talent search functionality
import { useState, useCallback } from 'react';
import { useAuthAxios } from './useAuthAxios';

export const useTalentSearch = () => {
  const authAxios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search profiles
  const searchProfiles = useCallback(async (searchParams = {}, page = 1) => {
    if (!authAxios) return { results: [], count: 0 };

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Add search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });
      
      params.append('page', page.toString());
      
      const response = await authAxios.get(`profiles/?${params.toString()}`);
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      };
    } catch (err) {
      console.error('Profile search failed:', err);
      setError(err.response?.data?.message || 'Search failed');
      return { results: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Preview search results
  const previewSearch = useCallback(async (searchParams = {}) => {
    if (!authAxios) return { results: [], count: 0 };

    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.post('saved-searches/preview_search/', searchParams);
      return {
        results: response.data.preview_results || [],
        count: response.data.total_results || 0
      };
    } catch (err) {
      console.error('Search preview failed:', err);
      setError(err.response?.data?.message || 'Preview failed');
      return { results: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  return {
    searchProfiles,
    previewSearch,
    loading,
    error,
    clearError: () => setError(null)
  };
};
