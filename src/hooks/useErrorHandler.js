// src/hooks/useErrorHandler.js
'use client';
import { useState, useCallback, useRef } from 'react';
import { 
  parseApiError, 
  getUserFriendlyMessage, 
  createRetryFunction,
  createErrorToast,
  ERROR_TYPES,
  RETRY_CONFIG
} from '@/lib/utils/errorHandling';

/**
 * Custom hook for comprehensive error handling with retry mechanisms
 * @param {Object} options - Configuration options
 * @returns {Object} Error handling utilities
 */
export function useErrorHandler(options = {}) {
  const {
    context = '',
    enableRetry = true,
    maxRetries = 3,
    onError = null,
    showToast = true
  } = options;

  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Handle error with parsing and user-friendly messaging
  const handleError = useCallback((rawError, errorContext = context) => {
    const errorInfo = parseApiError(rawError);
    const userMessage = getUserFriendlyMessage(errorInfo, errorContext);
    
    const processedError = {
      ...errorInfo,
      userMessage,
      context: errorContext,
      timestamp: new Date().toISOString(),
      retryCount
    };

    setError(processedError);

    // Call custom error handler if provided
    if (onError) {
      onError(processedError, rawError);
    }

    // Show toast notification if enabled
    if (showToast && typeof window !== 'undefined') {
      const toastConfig = createErrorToast(errorInfo, errorContext);
      // You can integrate with your toast system here
      console.warn('Error toast:', toastConfig);
    }

    return processedError;
  }, [context, retryCount, onError, showToast]);

  // Create a function with retry logic
  const withRetry = useCallback((fn, customConfig = {}) => {
    if (!enableRetry) {
      return fn;
    }

    const retryConfig = {
      maxRetries,
      ...customConfig,
      shouldRetry: (error) => {
        const errorInfo = parseApiError(error);
        return errorInfo.retryable && retryCount < maxRetries;
      }
    };

    return createRetryFunction(fn, retryConfig);
  }, [enableRetry, maxRetries, retryCount]);

  // Execute function with error handling and optional retry
  const executeWithErrorHandling = useCallback(async (fn, options = {}) => {
    const {
      retryable = true,
      errorContext = context,
      onSuccess = null,
      onRetry = null
    } = options;

    clearError();

    try {
      let result;
      
      if (retryable && enableRetry) {
        const retryFn = withRetry(async (...args) => {
          try {
            return await fn(...args);
          } catch (error) {
            // Increment retry count for tracking
            setRetryCount(prev => prev + 1);
            
            // Call retry callback if provided
            if (onRetry) {
              onRetry(retryCount + 1, error);
            }
            
            throw error;
          }
        });
        
        setIsRetrying(true);
        result = await retryFn();
        setIsRetrying(false);
      } else {
        result = await fn();
      }

      // Reset retry count on success
      setRetryCount(0);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      setIsRetrying(false);
      const processedError = handleError(error, errorContext);
      throw processedError;
    }
  }, [context, enableRetry, withRetry, clearError, handleError]);

  // Manual retry function
  const retry = useCallback(async (fn, options = {}) => {
    if (!error || !error.retryable) {
      throw new Error('Cannot retry: no retryable error present');
    }

    setIsRetrying(true);
    
    try {
      const result = await executeWithErrorHandling(fn, {
        ...options,
        retryable: false // Prevent nested retry logic
      });
      
      clearError();
      return result;
    } catch (retryError) {
      setIsRetrying(false);
      throw retryError;
    }
  }, [error, executeWithErrorHandling, clearError]);

  // Get retry configuration for current error
  const getRetryConfig = useCallback(() => {
    if (!error) return null;
    
    return RETRY_CONFIG[error.type] || RETRY_CONFIG[ERROR_TYPES.UNKNOWN];
  }, [error]);

  // Check if retry is available
  const canRetry = useCallback(() => {
    return error && error.retryable && retryCount < maxRetries;
  }, [error, retryCount, maxRetries]);

  // Get error summary for display
  const getErrorSummary = useCallback(() => {
    if (!error) return null;

    return {
      message: error.userMessage,
      type: error.type,
      severity: error.severity,
      canRetry: canRetry(),
      retryCount: error.retryCount,
      maxRetries,
      timestamp: error.timestamp,
      details: error.details
    };
  }, [error, canRetry, maxRetries]);

  // Reset all error state
  const reset = useCallback(() => {
    clearError();
    setIsRetrying(false);
  }, [clearError]);

  return {
    // State
    error,
    isRetrying,
    retryCount,
    hasError: !!error,
    
    // Actions
    handleError,
    clearError,
    executeWithErrorHandling,
    retry,
    reset,
    
    // Utilities
    withRetry,
    canRetry,
    getRetryConfig,
    getErrorSummary,
    
    // Computed properties
    isRetryable: error?.retryable || false,
    errorType: error?.type || null,
    errorSeverity: error?.severity || null
  };
}

