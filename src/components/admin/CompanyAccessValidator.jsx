// src/components/admin/CompanyAccessValidator.jsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, RefreshCw, Shield, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function CompanyAccessValidator({
  companyId,
  onValidationChange,
  onAccessRevoked,
  children,
  showValidationStatus = true,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  className = ''
}) {
  const {
    hasCompanyAccess,
    getCompanyById,
    refreshAccessibleCompanies,
    isLoadingCompanies,
    companiesError
  } = useAdminAuth();

  const [validationState, setValidationState] = useState({
    isValid: null,
    isChecking: false,
    lastChecked: null,
    error: null
  });

  const [refreshTimer, setRefreshTimer] = useState(null);

  // Validate company access
  const validateAccess = useCallback(async (showLoading = true) => {
    if (!companyId) {
      setValidationState({
        isValid: false,
        isChecking: false,
        lastChecked: new Date(),
        error: 'No company selected'
      });
      onValidationChange?.(false, 'No company selected');
      return;
    }

    if (showLoading) {
      setValidationState(prev => ({
        ...prev,
        isChecking: true,
        error: null
      }));
    }

    try {
      // Refresh company access data
      await refreshAccessibleCompanies();
      
      // Check if admin still has access
      const hasAccess = hasCompanyAccess(companyId);
      const company = getCompanyById(companyId);
      
      const newState = {
        isValid: hasAccess,
        isChecking: false,
        lastChecked: new Date(),
        error: hasAccess ? null : 'Access to this company has been revoked'
      };

      setValidationState(newState);
      onValidationChange?.(hasAccess, newState.error);

      // If access was revoked, notify parent
      if (!hasAccess && onAccessRevoked) {
        onAccessRevoked(companyId, company);
      }

    } catch (error) {
      console.error('Error validating company access:', error);
      const errorMessage = error.message || 'Failed to validate company access';
      
      setValidationState({
        isValid: false,
        isChecking: false,
        lastChecked: new Date(),
        error: errorMessage
      });
      
      onValidationChange?.(false, errorMessage);
    }
  }, [companyId, hasCompanyAccess, getCompanyById, refreshAccessibleCompanies, onValidationChange, onAccessRevoked]);

  // Initial validation when component mounts or companyId changes
  useEffect(() => {
    if (companyId) {
      validateAccess();
    }
  }, [companyId, validateAccess]);

  // Set up auto-refresh timer
  useEffect(() => {
    if (autoRefresh && companyId && refreshInterval > 0) {
      const timer = setInterval(() => {
        validateAccess(false); // Don't show loading for background checks
      }, refreshInterval);
      
      setRefreshTimer(timer);
      
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }
  }, [autoRefresh, companyId, refreshInterval, validateAccess]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [refreshTimer]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    validateAccess(true);
  };

  // Get validation status display
  const getValidationStatus = () => {
    if (validationState.isChecking || isLoadingCompanies) {
      return {
        icon: RefreshCw,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        message: 'Validating access...',
        spinning: true
      };
    }

    if (validationState.error || companiesError) {
      return {
        icon: ShieldAlert,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        message: validationState.error || companiesError,
        spinning: false
      };
    }

    if (validationState.isValid === true) {
      return {
        icon: Shield,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        message: 'Access verified',
        spinning: false
      };
    }

    if (validationState.isValid === false) {
      return {
        icon: ShieldAlert,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        message: 'Access denied',
        spinning: false
      };
    }

    return null;
  };

  const status = getValidationStatus();

  return (
    <div className={className}>
      {/* Validation Status Display */}
      {showValidationStatus && status && (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${status.bgColor} ${status.borderColor} mb-4`}>
          <div className="flex items-center space-x-2">
            <status.icon className={`w-4 h-4 ${status.color} ${status.spinning ? 'animate-spin' : ''}`} />
            <span className={`text-sm font-medium ${status.color}`}>
              {status.message}
            </span>
          </div>
          
          {/* Manual refresh button */}
          {!validationState.isChecking && !isLoadingCompanies && (
            <button
              type="button"
              onClick={handleManualRefresh}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Refresh access validation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Last checked timestamp */}
      {showValidationStatus && validationState.lastChecked && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Last checked: {validationState.lastChecked.toLocaleTimeString()}
        </div>
      )}

      {/* Access Revoked Warning */}
      {validationState.isValid === false && validationState.error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Company Access Issue
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {validationState.error}. Please contact your administrator or select a different company.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Children - only render if access is valid or still checking */}
      {(validationState.isValid === true || validationState.isValid === null) && children}
    </div>
  );
}

// Hook for using company access validation in other components
export function useCompanyAccessValidation(companyId, options = {}) {
  const {
    onValidationChange,
    onAccessRevoked,
    autoRefresh = true,
    refreshInterval = 30000
  } = options;

  const {
    hasCompanyAccess,
    getCompanyById,
    refreshAccessibleCompanies,
    isLoadingCompanies,
    companiesError
  } = useAdminAuth();

  const [validationState, setValidationState] = useState({
    isValid: null,
    isChecking: false,
    lastChecked: null,
    error: null
  });

  const validateAccess = useCallback(async (showLoading = true) => {
    if (!companyId) {
      const newState = {
        isValid: false,
        isChecking: false,
        lastChecked: new Date(),
        error: 'No company selected'
      };
      setValidationState(newState);
      onValidationChange?.(false, newState.error);
      return;
    }

    if (showLoading) {
      setValidationState(prev => ({
        ...prev,
        isChecking: true,
        error: null
      }));
    }

    try {
      await refreshAccessibleCompanies();
      const hasAccess = hasCompanyAccess(companyId);
      const company = getCompanyById(companyId);
      
      const newState = {
        isValid: hasAccess,
        isChecking: false,
        lastChecked: new Date(),
        error: hasAccess ? null : 'Access to this company has been revoked'
      };

      setValidationState(newState);
      onValidationChange?.(hasAccess, newState.error);

      if (!hasAccess && onAccessRevoked) {
        onAccessRevoked(companyId, company);
      }

    } catch (error) {
      const errorMessage = error.message || 'Failed to validate company access';
      const newState = {
        isValid: false,
        isChecking: false,
        lastChecked: new Date(),
        error: errorMessage
      };
      
      setValidationState(newState);
      onValidationChange?.(false, errorMessage);
    }
  }, [companyId, hasCompanyAccess, getCompanyById, refreshAccessibleCompanies, onValidationChange, onAccessRevoked]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && companyId && refreshInterval > 0) {
      const timer = setInterval(() => {
        validateAccess(false);
      }, refreshInterval);
      
      return () => clearInterval(timer);
    }
  }, [autoRefresh, companyId, refreshInterval, validateAccess]);

  // Initial validation
  useEffect(() => {
    if (companyId) {
      validateAccess();
    }
  }, [companyId, validateAccess]);

  return {
    ...validationState,
    isLoading: validationState.isChecking || isLoadingCompanies,
    validateAccess: () => validateAccess(true),
    hasError: !!(validationState.error || companiesError)
  };
}