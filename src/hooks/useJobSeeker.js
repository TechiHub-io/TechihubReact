// src/hooks/useJobSeeker.js
import { useState, useCallback } from 'react';
import { useStore } from './useZustandStore';
import useAuthAxios from './useAuthAxios';

import { useProfileStrength } from './useProfileStrength';

export function useJobSeeker() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const { profileStrength } = useProfileStrength();
  const [error, setError] = useState(null);
  
  // Get profile data from store
  const { 
    profile,
    applications,
    savedJobs,
    setApplications,
    setSavedJobs,
  } = useStore(state => ({
    profile: state.profile,
    applications: state.applications || [],
    savedJobs: state.savedJobs || [],
    setApplications: state.setApplications,
    setSavedJobs: state.setSavedJobs,
  }));

  const [dashboardData, setDashboardData] = useState({
    recommendedJobs: [],
    stats: {
      totalApplications: 0,
      savedJobs: 0,
      profileViews: 0,
      profileStrength: 0
    }
  });
  
  
  // State for job seeker dashboard
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    interviews: 0,
    profileViews: 0,
    savedJobs: 0
  });
  
  /**
   * Fetch all dashboard data for job seeker
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Fetch data in parallel
      const promises = [];
      
      // 1. Applications
      promises.push(
        axios.get(`${API_URL}/applications/?limit=10`)
          .catch(err => ({ data: { results: [], count: 0 } }))
      );
      
      // 2. Saved jobs
      promises.push(
        axios.get(`${API_URL}/favorites/jobs/`)
          .catch(err => ({ data: { results: [], count: 0 } }))
      );
      
      // 3. Recommended jobs (try both endpoints)
      promises.push(
        axios.get(`${API_URL}/jobs/recommended/`)
          .catch(() => axios.get(`${API_URL}/jobs/?limit=5`))
          .catch(err => ({ data: { results: [] } }))
      );
      
      // 4. Profile stats (if exists)
      promises.push(
        axios.get(`${API_URL}/profiles/me/stats/`)
          .catch(err => ({ data: {} }))
      );

      const [applicationsRes, savedJobsRes, recommendedRes, statsRes] = await Promise.all(promises);
      
      // Update store state
      const applicationsData = applicationsRes.data.results || applicationsRes.data || [];
      const savedJobsData = savedJobsRes.data.results || savedJobsRes.data || [];
      const recommendedJobs = recommendedRes.data.results || recommendedRes.data || [];
      
      if (setApplications) setApplications(applicationsData);
      if (setSavedJobs) setSavedJobs(savedJobsData);
      
      // Calculate stats
      const stats = {
        totalApplications: applicationsRes.data.count || applicationsData.length || 0,
        savedJobs: savedJobsRes.data.count || savedJobsData.length || 0,
        profileViews: statsRes.data.profile_views || 0,
        profileStrength: profileStrength || profile?.profile_strength || 0
      };
      
      setDashboardData({
        recommendedJobs,
        stats
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message || 'Failed to load dashboard data');
      setLoading(false);
      return false;
    }
  }, [axios, setApplications, setSavedJobs, profile?.profile_strength]);
  
  /**
   * Fetch all applications for the current user
   */
  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.append(key, value);
      });
      
      const response = await axios.get(`/api/v1/applications/?${params.toString()}`);
      const applications = response.data.results || response.data;
      
      setApplications(applications);
      setLoading(false);
      
      return applications;
    } catch (error) {
      setError(error.message || 'Failed to fetch applications');
      setLoading(false);
      return [];
    }
  }, [axios, setApplications]);
  
  /**
   * Submit a job application
   */
  const submitApplication = useCallback(async (jobId, applicationData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('job', jobId);
      
      // Add all application data to form
      Object.entries(applicationData).forEach(([key, value]) => {
        if (key === 'resume' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'answers' && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      const response = await axios.post('/api/v1/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update applications list with new application
      setApplications(prev => [response.data, ...prev]);
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to submit application');
      setLoading(false);
      throw error;
    }
  }, [axios, setApplications]);
  
  /**
   * Withdraw a job application
   */
  const withdrawApplication = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`/api/v1/applications/${applicationId}/withdraw/`);
      
      // Update application status in list
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'withdrawn', status_display: 'Withdrawn' } 
            : app
        )
      );
      
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.message || 'Failed to withdraw application');
      setLoading(false);
      return false;
    }
  }, [axios, setApplications]);
  
  /**
   * Calculate profile completeness
   */
  const calculateProfileCompleteness = useCallback(() => {
    if (!profile) return 0;
    
    const sections = [
      !!profile.bio,                      // Basic info
      !!profile.job_title,                // Job title
      !!profile.location,                 // Location
      profile.skills?.length > 0,         // Skills
      profile.experience?.length > 0,     // Experience
      profile.education?.length > 0,      // Education
      profile.certifications?.length > 0, // Certifications
      profile.portfolio_items?.length > 0 // Portfolio
    ];
    
    // Count completed sections
    const completedSections = sections.filter(Boolean).length;
    
    // Calculate percentage
    return Math.round((completedSections / sections.length) * 100);
  }, [profile]);
  
  const clearError = useCallback(() => setError(null), []);
  
  return {
    // State
    profile,
    applications,
    savedJobs,
    recommendedJobs: dashboardData.recommendedJobs,
    stats: dashboardData.stats,
    loading,
    error,
    profileCompleteness: calculateProfileCompleteness(),
    
    // Methods
    fetchDashboardData,
    fetchApplications,
    submitApplication,
    withdrawApplication,
    calculateProfileCompleteness,
    clearError
  };
}