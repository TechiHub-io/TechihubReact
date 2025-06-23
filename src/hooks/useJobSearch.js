// src/hooks/useJobSearch.js - Fixed API endpoint usage
import { useState, useCallback, useEffect } from 'react';
import useAuthAxios from './useAuthAxios';
import { useDebounce } from './useDebounce';

export function useJobSearch() {
  const axios = useAuthAxios();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    remote: false,
    job_type: '',
    experience_level: '',
    min_salary: '',
    max_salary: '',
    skills: [], // Array of strings: ['React', 'JavaScript']
    posted_within: '',
    education_level: ''
  });
  
  // Results state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    next: null,
    previous: null
  });

  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 3000); // 3 sec for search
  const debouncedFilters = useDebounce(filters, 1000); // 1 sec for filters

  // Main search function
  const searchJobs = useCallback(async (searchParams = {}, page = 1, isManualSearch = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use single endpoint /jobs/ with search parameter
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const endpoint = `${API_URL}/jobs/`;
      
      // Determine search query
      const query = searchParams.q || (isManualSearch ? searchQuery : debouncedSearchQuery);
      const currentFilters = { ...debouncedFilters, ...searchParams };
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add search query using 'search' parameter (not 'q')
      if (query) {
        queryParams.set('search', query);
      }
      
      // Add filters
      if (currentFilters.location) queryParams.set('location', currentFilters.location);
      if (currentFilters.remote) queryParams.set('remote', 'true');
      if (currentFilters.job_type) queryParams.set('job_type', currentFilters.job_type);
      if (currentFilters.experience_level) queryParams.set('experience_level', currentFilters.experience_level);
      if (currentFilters.min_salary) queryParams.set('min_salary', currentFilters.min_salary);
      if (currentFilters.max_salary) queryParams.set('max_salary', currentFilters.max_salary);
      if (currentFilters.education_level) queryParams.set('education_level', currentFilters.education_level);
      if (currentFilters.posted_within) queryParams.set('posted_within', currentFilters.posted_within);
      
      // Add skills as comma-separated string
      if (currentFilters.skills && currentFilters.skills.length > 0) {
        queryParams.set('skills', currentFilters.skills.join(','));
      }
      
      // Add pagination
      queryParams.set('page', page.toString());
      queryParams.set('page_size', pagination.pageSize.toString());
      
      
      const response = await axios.get(`${endpoint}?${queryParams}`);
      
      // Handle response based on API structure
      const jobsData = response.data.results || response.data || [];
      const count = response.data.count || jobsData.length;
      const totalPages = response.data.total_pages || Math.ceil(count / pagination.pageSize);
      
      setJobs(jobsData);
      setPagination({
        count,
        currentPage: response.data.current_page || page,
        totalPages,
        pageSize: response.data.page_size || pagination.pageSize,
        next: response.data.next,
        previous: response.data.previous
      });
      
      setLoading(false);
      return jobsData;
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search jobs');
      setLoading(false);
      return [];
    }
  }, [axios, debouncedSearchQuery, debouncedFilters, pagination.pageSize, searchQuery]);

  // Manual search (immediate, no debounce)
  const performSearch = useCallback(() => {
    searchJobs({}, 1, true);
  }, [searchJobs]);

  // Update search query
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Add skill to filters
  const addSkill = useCallback((skill) => {
    setFilters(prev => ({
      ...prev,
      skills: [...prev.skills, skill].filter((s, index, arr) => arr.indexOf(s) === index) // Remove duplicates
    }));
  }, []);

  // Remove skill from filters
  const removeSkill = useCallback((skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  }, []);

  // Update page size
  const updatePageSize = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
  }, []);

  // Go to specific page
  const goToPage = useCallback((page) => {
    searchJobs({}, page);
  }, [searchJobs]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      location: '',
      remote: false,
      job_type: '',
      experience_level: '',
      min_salary: '',
      max_salary: '',
      skills: [],
      posted_within: '',
      education_level: ''
    });
    setSearchQuery('');
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-search effects
  useEffect(() => {
    // Auto-search when debounced query changes
    if (debouncedSearchQuery !== searchQuery) {
      searchJobs({}, 1);
    }
  }, [debouncedSearchQuery, searchJobs, searchQuery]);

  useEffect(() => {
    // Auto-search when filters change
    searchJobs({}, 1);
  }, [debouncedFilters]);

  // Initial load
  useEffect(() => {
    searchJobs({}, 1);
  }, []); // Empty dependency for initial load only

  return {
    // Search state
    searchQuery,
    filters,
    
    // Results
    jobs,
    loading,
    error,
    
    // Pagination
    pagination,
    
    // Actions
    searchJobs,
    performSearch, // Manual search
    updateSearchQuery,
    updateFilters,
    addSkill,
    removeSkill,
    updatePageSize,
    goToPage,
    clearFilters,
    clearError
  };
}