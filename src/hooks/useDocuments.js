// src/hooks/useDocuments.js
import { useState, useCallback, useEffect } from 'react';
import useAuthAxios from './useAuthAxios';
import { useStore } from './useZustandStore';

export function useDocuments() {
  const axios = useAuthAxios();
  const { profile } = useStore(state => ({ profile: state.profile }));
  
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [portfolioUrls, setPortfolioUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get profile ID first
  const fetchProfileId = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/user/profile-id/`);
      return response.data.profile_id;
    } catch (err) {
      console.error('Error fetching profile ID:', err);
      return null;
    }
  }, [axios]);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profileId = await fetchProfileId();
      if (!profileId) {
        setLoading(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Fetch documents in parallel
      const [resumesRes, coverLettersRes, portfolioRes] = await Promise.all([
        axios.get(`${API_URL}/profiles/${profileId}/documents/?type=resume`).catch(() => ({ data: { results: [] } })),
        axios.get(`${API_URL}/profiles/${profileId}/documents/?type=cover_letter`).catch(() => ({ data: { results: [] } })),
        axios.get(`${API_URL}/profiles/${profileId}/portfolio-urls/`).catch(() => ({ data: { results: [] } }))
      ]);
      
      // Extract results from paginated responses
      setResumes(resumesRes.data?.results || []);
      setCoverLetters(coverLettersRes.data?.results || []);
      setPortfolioUrls(portfolioRes.data?.results || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to load documents');
      setLoading(false);
    }
  }, [axios, fetchProfileId]);

  // Upload new document
  const uploadDocument = useCallback(async (file, documentType, label, isDefault = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const profileId = await fetchProfileId();
      if (!profileId) {
        throw new Error('Profile ID not found');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      formData.append('label', label);
      formData.append('is_default', isDefault);

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/profiles/${profileId}/documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newDocument = response.data;
      
      // Update appropriate list
      if (documentType === 'resume') {
        setResumes(prev => [newDocument, ...prev]);
      } else if (documentType === 'cover_letter') {
        setCoverLetters(prev => [newDocument, ...prev]);
      }
      
      setLoading(false);
      return newDocument;
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload document');
      setLoading(false);
      throw err;
    }
  }, [axios, fetchProfileId]);

  // Add portfolio URL
  const addPortfolioUrl = useCallback(async (url, label, isDefault = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const profileId = await fetchProfileId();
      if (!profileId) {
        throw new Error('Profile ID not found');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/profiles/${profileId}/portfolio-urls/`, {
        url,
        label,
        is_default: isDefault
      });
      
      const newPortfolio = response.data;
      setPortfolioUrls(prev => [newPortfolio, ...prev]);
      setLoading(false);
      
      return newPortfolio;
    } catch (err) {
      console.error('Error adding portfolio URL:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add portfolio URL');
      setLoading(false);
      throw err;
    }
  }, [axios, fetchProfileId]);

  // Get default documents
  const getDefaultResume = useCallback(() => {
    return resumes.find(resume => resume.is_default) || resumes[0] || null;
  }, [resumes]);

  const getDefaultCoverLetter = useCallback(() => {
    return coverLetters.find(letter => letter.is_default) || coverLetters[0] || null;
  }, [coverLetters]);

  const getDefaultPortfolio = useCallback(() => {
    return portfolioUrls.find(portfolio => portfolio.is_default) || portfolioUrls[0] || null;
  }, [portfolioUrls]);

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    resumes,
    coverLetters,
    portfolioUrls,
    loading,
    error,
    
    // Actions
    fetchDocuments,
    uploadDocument,
    addPortfolioUrl,
    
    // Helpers
    getDefaultResume,
    getDefaultCoverLetter,
    getDefaultPortfolio,
    clearError
  };
}