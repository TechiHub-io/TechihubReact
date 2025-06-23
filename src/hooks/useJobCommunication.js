// src/hooks/useJobCommunication.js 
import { useState, useCallback } from 'react';
import useAuthAxios from './useAuthAxios';

export function useJobCommunication() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get job details to get company info
  const getJobDetails = useCallback(async (jobId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw new Error('Could not load job details');
    }
  }, [axios]);

  // Get company details to find employer user ID
  const getCompanyEmployer = useCallback(async (companyId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/companies/${companyId}/`);
      return response.data.user; // This contains the employer's user info
    } catch (error) {
      console.error('Error fetching company employer:', error);
      throw new Error('Could not find employer contact information');
    }
  }, [axios]);

  // Create job inquiry conversation - FIXED VERSION
  const createJobInquiry = useCallback(async ({ jobId, subject, message, jobDetails = null }) => {
    setLoading(true);
    setError(null);

    try {
      // Get job details if not provided
      const job = jobDetails || await getJobDetails(jobId);
      
      if (!job.company || !job.company.id) {
        throw new Error('Job company information not available');
      }

      // Get the employer user ID from company details
      const employerUser = await getCompanyEmployer(job.company.id);
      
      // Create conversation data according to API spec
      const conversationData = {
        participant_ids: [employerUser.id], // Array of user IDs
        job: jobId, // Job UUID
        conversation_type: "job_inquiry", // Enum value
        subject: subject, // String with maxLength 255
        initial_message: message // This handles the first message
      };


      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/conversations/`, conversationData);
      
      
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error creating job inquiry:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to send message';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [axios, getJobDetails, getCompanyEmployer]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createJobInquiry,
    getJobDetails,
    loading,
    error,
    clearError
  };
}