/**
 * Hook specifically for admin job operations error handling
 * @param {Object} options - Configuration options
 * @returns {Object} Admin-specific error handling utilities
 */
export function useAdminJobErrorHandler(options = {}) {
  const baseHandler = useErrorHandler({
    context: 'admin_jobs',
    maxRetries: 2,
    ...options
  });

  // Admin-specific error contexts
  const handleJobCreationError = useCallback((error) => {
    return baseHandler.handleError(error, 'job_creation');
  }, [baseHandler]);

  const handleJobUpdateError = useCallback((error) => {
    return baseHandler.handleError(error, 'job_update');
  }, [baseHandler]);

  const handleJobDeletionError = useCallback((error) => {
    return baseHandler.handleError(error, 'job_delete');
  }, [baseHandler]);

  const handleCompanyFetchError = useCallback((error) => {
    return baseHandler.handleError(error, 'company_fetch');
  }, [baseHandler]);

  const handleJobFetchError = useCallback((error) => {
    return baseHandler.handleError(error, 'job_fetch');
  }, [baseHandler]);

  // Execute job creation with error handling
  const executeJobCreation = useCallback(async (createFn) => {
    return baseHandler.executeWithErrorHandling(createFn, {
      errorContext: 'job_creation',
      retryable: true
    });
  }, [baseHandler]);

  // Execute job update with error handling
  const executeJobUpdate = useCallback(async (updateFn) => {
    return baseHandler.executeWithErrorHandling(updateFn, {
      errorContext: 'job_update',
      retryable: true
    });
  }, [baseHandler]);

  // Execute job deletion with error handling
  const executeJobDeletion = useCallback(async (deleteFn) => {
    return baseHandler.executeWithErrorHandling(deleteFn, {
      errorContext: 'job_delete',
      retryable: false // Don't retry deletions
    });
  }, [baseHandler]);

  // Execute company fetch with error handling
  const executeCompanyFetch = useCallback(async (fetchFn) => {
    return baseHandler.executeWithErrorHandling(fetchFn, {
      errorContext: 'company_fetch',
      retryable: true
    });
  }, [baseHandler]);

  return {
    ...baseHandler,
    
    // Admin-specific error handlers
    handleJobCreationError,
    handleJobUpdateError,
    handleJobDeletionError,
    handleCompanyFetchError,
    handleJobFetchError,
    
    // Admin-specific execution functions
    executeJobCreation,
    executeJobUpdate,
    executeJobDeletion,
    executeCompanyFetch
  };
}

/**
 * Hook for form validation error handling
 * @param {Object} options - Configuration options
 * @returns {Object} Form validation error handling utilities
 */
export function useFormErrorHandler(options = {}) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  // Clear specific field error
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Set field error
  const setFieldError = useCallback((fieldName, error) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  // Handle API validation errors
  const handleValidationErrors = useCallback((error) => {
    const errorInfo = parseApiError(error);
    
    if (errorInfo.type === ERROR_TYPES.VALIDATION && errorInfo.details) {
      // Handle field-specific errors
      if (typeof errorInfo.details === 'object') {
        setFieldErrors(errorInfo.details);
      } else {
        setGeneralError(errorInfo.message);
      }
    } else {
      setGeneralError(errorInfo.message);
    }
  }, []);

  // Get error for specific field
  const getFieldError = useCallback((fieldName) => {
    return fieldErrors[fieldName];
  }, [fieldErrors]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return !!fieldErrors[fieldName];
  }, [fieldErrors]);

  // Get all field errors as array
  const getAllFieldErrors = useCallback(() => {
    return Object.entries(fieldErrors).map(([field, error]) => ({
      field,
      error: Array.isArray(error) ? error.join(', ') : error
    }));
  }, [fieldErrors]);

  return {
    // State
    fieldErrors,
    generalError,
    hasErrors: Object.keys(fieldErrors).length > 0 || !!generalError,
    
    // Actions
    clearAllErrors,
    clearFieldError,
    setFieldError,
    setGeneralError,
    handleValidationErrors,
    
    // Utilities
    getFieldError,
    hasFieldError,
    getAllFieldErrors
  };
}