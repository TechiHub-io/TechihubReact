// src/hooks/usePublicJobs.js - Fixed to prevent duplicate calls
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// Create public axios instance (no auth headers)
const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

export function usePublicJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,
    next: null,
    previous: null
  });

  // Use ref to track current request and prevent duplicates
  const currentRequestRef = useRef(null);

  // Single function to handle both search and filters
  const fetchJobs = useCallback(async (searchQuery = '', filters = {}, page = 1) => {
    // Cancel previous request if still pending
    if (currentRequestRef.current) {
      currentRequestRef.current.cancel('New request initiated');
    }

    // Create cancel token for this request
    const cancelToken = axios.CancelToken.source();
    currentRequestRef.current = cancelToken;

    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add search query if present - backend uses 'search' parameter for full-text search
      if (searchQuery && searchQuery.trim()) {
        queryParams.set('search', searchQuery.trim());
      }
      
      // Add filters based on your backend JobViewSet.get_queryset()
      if (filters.location) queryParams.set('location', filters.location);
      if (filters.remote) queryParams.set('remote', 'true');
      if (filters.job_type) queryParams.set('type', filters.job_type);
      if (filters.experience_level) queryParams.set('experience', filters.experience_level);
      if (filters.min_salary) queryParams.set('min_salary', filters.min_salary);
      if (filters.max_salary) queryParams.set('max_salary', filters.max_salary);
      if (filters.education_level) queryParams.set('education_level', filters.education_level);
      if (filters.posted_within) queryParams.set('days', filters.posted_within);
      if (filters.skills && filters.skills.length > 0) {
        queryParams.set('skills', filters.skills.join(','));
      }
      if (filters.company) queryParams.set('company', filters.company);
      if (filters.category) queryParams.set('category', filters.category);
      
      // Add pagination
      queryParams.set('page', page.toString());
      queryParams.set('page_size', '12'); // Override default page size of 10
      
      const endpoint = '/jobs/';
      const url = `${endpoint}?${queryParams.toString()}`;
      
      
      const response = await publicAxios.get(url, {
        cancelToken: cancelToken.token
      });
      
      // Clear the current request ref since this one completed
      currentRequestRef.current = null;
      
      const jobsData = response.data.results || response.data || [];
      const count = response.data.count || jobsData.length;
      const totalPages = response.data.total_pages || Math.ceil(count / 12);
      
      setJobs(jobsData);
      setPagination({
        count,
        currentPage: response.data.current_page || page,
        totalPages,
        pageSize: response.data.page_size || 12,
        next: response.data.next,
        previous: response.data.previous
      });
      
      setLoading(false);
      return jobsData;
    } catch (err) {
      // Clear the current request ref
      currentRequestRef.current = null;
      
      // Don't show error for cancelled requests
      if (axios.isCancel(err)) {
        return [];
      }
      

      setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
      setLoading(false);
      return [];
    }
  }, []);

  // Fetch single job by ID
  const fetchJobById = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await publicAxios.get(`/jobs/${jobId}/`);
      const jobData = response.data;
      
      setCurrentJob(jobData);
      setLoading(false);
      
      return jobData;
    } catch (err) {
      console.error(`Error fetching job ${jobId}:`, err);
      setError(err.response?.data?.message || err.message || 'Job not found');
      setLoading(false);
      return null;
    }
  }, []);

  // Get related jobs
  const fetchRelatedJobs = useCallback(async (jobId, limit = 4) => {
    try {
      const response = await publicAxios.get(`/jobs/${jobId}/similar/?limit=${limit}`);
      return response.data.results || response.data || [];
    } catch (err) {
      console.error('Error fetching related jobs:', err);
      return [];
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    jobs,
    currentJob,
    loading,
    error,
    pagination,
    fetchJobs,
    fetchJobById,
    fetchRelatedJobs,
    clearError
  };
}