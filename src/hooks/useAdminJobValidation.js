// src/hooks/useAdminJobValidation.js
import { useState, useCallback, useMemo } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { 
  validateAdminJobForm, 
  validateSingleField, 
  hasValidationErrors, 
  getFirstErrorField,
  formatValidationError
} from '@/lib/utils/adminJobValidation';

/**
 * Custom hook for admin job posting form validation
 * Provides validation state management and real-time validation
 */
export function useAdminJobValidation(initialFormData = {}) {
  const { hasCompanyAccess, accessibleCompanies } = useAdminAuth();
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Admin context for validation
  const adminContext = useMemo(() => ({
    hasCompanyAccess,
    accessibleCompanies
  }), [hasCompanyAccess, accessibleCompanies]);

  // Validate a single field
  const validateField = useCallback((fieldName, value, formData = {}) => {
    const errors = validateSingleField(fieldName, value, formData, adminContext);
    return errors;
  }, [adminContext]);

  // Validate entire form
  const validateForm = useCallback((formData) => {
    const errors = validateAdminJobForm(formData, adminContext);
    return errors;
  }, [adminContext]);

  // Set field as touched
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);

  // Set multiple fields as touched
  const setFieldsTouched = useCallback((fieldNames) => {
    const touchedFields = Array.isArray(fieldNames) 
      ? fieldNames.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      : fieldNames;
    
    setTouched(prev => ({
      ...prev,
      ...touchedFields
    }));
  }, []);

  // Validate and update errors for a single field
  const validateAndSetFieldError = useCallback((fieldName, value, formData = {}) => {
    const fieldErrors = validateField(fieldName, value, formData);
    
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors,
      [fieldName]: fieldErrors[fieldName] || undefined
    }));

    return fieldErrors[fieldName];
  }, [validateField]);

  // Validate and update errors for entire form
  const validateAndSetFormErrors = useCallback((formData) => {
    const errors = validateForm(formData);
    setValidationErrors(errors);
    return errors;
  }, [validateForm]);

  // Clear validation error for a field
  const clearFieldError = useCallback((fieldName) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: undefined
    }));
  }, []);

  // Clear all validation errors
  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  // Clear all touched state
  const clearTouched = useCallback(() => {
    setTouched({});
  }, []);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setValidationErrors({});
    setTouched({});
  }, []);

  // Get error for a specific field
  const getFieldError = useCallback((fieldName) => {
    return validationErrors[fieldName];
  }, [validationErrors]);

  // Check if a field has an error
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(validationErrors[fieldName]);
  }, [validationErrors]);

  // Check if a field is touched
  const isFieldTouched = useCallback((fieldName) => {
    return Boolean(touched[fieldName]);
  }, [touched]);

  // Check if form has any errors
  const hasErrors = useMemo(() => {
    return hasValidationErrors(validationErrors);
  }, [validationErrors]);

  // Get first field with error (for scrolling)
  const firstErrorField = useMemo(() => {
    return getFirstErrorField(validationErrors);
  }, [validationErrors]);

  // Get formatted error message
  const getFormattedError = useCallback((fieldName) => {
    const error = validationErrors[fieldName];
    return error ? formatValidationError(error) : null;
  }, [validationErrors]);

  // Scroll to first error field
  const scrollToFirstError = useCallback(() => {
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                     document.querySelector(`#${firstErrorField}`) ||
                     document.querySelector(`[data-field="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the element if it's focusable
        if (element.focus) {
          setTimeout(() => element.focus(), 100);
        }
      }
    }
  }, [firstErrorField]);

  // Handle field change with validation
  const handleFieldChange = useCallback((fieldName, value, formData = {}, shouldValidate = true) => {
    // Mark field as touched
    setFieldTouched(fieldName);

    // Validate if requested and field is touched
    if (shouldValidate && (touched[fieldName] || isFieldTouched(fieldName))) {
      validateAndSetFieldError(fieldName, value, formData);
    }
  }, [setFieldTouched, touched, isFieldTouched, validateAndSetFieldError]);

  // Handle field blur with validation
  const handleFieldBlur = useCallback((fieldName, value, formData = {}) => {
    // Mark field as touched
    setFieldTouched(fieldName);
    
    // Validate field
    validateAndSetFieldError(fieldName, value, formData);
  }, [setFieldTouched, validateAndSetFieldError]);

  // Handle form submission validation
  const handleFormSubmit = useCallback((formData) => {
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setFieldsTouched(allFields);
    
    // Validate entire form
    const errors = validateAndSetFormErrors(formData);
    
    // Scroll to first error if any
    if (hasValidationErrors(errors)) {
      setTimeout(scrollToFirstError, 100);
      return { isValid: false, errors };
    }
    
    return { isValid: true, errors: {} };
  }, [setFieldsTouched, validateAndSetFormErrors, scrollToFirstError]);

  // Get validation props for a field (for easy integration with form components)
  const getFieldProps = useCallback((fieldName) => {
    return {
      error: getFieldError(fieldName),
      hasError: hasFieldError(fieldName),
      isTouched: isFieldTouched(fieldName),
      onBlur: (e) => {
        const value = e.target ? e.target.value : e;
        handleFieldBlur(fieldName, value);
      }
    };
  }, [getFieldError, hasFieldError, isFieldTouched, handleFieldBlur]);

  return {
    // Validation state
    validationErrors,
    touched,
    hasErrors,
    firstErrorField,

    // Field-level validation
    validateField,
    validateAndSetFieldError,
    getFieldError,
    getFormattedError,
    hasFieldError,
    isFieldTouched,
    clearFieldError,

    // Form-level validation
    validateForm,
    validateAndSetFormErrors,
    clearAllErrors,
    resetValidation,

    // Touch state management
    setFieldTouched,
    setFieldsTouched,
    clearTouched,

    // Event handlers
    handleFieldChange,
    handleFieldBlur,
    handleFormSubmit,

    // Utility functions
    scrollToFirstError,
    getFieldProps,

    // Admin context
    adminContext
  };
}

export default useAdminJobValidation;