// src/hooks/useApplications.js 
import { useState, useCallback } from 'react';
import { useStore } from './useZustandStore';
import useAuthAxios from './useAuthAxios';

export function useApplications() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Add this missing state
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    next: null,
    previous: null
  });

  // Get store state and actions
  const {
    applications,
    currentApplication,
    setApplications,
    setCurrentApplication,
  } = useStore(state => ({
    applications: Array.isArray(state.applications) ? state.applications : [],
    currentApplication: state.currentApplication,
    setApplications: state.setApplications,
    setCurrentApplication: state.setCurrentApplication,
  }));

  // Submit job application
  const submitApplication = useCallback(async (jobId, applicationData) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    setLoading(true);
    setError(null);
    setFieldErrors({}); // Clear previous field errors

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('job', jobId);

      // Handle different field types
      Object.entries(applicationData).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return; // Skip null/undefined values
        }

        if (value instanceof File) {
          // File upload
          formData.append(key, value);
        } else if (key === 'answers' && typeof value === 'object') {
          // JSON data for answers
          formData.append(key, JSON.stringify(value));
        } else {
          // Regular form fields
          formData.append(key, value.toString());
        }
      });

      const response = await axios.post(`${API_URL}/applications/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newApplication = response.data;
      
      // Update applications list
      setApplications(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [newApplication, ...prevArray];
      });
      setCurrentApplication(newApplication);
      
      setLoading(false);
      return newApplication;
    } catch (err) {
      console.error('Error submitting application:', err);
      
      // Handle different error response formats
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check if it's field validation errors
        if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          // This is likely field validation errors
          setFieldErrors(errorData);
          setError('Please fix the errors below and try again.');
        } else {
          // General error message
          const errorMessage = errorData.detail || errorData.message || errorData.name || 'Failed to submit application';
          setError(errorMessage);
          setFieldErrors({});
        }
      } else {
        setError(err.message || 'Failed to submit application');
        setFieldErrors({});
      }
      
      setLoading(false);
      throw err;
    }
  }, [axios, setApplications, setCurrentApplication]);

  // Fetch applications with filters
  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // Add pagination
      queryParams.set('page', filters.page || pagination.page);
      queryParams.set('page_size', filters.page_size || pagination.pageSize);

      const response = await axios.get(`${API_URL}/applications/?${queryParams}`);
      const results = response.data.results || response.data || [];
      const resultsArray = Array.isArray(results) ? results : [];
      const totalCount = response.data.count || resultsArray.length;
      const totalPages = response.data.total_pages || Math.ceil(totalCount / pagination.pageSize);

      setApplications(resultsArray);
      setPagination({
        page: response.data.current_page || 1,
        pageSize: response.data.page_size || pagination.pageSize,
        totalPages,
        totalCount,
        next: response.data.next,
        previous: response.data.previous
      });

      setLoading(false);
      return resultsArray;
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
      setLoading(false);
      return [];
    }
  }, [axios, pagination.page, pagination.pageSize, setApplications]);

  // Fetch job questions
  const fetchJobQuestions = useCallback(async (jobId) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/jobs/${jobId}/questions/`);
      return response.data.results || response.data || [];
    } catch (err) {
      console.error('Error fetching job questions:', err);
      // Don't set error state for questions as they're optional
      return [];
    }
  }, [axios]);

  const withdrawApplication = useCallback(async (applicationId) => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
  
    setLoading(true);
    setError(null);
    setFieldErrors({});
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      const response = await axios.post(`${API_URL}/applications/${applicationId}/withdraw/`);
      
      // Update application in the list immediately
      setApplications(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(app => 
          app.id === applicationId ? { ...app, status: 'withdrawn' } : app
        );
      });
      
      // Update current application if it's the one being withdrawn
      if (currentApplication?.id === applicationId) {
        setCurrentApplication(prev => ({ ...prev, status: 'withdrawn' }));
      }
      
      setLoading(false);
      return { success: true, message: 'Application withdrawn successfully' };
    } catch (err) {
      console.error('Error withdrawing application:', err);
      
      // Check if the error is about already being withdrawn
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to withdraw application';
      
      // If it says already withdrawn, treat it as success
      if (errorMessage.toLowerCase().includes('already') && 
          errorMessage.toLowerCase().includes('withdrawn')) {
        
        // Update the UI to show withdrawn status
        setApplications(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return prevArray.map(app => 
            app.id === applicationId ? { ...app, status: 'withdrawn' } : app
          );
        });
        
        if (currentApplication?.id === applicationId) {
          setCurrentApplication(prev => ({ ...prev, status: 'withdrawn' }));
        }
        
        setLoading(false);
        return { success: true, message: 'Application was already withdrawn' };
      }
      
      // For 500 errors, check if withdrawal might have succeeded
      if (err.response?.status === 500) {
        // Wait a moment then check the current status
        setTimeout(async () => {
          try {
            const checkResponse = await axios.get(`${API_URL}/applications/${applicationId}/`);
            if (checkResponse.data.status === 'withdrawn') {
              // It actually succeeded, update the UI
              setApplications(prev => {
                const prevArray = Array.isArray(prev) ? prev : [];
                return prevArray.map(app => 
                  app.id === applicationId ? { ...app, status: 'withdrawn' } : app
                );
              });
              
              if (currentApplication?.id === applicationId) {
                setCurrentApplication(prev => ({ ...prev, status: 'withdrawn' }));
              }
            }
          } catch (checkErr) {
            console.error('Error checking application status:', checkErr);
          }
        }, 1000);
        
        setLoading(false);
        return { 
          success: false, 
          message: 'There was a server error, but your application may have been withdrawn. Please refresh to check the status.' 
        };
      }
      
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  }, [axios, currentApplication, setCurrentApplication, setApplications]);

  // Fetch applications for a specific job
  const fetchJobApplications = useCallback(async (jobId, filters = {}) => {
    if (!jobId) {
      setError('Job ID is required');
      return [];
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Build query parameters
      const queryParams = new URLSearchParams(filters);
      
      // Add pagination
      queryParams.set('page', filters.page || pagination.page);
      queryParams.set('page_size', filters.page_size || pagination.pageSize);

      const response = await axios.get(`${API_URL}/applications/job/${jobId}/?${queryParams}`);
      const results = response.data.results || response.data || [];
      const resultsArray = Array.isArray(results) ? results : [];
      const totalCount = response.data.count || resultsArray.length;
      const totalPages = response.data.total_pages || Math.ceil(totalCount / pagination.pageSize);

      setApplications(resultsArray);
      setPagination({
        page: response.data.current_page || 1,
        pageSize: response.data.page_size || pagination.pageSize,
        totalPages,
        totalCount,
        next: response.data.next,
        previous: response.data.previous
      });

      setLoading(false);
      return resultsArray;
    } catch (err) {
      console.error('Error fetching job applications:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch job applications');
      setLoading(false);
      return [];
    }
  }, [axios, pagination.page, pagination.pageSize, setApplications]);

  // Fetch single application by ID
  const fetchApplicationById = useCallback(async (applicationId) => {
    if (!applicationId) {
      setError('Application ID is required');
      return null;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/applications/${applicationId}/`);
      
      setCurrentApplication(response.data);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch application');
      setLoading(false);
      return null;
    }
  }, [axios, setCurrentApplication]);

  // Update application status
  const updateApplicationStatus = useCallback(async (applicationId, updateData) => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
  
    setLoading(true);
    setError(null);
    setFieldErrors({});
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Handle different input formats
      let requestBody;
      
      if (typeof updateData === 'string') {
        requestBody = { status: updateData };
      } else if (typeof updateData === 'object' && updateData !== null) {
        requestBody = { ...updateData };
      } else {
        throw new Error('Invalid update data format');
      }
      
      const response = await axios.patch(`${API_URL}/applications/${applicationId}/status/`, requestBody);
      
      const updatedApplication = response.data;
      
      // Update current application if it's the one being updated
      if (currentApplication?.id === applicationId) {
        setCurrentApplication(updatedApplication);
      }
      
      // Update application in the list
      setApplications(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(app => 
          app.id === applicationId ? updatedApplication : app
        );
      });
      
      setLoading(false);
      return updatedApplication;
    } catch (err) {
      console.error('Error updating application status:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to update application status';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [axios, currentApplication, setCurrentApplication, setApplications]);

  // Set pagination page
  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Set pagination page size
  const setPageSize = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 })); // Reset to page 1 when changing page size
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({}); // Also clear field errors
  }, []);

  // Submit external application
  const submitExternalApplication = useCallback(async (jobId, options = {}) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      const requestData = {
        application_method: options.application_method || 'external_url'
      };
      
      const response = await axios.post(`${API_URL}/applications/external/${jobId}/`, requestData);
      
      if (response.data?.success) {
        setLoading(false);
        return response.data.data;
      } else {
        setLoading(false);
        return response.data;
      }
    } catch (err) {
      console.error('Error submitting external application:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to track external application';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [axios]);

  return {
    // State
    applications,
    currentApplication,
    pagination,
    loading,
    error,
    fieldErrors, // Make sure to return fieldErrors
    
    // Actions
    submitApplication,
    submitExternalApplication,
    fetchApplications,
    fetchJobApplications,
    fetchApplicationById,
    fetchJobQuestions,
    updateApplicationStatus,
    withdrawApplication,
    setPage,
    setPageSize,
    clearError
  };
}