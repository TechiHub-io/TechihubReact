// src/hooks/useSavedJobs.js
import { useState, useCallback, useEffect } from 'react';
import useAuthAxios from './useAuthAxios';

export function useSavedJobs() {
  const axios = useAuthAxios();
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all saved jobs
  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/favorites/jobs/`);
      
      const savedJobsData = response.data.results || response.data || [];
      setSavedJobs(savedJobsData);
      
      // Create a Set of saved job IDs for quick lookup
      const jobIds = new Set(savedJobsData.map(item => item.job.id));
      setSavedJobIds(jobIds);
      
      setLoading(false);
      return savedJobsData;
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch saved jobs');
      setLoading(false);
      return [];
    }
  }, [axios]);

  // Save a job
  const saveJob = useCallback(async (jobId, notes = '') => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/favorites/jobs/`, {
        job: jobId,
        notes
      });
      
      // Update local state
      setSavedJobs(prev => [response.data, ...prev]);
      setSavedJobIds(prev => new Set([...prev, jobId]));
      
      return response.data;
    } catch (err) {
      console.error('Error saving job:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save job');
      throw err;
    }
  }, [axios]);

  // Unsave a job
  const unsaveJob = useCallback(async (jobId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/favorites/jobs/${jobId}/`);
      
      // Update local state
      setSavedJobs(prev => prev.filter(item => item.job.id !== jobId));
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      
      return true;
    } catch (err) {
      console.error('Error unsaving job:', err);
      setError(err.response?.data?.message || err.message || 'Failed to unsave job');
      throw err;
    }
  }, [axios]);

  // Check if a job is saved
  const isJobSaved = useCallback((jobId) => {
    return savedJobIds.has(jobId);
  }, [savedJobIds]);

  // Toggle save status
  const toggleSaveJob = useCallback(async (jobId, notes = '') => {
    if (isJobSaved(jobId)) {
      await unsaveJob(jobId);
      return false; // Job was unsaved
    } else {
      await saveJob(jobId, notes);
      return true; // Job was saved
    }
  }, [isJobSaved, saveJob, unsaveJob]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load saved jobs on mount
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return {
    savedJobs,
    savedJobIds,
    loading,
    error,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    toggleSaveJob,
    isJobSaved,
    clearError
  };
}