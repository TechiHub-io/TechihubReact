// src/hooks/useLoadingState.js
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  LOADING_TYPES, 
  getLoadingMessage, 
  getLoadingDuration,
  LoadingStateManager,
  createDebouncedLoader
} from '@/lib/utils/loadingStates';

/**
 * Custom hook for managing loading states with debouncing and priorities
 * @param {Object} options - Configuration options
 * @returns {Object} Loading state utilities
 */
export function useLoadingState(options = {}) {
  const {
    context = '',
    debounceDelay = 300,
    autoHide = true,
    defaultType = LOADING_TYPES.FETCHING
  } = options;

  const [loadingStates, setLoadingStates] = useState(new Map());
  const [primaryLoading, setPrimaryLoading] = useState(null);
  const timeoutsRef = useRef(new Map());
  const managerRef = useRef(new LoadingStateManager());

  // Update local state when manager changes
  useEffect(() => {
    const unsubscribe = managerRef.current.addListener((allStates, primary) => {
      setLoadingStates(new Map(allStates));
      setPrimaryLoading(primary);
    });

    return unsubscribe;
  }, []);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  // Set loading state
  const setLoading = useCallback((key, type = defaultType, customContext = context) => {
    // Clear existing timeout for this key
    if (timeoutsRef.current.has(key)) {
      clearTimeout(timeoutsRef.current.get(key));
      timeoutsRef.current.delete(key);
    }

    managerRef.current.setLoading(key, type, customContext);

    // Auto-hide after estimated duration if enabled
    if (autoHide) {
      const duration = getLoadingDuration(type);
      const timeoutId = setTimeout(() => {
        managerRef.current.clearLoading(key);
        timeoutsRef.current.delete(key);
      }, duration);
      
      timeoutsRef.current.set(key, timeoutId);
    }
  }, [context, defaultType, autoHide]);

  // Clear loading state
  const clearLoading = useCallback((key) => {
    // Clear timeout if exists
    if (timeoutsRef.current.has(key)) {
      clearTimeout(timeoutsRef.current.get(key));
      timeoutsRef.current.delete(key);
    }

    managerRef.current.clearLoading(key);
  }, []);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();

    managerRef.current.clearAll();
  }, []);

  // Get loading state
  const getLoading = useCallback((key) => {
    return managerRef.current.getLoading(key);
  }, []);

  // Check if loading
  const isLoading = useCallback((key = null) => {
    if (key) {
      return managerRef.current.getLoading(key) !== null;
    }
    return managerRef.current.isLoading();
  }, []);

  // Check if specific type is loading
  const isLoadingType = useCallback((type) => {
    return managerRef.current.isLoadingType(type);
  }, []);

  // Execute function with loading state
  const withLoading = useCallback(async (key, fn, type = defaultType, customContext = context) => {
    setLoading(key, type, customContext);
    
    try {
      const result = await fn();
      return result;
    } finally {
      clearLoading(key);
    }
  }, [setLoading, clearLoading, defaultType, context]);

  // Get current loading message
  const getLoadingMessage = useCallback((key = null) => {
    const loading = key ? getLoading(key) : primaryLoading;
    return loading ? loading.message : null;
  }, [getLoading, primaryLoading]);

  // Get loading progress (if available)
  const getLoadingProgress = useCallback((key) => {
    const loading = getLoading(key);
    if (!loading) return null;

    const elapsed = Date.now() - loading.timestamp;
    const progress = Math.min(100, (elapsed / loading.duration) * 100);
    return Math.round(progress);
  }, [getLoading]);

  return {
    // State
    loadingStates,
    primaryLoading,
    isLoading: managerRef.current.isLoading(),
    
    // Actions
    setLoading,
    clearLoading,
    clearAllLoading,
    withLoading,
    
    // Queries
    getLoading,
    isLoading: isLoading,
    isLoadingType,
    getLoadingMessage,
    getLoadingProgress,
    
    // Computed properties
    hasLoading: loadingStates.size > 0,
    loadingCount: loadingStates.size,
    primaryLoadingType: primaryLoading?.type || null,
    primaryLoadingMessage: primaryLoading?.message || null
  };
}

/**
 * Hook for form loading states
 * @param {Object} options - Configuration options
 * @returns {Object} Form-specific loading utilities
 */
export function useFormLoadingState(options = {}) {
  const baseLoading = useLoadingState({
    context: 'form',
    ...options
  });

  // Form-specific loading states
  const setSubmitting = useCallback((isSubmitting) => {
    if (isSubmitting) {
      baseLoading.setLoading('submit', LOADING_TYPES.SUBMITTING);
    } else {
      baseLoading.clearLoading('submit');
    }
  }, [baseLoading]);

  const setValidating = useCallback((isValidating) => {
    if (isValidating) {
      baseLoading.setLoading('validate', LOADING_TYPES.FETCHING, 'validation');
    } else {
      baseLoading.clearLoading('validate');
    }
  }, [baseLoading]);

  const setFieldLoading = useCallback((fieldName, isLoading) => {
    if (isLoading) {
      baseLoading.setLoading(`field_${fieldName}`, LOADING_TYPES.FETCHING, 'field');
    } else {
      baseLoading.clearLoading(`field_${fieldName}`);
    }
  }, [baseLoading]);

  return {
    ...baseLoading,
    
    // Form-specific actions
    setSubmitting,
    setValidating,
    setFieldLoading,
    
    // Form-specific queries
    isSubmitting: baseLoading.isLoading('submit'),
    isValidating: baseLoading.isLoading('validate'),
    isFieldLoading: (fieldName) => baseLoading.isLoading(`field_${fieldName}`),
    
    // Form state helpers
    canSubmit: !baseLoading.isLoadingType(LOADING_TYPES.SUBMITTING),
    canEdit: !baseLoading.isLoadingType(LOADING_TYPES.SUBMITTING) && !baseLoading.isLoadingType(LOADING_TYPES.UPDATING)
  };
}

