// src/hooks/useApplicationMethods.js
'use client';
import { useState, useCallback } from 'react';
import { 
  validateApplicationMethods,
  formatApplicationMethodsForAPI,
  parseApplicationMethodsFromAPI
} from '@/lib/utils/applicationMethodValidation';
import { APPLICATION_METHODS } from '@/components/admin/ApplicationMethodSelector';

/**
 * Custom hook for managing application methods in job postings
 * Handles validation, formatting, and state management for multiple application methods
 */
export function useApplicationMethods(initialData = null) {
  // Parse initial data if provided
  const parsedInitialData = initialData ? parseApplicationMethodsFromAPI(initialData) : {
    selectedMethods: [APPLICATION_METHODS.INTERNAL],
    applicationUrl: '',
    applicationEmail: ''
  };

  // State management
  const [selectedMethods, setSelectedMethods] = useState(parsedInitialData.selectedMethods);
  const [applicationUrl, setApplicationUrl] = useState(parsedInitialData.applicationUrl);
  const [applicationEmail, setApplicationEmail] = useState(parsedInitialData.applicationEmail);
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Update selected methods
  const updateSelectedMethods = useCallback((methods) => {
    setSelectedMethods(methods);
    // Clear general errors when methods change
    setErrors(prev => ({ ...prev, general: undefined }));
  }, []);

  // Update application URL
  const updateApplicationUrl = useCallback((url) => {
    setApplicationUrl(url);
    // Clear URL-specific errors
    setErrors(prev => ({ ...prev, applicationUrl: undefined }));
  }, []);

  // Update application email
  const updateApplicationEmail = useCallback((email) => {
    setApplicationEmail(email);
    // Clear email-specific errors
    setErrors(prev => ({ ...prev, applicationEmail: undefined }));
  }, []);

  // Validate current configuration
  const validate = useCallback(() => {
    setIsValidating(true);
    const validation = validateApplicationMethods(selectedMethods, applicationUrl, applicationEmail);
    setErrors(validation.errors);
    setIsValidating(false);
    return validation.isValid;
  }, [selectedMethods, applicationUrl, applicationEmail]);

  // Get formatted data for API submission
  const getFormattedData = useCallback(() => {
    return formatApplicationMethodsForAPI(selectedMethods, applicationUrl, applicationEmail);
  }, [selectedMethods, applicationUrl, applicationEmail]);

  // Reset to default state
  const reset = useCallback(() => {
    setSelectedMethods([APPLICATION_METHODS.INTERNAL]);
    setApplicationUrl('');
    setApplicationEmail('');
    setErrors({});
  }, []);

  // Load data from API response
  const loadFromApiData = useCallback((apiData) => {
    const parsed = parseApplicationMethodsFromAPI(apiData);
    setSelectedMethods(parsed.selectedMethods);
    setApplicationUrl(parsed.applicationUrl);
    setApplicationEmail(parsed.applicationEmail);
    setErrors({});
  }, []);

  // Check if configuration has changes from initial state
  const hasChanges = useCallback(() => {
    return (
      JSON.stringify(selectedMethods) !== JSON.stringify(parsedInitialData.selectedMethods) ||
      applicationUrl !== parsedInitialData.applicationUrl ||
      applicationEmail !== parsedInitialData.applicationEmail
    );
  }, [selectedMethods, applicationUrl, applicationEmail, parsedInitialData]);

  // Get validation status
  const isValid = Object.keys(errors).length === 0 && selectedMethods.length > 0;

  // Check if required fields are missing
  const getMissingRequiredFields = useCallback(() => {
    const missing = [];
    
    if (selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) && !applicationUrl.trim()) {
      missing.push('Application URL');
    }
    
    if (selectedMethods.includes(APPLICATION_METHODS.EMAIL) && !applicationEmail.trim()) {
      missing.push('Application Email');
    }
    
    return missing;
  }, [selectedMethods, applicationUrl, applicationEmail]);

  // Get summary of current configuration
  const getSummary = useCallback(() => {
    const summary = {
      methodCount: selectedMethods.length,
      hasInternal: selectedMethods.includes(APPLICATION_METHODS.INTERNAL),
      hasExternal: selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL),
      hasEmail: selectedMethods.includes(APPLICATION_METHODS.EMAIL),
      externalUrl: selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) ? applicationUrl : null,
      emailAddress: selectedMethods.includes(APPLICATION_METHODS.EMAIL) ? applicationEmail : null,
      isComplete: isValid && getMissingRequiredFields().length === 0
    };
    
    return summary;
  }, [selectedMethods, applicationUrl, applicationEmail, isValid, getMissingRequiredFields]);

  return {
    // State
    selectedMethods,
    applicationUrl,
    applicationEmail,
    errors,
    isValidating,
    isValid,
    
    // Actions
    updateSelectedMethods,
    updateApplicationUrl,
    updateApplicationEmail,
    validate,
    reset,
    loadFromApiData,
    
    // Utilities
    getFormattedData,
    hasChanges,
    getMissingRequiredFields,
    getSummary,
    
    // Constants
    APPLICATION_METHODS
  };
}

/**
 * Hook for integrating application methods with job form
 * Provides form-specific utilities and validation
 */
export function useJobApplicationMethods(jobData = null) {
  const applicationMethods = useApplicationMethods(jobData);
  
  // Get form field props for easy integration
  const getFieldProps = useCallback(() => {
    return {
      selectedMethods: applicationMethods.selectedMethods,
      applicationUrl: applicationMethods.applicationUrl,
      applicationEmail: applicationMethods.applicationEmail,
      onMethodChange: applicationMethods.updateSelectedMethods,
      onUrlChange: applicationMethods.updateApplicationUrl,
      onEmailChange: applicationMethods.updateApplicationEmail,
      errors: applicationMethods.errors
    };
  }, [applicationMethods]);
  
  // Validate and prepare data for job submission
  const prepareForSubmission = useCallback(() => {
    const isValid = applicationMethods.validate();
    if (!isValid) {
      return { success: false, errors: applicationMethods.errors };
    }
    
    const formattedData = applicationMethods.getFormattedData();
    return { success: true, data: formattedData };
  }, [applicationMethods]);
  
  return {
    ...applicationMethods,
    getFieldProps,
    prepareForSubmission
  };
}