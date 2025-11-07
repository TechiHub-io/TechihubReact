// src/hooks/useAdminJobs.js
import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { APPLICATION_METHODS } from '@/components/admin/ApplicationMethodSelector';

/**
 * Custom hook for admin job operations
 * Handles job creation, updating, and management with admin context
 */
export function useAdminJobs() {
  const { isAdmin, hasCompanyAccess } = useAdminAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Transform form data to API format
  const transformFormDataToAPI = useCallback((formData) => {
    // Transform skills array to the format expected by backend
    const transformedSkills = (formData.skills || []).map(skill => {
      if (typeof skill === 'string') {
        return {
          skill: skill,
          is_required: true // Default to required
        };
      } else if (skill && typeof skill === 'object') {
        return {
          skill: skill.skill || skill.name || skill,
          is_required: skill.is_required !== undefined ? skill.is_required : true
        };
      }
      return {
        skill: String(skill),
        is_required: true
      };
    });

    const apiData = {
      // Basic job fields
      title: formData.title,
      description: formData.description || '',
      responsibilities: formData.responsibilities || '',
      requirements: formData.requirements || '',
      benefits: formData.benefits || '',
      location: formData.location || '',
      is_remote: formData.is_remote || false,
      is_hybrid: formData.is_hybrid || false,
      category: formData.category,
      job_type: formData.job_type,
      education_level: formData.education_level,
      experience_level: formData.experience_level,
      min_salary: formData.min_salary ? Number(formData.min_salary) : null,
      max_salary: formData.max_salary ? Number(formData.max_salary) : null,
      salary_currency: formData.salary_currency || 'USD',
      is_salary_visible: formData.is_salary_visible || false,
      application_deadline: formData.application_deadline || null,
      
      // Skills in the format expected by backend
      required_skills: transformedSkills,
      
      // Admin-specific fields
      company_id: formData.companyId,
      
      // Application method fields
      use_internal_application: formData.applicationMethods?.includes(APPLICATION_METHODS.INTERNAL) || false,
      application_url: formData.applicationMethods?.includes(APPLICATION_METHODS.EXTERNAL_URL) ? formData.applicationUrl || '' : '',
      application_email: formData.applicationMethods?.includes(APPLICATION_METHODS.EMAIL) ? formData.applicationEmail || '' : '',
      application_instructions: formData.application_instructions || ''
    };

    // Remove null/undefined values to avoid backend validation issues
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === null || apiData[key] === undefined) {
        delete apiData[key];
      }
    });

    return apiData;
  }, []);

  // Create admin job
  const createAdminJob = useCallback(async (formData) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to create jobs for companies');
    }

    if (!formData.companyId) {
      throw new Error('Company selection is required');
    }

    if (!hasCompanyAccess(formData.companyId)) {
      throw new Error('You do not have access to the selected company');
    }

    setLoading(true);
    setError(null);

    try {
      const apiData = transformFormDataToAPI(formData);
      

      
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = await jobsApi.createAdminJob(apiData);
      
      const newJob = response.data;
      setLoading(false);
      
      return newJob;
    } catch (error) {
      console.error('Error creating admin job:', error);
      
      let errorMessage = 'Failed to create job';
      
      if (error.response?.status === 400) {
        // Handle validation errors
        const validationErrors = error.response?.data;

        
        if (validationErrors && typeof validationErrors === 'object') {
          const errorMessages = [];
          Object.entries(validationErrors).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            } else {
              errorMessages.push(`${field}: ${JSON.stringify(errors)}`);
            }
          });
          errorMessage = errorMessages.length > 0 ? errorMessages.join('; ') : 'Validation failed';
        } else {
          errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Invalid data provided';
        }
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin permissions required.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Job creation endpoint not found.';
      } else {
        errorMessage = error.response?.data?.detail || 
                      error.response?.data?.message || 
                      error.message || 
                      'Failed to create job';
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [isAdmin, hasCompanyAccess, transformFormDataToAPI]);

  // Update admin job
  const updateAdminJob = useCallback(async (jobId, formData) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to update jobs');
    }

    if (!jobId) {
      throw new Error('Job ID is required for updating');
    }

    if (!formData.companyId) {
      throw new Error('Company selection is required');
    }

    if (!hasCompanyAccess(formData.companyId)) {
      throw new Error('You do not have access to the selected company');
    }

    setLoading(true);
    setError(null);

    try {
      const apiData = transformFormDataToAPI(formData);
      
      console.log('🔄 Updating job with data:', apiData);
      
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = await jobsApi.updateAdminJob(jobId, apiData);
      
      const updatedJob = response.data;
      setLoading(false);
      
      return updatedJob;
    } catch (error) {
      console.error('Error updating admin job:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update job';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [isAdmin, hasCompanyAccess, transformFormDataToAPI]);

  // Fetch admin jobs (jobs posted by admin across all accessible companies)
  const fetchAdminJobs = useCallback(async (filters = {}) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to fetch admin jobs');
    }

    setLoading(true);
    setError(null);

    try {
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = await jobsApi.getAdminPostedJobs({
        ...filters,
        posted_by_admin: 'true' // Filter for admin-posted jobs
      });
      
      const jobsData = response.data?.results || response.data;
      setLoading(false);
      
      return jobsData;
    } catch (error) {
      console.error('Error fetching admin jobs:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch admin jobs';
      setError(errorMessage);
      setLoading(false);
      return [];
    }
  }, [isAdmin]);

  // Delete admin job
  const deleteAdminJob = useCallback(async (jobId) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to delete jobs');
    }

    if (!jobId) {
      throw new Error('Job ID is required for deletion');
    }

    setLoading(true);
    setError(null);

    try {
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      await jobsApi.deleteJob(jobId);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error deleting admin job:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to delete job';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [isAdmin]);

  // Toggle admin job status
  const toggleAdminJobStatus = useCallback(async (jobId, isActive) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to toggle job status');
    }

    if (!jobId) {
      throw new Error('Job ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = isActive ? 
        await jobsApi.activateJob(jobId) : 
        await jobsApi.deactivateJob(jobId);
      
      const updatedJob = response.data;
      setLoading(false);
      
      return updatedJob;
    } catch (error) {
      console.error('Error toggling admin job status:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update job status';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [isAdmin]);

  // Fetch single admin job by ID
  const fetchAdminJobById = useCallback(async (jobId) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required to fetch job details');
    }

    if (!jobId) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = await jobsApi.getJobById(jobId);
      
      const jobData = response.data;
      setLoading(false);
      
      return jobData;
    } catch (error) {
      console.error('Error fetching admin job:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch job details';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, [isAdmin]);

  // Bulk operations for admin jobs
  const bulkUpdateAdminJobs = useCallback(async (jobIds, updateData) => {
    if (!isAdmin) {
      throw new Error('Admin privileges required for bulk operations');
    }

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      throw new Error('Job IDs array is required');
    }

    setLoading(true);
    setError(null);

    try {
      // Import the API function to use the centralized endpoint
      const { jobsApi } = await import('@/lib/api/jobs');
      const response = await jobsApi.bulkUpdateJobs({
        job_ids: jobIds,
        update_data: updateData
      });
      
      const updatedJobs = response.data;
      setLoading(false);
      
      return updatedJobs;
    } catch (error) {
      console.error('Error bulk updating admin jobs:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to bulk update jobs';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [isAdmin]);

  return {
    // State
    loading,
    error,
    
    // Actions
    createAdminJob,
    updateAdminJob,
    fetchAdminJobs,
    fetchAdminJobById,
    deleteAdminJob,
    toggleAdminJobStatus,
    bulkUpdateAdminJobs,
    
    // Utilities
    clearError,
    transformFormDataToAPI,
    
    // Admin status
    isAdmin
  };
}

export default useAdminJobs;