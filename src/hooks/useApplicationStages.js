// src/hooks/useApplicationStages.js
import { useState, useCallback, useEffect } from 'react';
import { useStore } from './useZustandStore';

export function useApplicationStages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get company from store
  const { company } = useStore(state => ({
    company: state.company
  }));

  // Default stages that map to application statuses
  const DEFAULT_STAGES = [
    { 
      name: 'Applied', 
      description: 'Application received', 
      status: 'pending',
      display_order: 1, 
      is_active: true 
    },
    { 
      name: 'Screening', 
      description: 'Initial review and screening', 
      status: 'reviewing',
      display_order: 2, 
      is_active: true 
    },
    { 
      name: 'Interview', 
      description: 'Interview stage', 
      status: 'interview',
      display_order: 3, 
      is_active: true 
    },
    { 
      name: 'Offer', 
      description: 'Job offer extended', 
      status: 'offer',
      display_order: 4, 
      is_active: true 
    },
    { 
      name: 'Hired', 
      description: 'Candidate hired', 
      status: 'hired',
      display_order: 5, 
      is_active: true 
    },
    { 
      name: 'Rejected', 
      description: 'Application rejected', 
      status: 'rejected',
      display_order: 6, 
      is_active: true 
    }
  ];

  // Use default stages since API endpoints are not available
  const fetchStages = useCallback(() => {
    setLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
      setStages(DEFAULT_STAGES);
      setLoading(false);
    }, 100);
    
    return Promise.resolve(DEFAULT_STAGES);
  }, []);

  // Get stage by status (since we're using default stages)
  const getStageByStatus = useCallback((status) => {
    return DEFAULT_STAGES.find(stage => stage.status === status);
  }, []);

  // Get active stages only
  const getActiveStages = useCallback(() => {
    return DEFAULT_STAGES.filter(stage => stage.is_active);
  }, []);

  // Get stage name by status
  const getStageNameByStatus = useCallback((status) => {
    const stage = getStageByStatus(status);
    return stage ? stage.name : status;
  }, [getStageByStatus]);

  // Get stage description by status
  const getStageDescriptionByStatus = useCallback((status) => {
    const stage = getStageByStatus(status);
    return stage ? stage.description : '';
  }, [getStageByStatus]);

  // Load stages on mount
  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stages: DEFAULT_STAGES, // Always return default stages
    loading,
    error,
    fetchStages,
    getStageByStatus,
    getActiveStages,
    getStageNameByStatus,
    getStageDescriptionByStatus,
    clearError
  };
}