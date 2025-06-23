// src/hooks/useCompanyIds.js
import { useState, useCallback, useRef } from 'react';
import useAuthAxios from './useAuthAxios';

// Global cache and request batching
const companyIdCache = new Map();
const pendingRequests = new Map();

export function useCompanyIds() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);

  const getCompanyId = useCallback(async (jobId) => {
    // Check cache first
    if (companyIdCache.has(jobId)) {
      return companyIdCache.get(jobId);
    }

    // Check if request is already pending
    if (pendingRequests.has(jobId)) {
      return pendingRequests.get(jobId);
    }

    // Create new request
    const request = (async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const response = await axios.get(`${API_URL}/jobs/${jobId}/`);
        const companyId = response.data?.company?.id;
        
        if (companyId) {
          companyIdCache.set(jobId, companyId);
          return companyId;
        }
        return null;
      } catch (error) {
        console.error(`Failed to fetch company ID for job ${jobId}:`, error);
        return null;
      } finally {
        pendingRequests.delete(jobId);
      }
    })();

    pendingRequests.set(jobId, request);
    return request;
  }, [axios]);

  // Batch fetch multiple company IDs
  const getCompanyIds = useCallback(async (jobIds) => {
    setLoading(true);
    try {
      const promises = jobIds.map(jobId => getCompanyId(jobId));
      const results = await Promise.all(promises);
      
      const companyIdMap = {};
      jobIds.forEach((jobId, index) => {
        if (results[index]) {
          companyIdMap[jobId] = results[index];
        }
      });
      
      return companyIdMap;
    } finally {
      setLoading(false);
    }
  }, [getCompanyId]);

  return {
    getCompanyId,
    getCompanyIds,
    loading
  };
}