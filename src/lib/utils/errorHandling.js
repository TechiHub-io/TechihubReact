// src/lib/utils/errorHandling.js

/**
 * Centralized error handling utilities for admin job posting
 */

// Error types for categorization
export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Parse API error response and extract meaningful error information
 * @param {Error} error - The error object from API call
 * @returns {Object} Parsed error information
 */
export function parseApiError(error) {
  const defaultError = {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    message: 'An unexpected error occurred',
    details: null,
    retryable: false,
    statusCode: null
  };

  if (!error) return defaultError;

  // Network errors (no response)
  if (!error.response) {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      message: error.code === 'NETWORK_ERROR' 
        ? 'Network connection failed. Please check your internet connection.'
        : 'Unable to connect to the server. Please try again.',
      details: error.message,
      retryable: true,
      statusCode: null
    };
  }

  const { status, data } = error.response;
  let errorInfo = { ...defaultError, statusCode: status };

  // Extract error message from various response formats
  let message = defaultError.message;
  let details = null;

  if (data) {
    if (typeof data === 'string') {
      message = data;
    } else if (data.detail) {
      message = data.detail;
      details = data.errors || data.non_field_errors;
    } else if (data.message) {
      message = data.message;
      details = data.errors;
    } else if (data.error) {
      message = data.error;
    } else if (data.errors) {
      // Handle validation errors
      if (typeof data.errors === 'object') {
        const fieldErrors = Object.entries(data.errors)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        message = `Validation failed: ${fieldErrors}`;
        details = data.errors;
      } else {
        message = data.errors;
      }
    }
  }

  // Categorize by status code
  switch (status) {
    case 400:
      errorInfo = {
        type: ERROR_TYPES.VALIDATION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: message || 'Invalid request data',
        details,
        retryable: false,
        statusCode: status
      };
      break;

    case 401:
      errorInfo = {
        type: ERROR_TYPES.PERMISSION,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Authentication required. Please log in again.',
        details,
        retryable: false,
        statusCode: status
      };
      break;

    case 403:
      errorInfo = {
        type: ERROR_TYPES.PERMISSION,
        severity: ERROR_SEVERITY.HIGH,
        message: message || 'Access denied. You do not have permission to perform this action.',
        details,
        retryable: false,
        statusCode: status
      };
      break;

    case 404:
      errorInfo = {
        type: ERROR_TYPES.NOT_FOUND,
        severity: ERROR_SEVERITY.MEDIUM,
        message: message || 'The requested resource was not found.',
        details,
        retryable: false,
        statusCode: status
      };
      break;

    case 429:
      errorInfo = {
        type: ERROR_TYPES.NETWORK,
        severity: ERROR_SEVERITY.MEDIUM,
        message: 'Too many requests. Please wait a moment and try again.',
        details,
        retryable: true,
        statusCode: status
      };
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      errorInfo = {
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Server error. Please try again later.',
        details,
        retryable: true,
        statusCode: status
      };
      break;

    default:
      errorInfo = {
        type: ERROR_TYPES.UNKNOWN,
        severity: ERROR_SEVERITY.MEDIUM,
        message: message || `Request failed with status ${status}`,
        details,
        retryable: status >= 500,
        statusCode: status
      };
  }

  return errorInfo;
}

/**
 * Get user-friendly error message based on error type and context
 * @param {Object} errorInfo - Parsed error information
 * @param {string} context - Context where error occurred (e.g., 'job_creation', 'company_fetch')
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyMessage(errorInfo, context = '') {
  const { type, message, severity } = errorInfo;

  // Context-specific messages
  const contextMessages = {
    job_creation: {
      [ERROR_TYPES.NETWORK]: 'Unable to create job due to connection issues. Please check your internet and try again.',
      [ERROR_TYPES.VALIDATION]: 'Please check the job details and fix any validation errors.',
      [ERROR_TYPES.PERMISSION]: 'You do not have permission to create jobs for this company.',
      [ERROR_TYPES.SERVER]: 'Job creation failed due to a server error. Please try again later.'
    },
    company_fetch: {
      [ERROR_TYPES.NETWORK]: 'Unable to load companies. Please check your connection.',
      [ERROR_TYPES.PERMISSION]: 'You do not have access to view companies.',
      [ERROR_TYPES.SERVER]: 'Failed to load companies. Please refresh the page.'
    },
    job_update: {
      [ERROR_TYPES.NETWORK]: 'Unable to update job due to connection issues.',
      [ERROR_TYPES.VALIDATION]: 'Please fix the validation errors and try again.',
      [ERROR_TYPES.PERMISSION]: 'You do not have permission to update this job.',
      [ERROR_TYPES.NOT_FOUND]: 'The job you are trying to update no longer exists.'
    },
    job_delete: {
      [ERROR_TYPES.NETWORK]: 'Unable to delete job due to connection issues.',
      [ERROR_TYPES.PERMISSION]: 'You do not have permission to delete this job.',
      [ERROR_TYPES.NOT_FOUND]: 'The job you are trying to delete no longer exists.'
    }
  };

  // Try to get context-specific message first
  if (context && contextMessages[context] && contextMessages[context][type]) {
    return contextMessages[context][type];
  }

  // Fall back to the original message or generic message
  return message || 'An error occurred. Please try again.';
}

/**
 * Retry configuration for different error types
 */
