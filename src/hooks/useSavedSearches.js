// Custom hook for saved searches functionality
import { useState, useCallback, useEffect } from 'react';
import { useAuthAxios } from './useAuthAxios';

export const useSavedSearches = () => {
  const authAxios = useAuthAxios();
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all saved searches
  const fetchSavedSearches = useCallback(async () => {
    if (!authAxios) return;

    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.get('saved-searches/');
      setSavedSearches(response.data.results || []);
    } catch (err) {
      console.error('Failed to fetch saved searches:', err);
      setError(err.response?.data?.message || 'Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Create a new saved search
  const createSavedSearch = useCallback(async (searchData) => {
    if (!authAxios) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.post('saved-searches/', searchData);
      const newSearch = response.data;
      setSavedSearches(prev => [newSearch, ...prev]);
      return newSearch;
    } catch (err) {
      console.error('Failed to create saved search:', err);
      setError(err.response?.data?.message || 'Failed to save search');
      return null;
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Update a saved search
  const updateSavedSearch = useCallback(async (searchId, updateData) => {
    if (!authAxios) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.patch(`saved-searches/${searchId}/`, updateData);
      const updatedSearch = response.data;
      setSavedSearches(prev => 
        prev.map(search => search.id === searchId ? updatedSearch : search)
      );
      return updatedSearch;
    } catch (err) {
      console.error('Failed to update saved search:', err);
      setError(err.response?.data?.message || 'Failed to update search');
      return null;
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Delete a saved search
  const deleteSavedSearch = useCallback(async (searchId) => {
    if (!authAxios) return false;

    setLoading(true);
    setError(null);

    try {
      await authAxios.delete(`saved-searches/${searchId}/`);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      return true;
    } catch (err) {
      console.error('Failed to delete saved search:', err);
      setError(err.response?.data?.message || 'Failed to delete search');
      return false;
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Execute a saved search
  const executeSavedSearch = useCallback(async (searchId) => {
    if (!authAxios) return { results: [], count: 0 };

    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.post(`saved-searches/${searchId}/execute_search/`);
      return {
        results: response.data.results || [],
        count: response.data.total_results || 0,
        searchName: response.data.search_name
      };
    } catch (err) {
      console.error('Failed to execute saved search:', err);
      setError(err.response?.data?.message || 'Failed to execute search');
      return { results: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  // Load saved searches on mount
  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  return {
    savedSearches,
    loading,
    error,
    fetchSavedSearches,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    executeSavedSearch,
    clearError: () => setError(null)
  };
};
