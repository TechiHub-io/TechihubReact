// src/hooks/useJobs.js - with useCallback
import { useState, useCallback } from 'react';
import { useStore } from './useZustandStore';
import useAuthAxios from './useAuthAxios';
import Cookies from 'js-cookie';

export function useJobs() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get store state and actions
  const { 
    jobs, 
    currentJob, 
    company,
    // These might be undefined, so provide fallbacks
    setJobs: storeSetJobs,
    setCurrentJob: storeSetCurrentJob
  } = useStore(state => ({
    jobs: state.jobs || [],
    currentJob: state.currentJob,
    company: state.company,
    setJobs: state.setJobs,
    setCurrentJob: state.setCurrentJob
  }));

  // Local state updater for when store functions aren't available
  const [localJobs, setLocalJobs] = useState([]);
  const [localCurrentJob, setLocalCurrentJob] = useState(null);

  // Safely update jobs state (either in store or locally)
  const updateJobs = useCallback((jobsOrUpdater) => {
    if (typeof storeSetJobs === 'function') {
      storeSetJobs(jobsOrUpdater);
    } else {
      if (typeof jobsOrUpdater === 'function') {
        setLocalJobs(jobsOrUpdater(localJobs));
      } else {
        setLocalJobs(jobsOrUpdater);
      }
    }
  }, [storeSetJobs, localJobs]);

  // Safely update current job state
  const updateCurrentJob = useCallback((job) => {
    if (typeof storeSetCurrentJob === 'function') {
      storeSetCurrentJob(job);
    } else {
      setLocalCurrentJob(job);
    }
  }, [storeSetCurrentJob]);

  // Create a new job
  const createJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);

    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID not found. Please select a company first.');
      }

      // Ensure job is associated with the company
      const jobPayload = {
        ...jobData,
        company: companyId
      };

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
     
      const response = await axios.post(`${API_URL}/jobs/`, jobPayload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const newJob = response.data;
      
      // Update jobs list safely using the wrapper function
      updateJobs(prevJobs => [newJob, ...(prevJobs || [])]);
      setLoading(false);
      
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to create job');
      setLoading(false);
      
      throw error;
    }
  }, [company, updateJobs, axios]);

  // Fetch jobs for the current company (using the safety wrapper)
  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID not found. Please select a company first.');
      }

      // Add company ID to filters
      const queryParams = new URLSearchParams({
        ...filters,
        company: companyId
      });

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/jobs/?${queryParams}`);
      
      const jobsData = response.data.results || response.data;
      
      // Update state safely
      updateJobs(jobsData);
      setLoading(false);
      
      return jobsData;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to fetch jobs');
      setLoading(false);
      
      // Return empty array in case of error
      return [];
    }
  }, [company, updateJobs, axios]);

  // Fetch a single job by ID
  const fetchJobById = useCallback(async (jobId) => {
    if (!jobId) return null;
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/jobs/${jobId}/`);
      
      const jobData = response.data;
      
      // Update current job in state safely
      updateCurrentJob(jobData);
      setLoading(false);
      
      return jobData;
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error);
      setError(error.message || 'Failed to fetch job details');
      setLoading(false);
      
      return null;
    }
  }, [updateCurrentJob, axios]);

  // Update a job
  const updateJob = useCallback(async (jobId, jobData) => {
    if (!jobId) throw new Error('Job ID is required');
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.put(`${API_URL}/jobs/${jobId}/`, jobData);
      
      const updatedJob = response.data;
      
      // Update job in state safely
      updateJobs(prevJobs => 
        (prevJobs || []).map(job => 
          job.id === jobId ? updatedJob : job
        )
      );
      
      // Update current job if it's the one being edited
      if ((currentJob || localCurrentJob)?.id === jobId) {
        updateCurrentJob(updatedJob);
      }
      
      setLoading(false);
      
      return updatedJob;
    } catch (error) {
      console.error(`Error updating job ${jobId}:`, error);
      setError(error.message || 'Failed to update job');
      setLoading(false);
      
      throw error;
    }
  }, [currentJob, localCurrentJob, updateJobs, updateCurrentJob, axios]);

  // Toggle job active status
  const toggleJobStatus = useCallback(async (jobId, isActive) => {
    if (!jobId) throw new Error('Job ID is required');
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const endpoint = isActive ? 
        `${API_URL}/jobs/${jobId}/activate/` : 
        `${API_URL}/jobs/${jobId}/deactivate/`;
      
      const response = await axios.post(endpoint);
      
      const updatedJob = response.data;
      
      // Update job in state safely
      updateJobs(prevJobs => 
        (prevJobs || []).map(job => 
          job.id === jobId ? updatedJob : job
        )
      );
      
      // Update current job if it's the one being toggled
      if ((currentJob || localCurrentJob)?.id === jobId) {
        updateCurrentJob(updatedJob);
      }
      
      setLoading(false);
      
      return updatedJob;
    } catch (error) {
      console.error(`Error toggling job status for ${jobId}:`, error);
      setError(error.message || 'Failed to update job status');
      setLoading(false);
      
      throw error;
    }
  }, [currentJob, localCurrentJob, updateJobs, updateCurrentJob, axios]);

  // Delete a job
  const deleteJob = useCallback(async (jobId) => {
    if (!jobId) throw new Error('Job ID is required');
    
    setLoading(true);
    setError(null);
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/jobs/${jobId}/`);
      
      // Remove job from state safely
      updateJobs(prevJobs => (prevJobs || []).filter(job => job.id !== jobId));
      
      // Clear current job if it's the one being deleted
      if ((currentJob || localCurrentJob)?.id === jobId) {
        updateCurrentJob(null);
      }
      
      setLoading(false);
      
      return true;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      setError(error.message || 'Failed to delete job');
      setLoading(false);
      
      throw error;
    }
  }, [currentJob, localCurrentJob, updateJobs, updateCurrentJob, axios]);

  // Add a skill to a job
  const addJobSkill = useCallback(async (jobId, skillData) => {
    if (!jobId) throw new Error('Job ID is required');
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.post(`${API_URL}/jobs/${jobId}/add_skill/`, skillData);
      
      const updatedJob = response.data;
      
      // Update job in state safely
      updateJobs(prevJobs => 
        (prevJobs || []).map(job => 
          job.id === jobId ? updatedJob : job
        )
      );
      
      // Update current job if it's the one being modified
      if ((currentJob || localCurrentJob)?.id === jobId) {
        updateCurrentJob(updatedJob);
      }
      
      setLoading(false);
      
      return updatedJob;
    } catch (error) {
      console.error(`Error adding skill to job ${jobId}:`, error);
      setError(error.message || 'Failed to add skill to job');
      setLoading(false);
      
      throw error;
    }
  }, [currentJob, localCurrentJob, updateJobs, updateCurrentJob, axios]);

  // Clear the hook error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Return either store jobs or local jobs
    jobs: Array.isArray(jobs) ? jobs : Array.isArray(localJobs) ? localJobs : [],
    currentJob: currentJob || localCurrentJob,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    toggleJobStatus,
    deleteJob,
    addJobSkill,
    clearError
  };
}