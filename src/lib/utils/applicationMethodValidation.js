// src/lib/utils/applicationMethodValidation.js
import { APPLICATION_METHODS } from '@/components/admin/ApplicationMethodSelector';

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Ensure it's http or https protocol
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates application method configuration
 * @param {Array} selectedMethods - Array of selected method types
 * @param {string} applicationUrl - URL for external applications
 * @param {string} applicationEmail - Email for email applications
 * @returns {Object} - Validation result with errors object
 */
export const validateApplicationMethods = (selectedMethods = [], applicationUrl = '', applicationEmail = '') => {
  const errors = {};
  
  // Check if at least one method is selected
  if (!Array.isArray(selectedMethods) || selectedMethods.length === 0) {
    errors.general = 'At least one application method must be selected';
    return { isValid: false, errors };
  }
  
  // Validate external URL if selected
  if (selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL)) {
    if (!applicationUrl || !applicationUrl.trim()) {
      errors.applicationUrl = 'Application URL is required when external website method is selected';
    } else if (!validateUrl(applicationUrl.trim())) {
      errors.applicationUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }
  }
  
  // Validate email if selected
  if (selectedMethods.includes(APPLICATION_METHODS.EMAIL)) {
    if (!applicationEmail || !applicationEmail.trim()) {
      errors.applicationEmail = 'Application email is required when email method is selected';
    } else if (!validateEmail(applicationEmail.trim())) {
      errors.applicationEmail = 'Please enter a valid email address';
    }
  }
  
  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

/**
 * Validates individual application method field
 * @param {string} fieldName - Name of the field to validate
 * @param {*} value - Value to validate
 * @param {Array} selectedMethods - Currently selected methods
 * @returns {string|null} - Error message or null if valid
 */
export const validateApplicationMethodField = (fieldName, value, selectedMethods = []) => {
  switch (fieldName) {
    case 'applicationUrl':
      if (selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL)) {
        if (!value || !value.trim()) {
          return 'Application URL is required when external website method is selected';
        }
        if (!validateUrl(value.trim())) {
          return 'Please enter a valid URL (e.g., https://example.com)';
        }
      }
      return null;
      
    case 'applicationEmail':
      if (selectedMethods.includes(APPLICATION_METHODS.EMAIL)) {
        if (!value || !value.trim()) {
          return 'Application email is required when email method is selected';
        }
        if (!validateEmail(value.trim())) {
          return 'Please enter a valid email address';
        }
      }
      return null;
      
    case 'selectedMethods':
      if (!Array.isArray(value) || value.length === 0) {
        return 'At least one application method must be selected';
      }
      return null;
      
    default:
      return null;
  }
};

/**
 * Formats application methods data for API submission
 * @param {Array} selectedMethods - Selected method types
 * @param {string} applicationUrl - URL for external applications
 * @param {string} applicationEmail - Email for email applications
 * @returns {Object} - Formatted data for API
 */
export const formatApplicationMethodsForAPI = (selectedMethods = [], applicationUrl = '', applicationEmail = '') => {
  const methods = [];
  
  selectedMethods.forEach(method => {
    switch (method) {
      case APPLICATION_METHODS.INTERNAL:
        methods.push({
          type: 'internal',
          label: 'Apply on TechHub',
          primary: true
        });
        break;
        
      case APPLICATION_METHODS.EXTERNAL_URL:
        if (applicationUrl && applicationUrl.trim()) {
          methods.push({
            type: 'external_url',
            label: 'Apply on Company Website',
            url: applicationUrl.trim(),
            primary: false
          });
        }
        break;
        
      case APPLICATION_METHODS.EMAIL:
        if (applicationEmail && applicationEmail.trim()) {
          methods.push({
            type: 'email',
            label: 'Apply via Email',
            email: applicationEmail.trim(),
            primary: false
          });
        }
        break;
    }
  });
  
  return {
    application_methods: methods,
    use_internal_application: selectedMethods.includes(APPLICATION_METHODS.INTERNAL),
    application_url: selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) ? applicationUrl.trim() : null,
    application_email: selectedMethods.includes(APPLICATION_METHODS.EMAIL) ? applicationEmail.trim() : null
  };
};

/**
 * Parses application methods data from API response
 * @param {Object} jobData - Job data from API
 * @returns {Object} - Parsed application methods data
 */
export const parseApplicationMethodsFromAPI = (jobData = {}) => {
  const selectedMethods = [];
  let applicationUrl = '';
  let applicationEmail = '';
  
  // Check for internal application
  if (jobData.use_internal_application) {
    selectedMethods.push(APPLICATION_METHODS.INTERNAL);
  }
  
  // Check for external URL
  if (jobData.application_url) {
    selectedMethods.push(APPLICATION_METHODS.EXTERNAL_URL);
    applicationUrl = jobData.application_url;
  }
  
  // Check for email application
  if (jobData.application_email) {
    selectedMethods.push(APPLICATION_METHODS.EMAIL);
    applicationEmail = jobData.application_email;
  }
  
  // Also check application_methods array if available
  if (Array.isArray(jobData.application_methods)) {
    jobData.application_methods.forEach(method => {
      switch (method.type) {
        case 'internal':
          if (!selectedMethods.includes(APPLICATION_METHODS.INTERNAL)) {
            selectedMethods.push(APPLICATION_METHODS.INTERNAL);
          }
          break;
        case 'external_url':
          if (!selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL)) {
            selectedMethods.push(APPLICATION_METHODS.EXTERNAL_URL);
          }
          if (method.url && !applicationUrl) {
            applicationUrl = method.url;
          }
          break;
        case 'email':
          if (!selectedMethods.includes(APPLICATION_METHODS.EMAIL)) {
            selectedMethods.push(APPLICATION_METHODS.EMAIL);
          }
          if (method.email && !applicationEmail) {
            applicationEmail = method.email;
          }
          break;
      }
    });
  }
  
  return {
    selectedMethods,
    applicationUrl,
    applicationEmail
  };
};