export const RETRY_CONFIG = {
  [ERROR_TYPES.NETWORK]: {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 2
  },
  [ERROR_TYPES.SERVER]: {
    maxRetries: 2,
    baseDelay: 2000,
    backoffMultiplier: 1.5
  },
  [ERROR_TYPES.UNKNOWN]: {
    maxRetries: 1,
    baseDelay: 1000,
    backoffMultiplier: 1
  }
};

/**
 * Create a retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} config - Retry configuration
 * @returns {Function} Function that implements retry logic
 */
export function createRetryFunction(fn, config = {}) {
  const defaultConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 2,
    shouldRetry: (error) => {
      const errorInfo = parseApiError(error);
      return errorInfo.retryable;
    }
  };

  const finalConfig = { ...defaultConfig, ...config };

  return async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry on last attempt or if error is not retryable
        if (attempt === finalConfig.maxRetries || !finalConfig.shouldRetry(error)) {
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
}

/**
 * Error boundary helper for React components
 * @param {Error} error - The error that occurred
 * @param {Object} errorInfo - Additional error information from React
 * @returns {Object} Formatted error information for display
 */
export function handleComponentError(error, errorInfo) {
  console.error('Component error:', error, errorInfo);
  
  return {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.HIGH,
    message: 'Something went wrong. Please refresh the page and try again.',
    details: error.message,
    retryable: true,
    statusCode: null
  };
}

/**
 * Validation error formatter
 * @param {Object} validationErrors - Validation errors object
 * @returns {Array} Array of formatted error messages
 */
export function formatValidationErrors(validationErrors) {
  if (!validationErrors || typeof validationErrors !== 'object') {
    return [];
  }

  const errors = [];
  
  Object.entries(validationErrors).forEach(([field, fieldErrors]) => {
    const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach(error => {
        errors.push(`${fieldName}: ${error}`);
      });
    } else if (typeof fieldErrors === 'string') {
      errors.push(`${fieldName}: ${fieldErrors}`);
    }
  });
  
  return errors;
}

/**
 * Create error toast configuration
 * @param {Object} errorInfo - Parsed error information
 * @param {string} context - Error context
 * @returns {Object} Toast configuration
 */
export function createErrorToast(errorInfo, context = '') {
  const message = getUserFriendlyMessage(errorInfo, context);
  
  return {
    type: 'error',
    title: getErrorTitle(errorInfo.type),
    message,
    duration: getToastDuration(errorInfo.severity),
    actions: errorInfo.retryable ? [
      {
        label: 'Retry',
        action: 'retry'
      }
    ] : []
  };
}

/**
 * Get error title based on error type
 * @param {string} errorType - Error type
 * @returns {string} Error title
 */
function getErrorTitle(errorType) {
  const titles = {
    [ERROR_TYPES.NETWORK]: 'Connection Error',
    [ERROR_TYPES.VALIDATION]: 'Validation Error',
    [ERROR_TYPES.PERMISSION]: 'Access Denied',
    [ERROR_TYPES.NOT_FOUND]: 'Not Found',
    [ERROR_TYPES.SERVER]: 'Server Error',
    [ERROR_TYPES.UNKNOWN]: 'Error'
  };
  
  return titles[errorType] || 'Error';
}

/**
 * Get toast duration based on error severity
 * @param {string} severity - Error severity
 * @returns {number} Duration in milliseconds
 */
function getToastDuration(severity) {
  const durations = {
    [ERROR_SEVERITY.LOW]: 3000,
    [ERROR_SEVERITY.MEDIUM]: 5000,
    [ERROR_SEVERITY.HIGH]: 8000,
    [ERROR_SEVERITY.CRITICAL]: 0 // Don't auto-dismiss critical errors
  };
  
  return durations[severity] || 5000;
}