/**
 * Hook for data fetching loading states
 * @param {Object} options - Configuration options
 * @returns {Object} Data fetching loading utilities
 */
export function useDataLoadingState(options = {}) {
  const baseLoading = useLoadingState({
    context: 'data',
    ...options
  });

  // Data-specific loading states
  const setInitialLoading = useCallback((isLoading) => {
    if (isLoading) {
      baseLoading.setLoading('initial', LOADING_TYPES.INITIAL);
    } else {
      baseLoading.clearLoading('initial');
    }
  }, [baseLoading]);

  const setRefreshing = useCallback((isRefreshing) => {
    if (isRefreshing) {
      baseLoading.setLoading('refresh', LOADING_TYPES.REFRESHING);
    } else {
      baseLoading.clearLoading('refresh');
    }
  }, [baseLoading]);

  const setFetching = useCallback((key, isFetching) => {
    if (isFetching) {
      baseLoading.setLoading(key, LOADING_TYPES.FETCHING);
    } else {
      baseLoading.clearLoading(key);
    }
  }, [baseLoading]);

  const setPaginating = useCallback((isPaginating) => {
    if (isPaginating) {
      baseLoading.setLoading('paginate', LOADING_TYPES.FETCHING, 'pagination');
    } else {
      baseLoading.clearLoading('paginate');
    }
  }, [baseLoading]);

  return {
    ...baseLoading,
    
    // Data-specific actions
    setInitialLoading,
    setRefreshing,
    setFetching,
    setPaginating,
    
    // Data-specific queries
    isInitialLoading: baseLoading.isLoading('initial'),
    isRefreshing: baseLoading.isLoading('refresh'),
    isPaginating: baseLoading.isLoading('paginate'),
    
    // Data state helpers
    showSkeleton: baseLoading.isLoading('initial'),
    showRefreshIndicator: baseLoading.isLoading('refresh'),
    showPaginationLoader: baseLoading.isLoading('paginate')
  };
}

/**
 * Hook for admin job operations loading states
 * @param {Object} options - Configuration options
 * @returns {Object} Admin job loading utilities
 */
export function useAdminJobLoadingState(options = {}) {
  const baseLoading = useLoadingState({
    context: 'admin_jobs',
    ...options
  });

  // Admin job specific loading states
  const setJobCreating = useCallback((isCreating) => {
    if (isCreating) {
      baseLoading.setLoading('job_create', LOADING_TYPES.SUBMITTING, 'job_creation');
    } else {
      baseLoading.clearLoading('job_create');
    }
  }, [baseLoading]);

  const setJobUpdating = useCallback((jobId, isUpdating) => {
    if (isUpdating) {
      baseLoading.setLoading(`job_update_${jobId}`, LOADING_TYPES.UPDATING, 'job_update');
    } else {
      baseLoading.clearLoading(`job_update_${jobId}`);
    }
  }, [baseLoading]);

  const setJobDeleting = useCallback((jobId, isDeleting) => {
    if (isDeleting) {
      baseLoading.setLoading(`job_delete_${jobId}`, LOADING_TYPES.DELETING, 'job_delete');
    } else {
      baseLoading.clearLoading(`job_delete_${jobId}`);
    }
  }, [baseLoading]);

  const setCompaniesLoading = useCallback((isLoading) => {
    if (isLoading) {
      baseLoading.setLoading('companies', LOADING_TYPES.FETCHING, 'company_selection');
    } else {
      baseLoading.clearLoading('companies');
    }
  }, [baseLoading]);

  const setJobsLoading = useCallback((isLoading) => {
    if (isLoading) {
      baseLoading.setLoading('jobs', LOADING_TYPES.FETCHING, 'job_management');
    } else {
      baseLoading.clearLoading('jobs');
    }
  }, [baseLoading]);

  return {
    ...baseLoading,
    
    // Admin job specific actions
    setJobCreating,
    setJobUpdating,
    setJobDeleting,
    setCompaniesLoading,
    setJobsLoading,
    
    // Admin job specific queries
    isJobCreating: baseLoading.isLoading('job_create'),
    isJobUpdating: (jobId) => baseLoading.isLoading(`job_update_${jobId}`),
    isJobDeleting: (jobId) => baseLoading.isLoading(`job_delete_${jobId}`),
    isCompaniesLoading: baseLoading.isLoading('companies'),
    isJobsLoading: baseLoading.isLoading('jobs'),
    
    // Admin job state helpers
    canCreateJob: !baseLoading.isLoadingType(LOADING_TYPES.SUBMITTING),
    canEditJob: (jobId) => !baseLoading.isLoading(`job_update_${jobId}`) && !baseLoading.isLoading(`job_delete_${jobId}`),
    canDeleteJob: (jobId) => !baseLoading.isLoading(`job_update_${jobId}`) && !baseLoading.isLoading(`job_delete_${jobId}`)
  };
}

/**
 * Hook with debounced loading state
 * @param {Object} options - Configuration options
 * @returns {Object} Debounced loading utilities
 */
export function useDebouncedLoadingState(options = {}) {
  const { debounceDelay = 300, ...restOptions } = options;
  const baseLoading = useLoadingState(restOptions);
  
  const debouncedSetLoading = useCallback(
    createDebouncedLoader((isLoading, key, type, context) => {
      if (isLoading) {
        baseLoading.setLoading(key, type, context);
      } else {
        baseLoading.clearLoading(key);
      }
    }, debounceDelay),
    [baseLoading, debounceDelay]
  );

  return {
    ...baseLoading,
    setLoading: debouncedSetLoading
  };
}