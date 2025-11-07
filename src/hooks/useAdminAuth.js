// src/hooks/useAdminAuth.js
import { useStore } from './useZustandStore';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';

export function useAdminAuth() {
  const {
    user,
    isAuthenticated,
    loading,
    token
  } = useStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    token: state.token
  }));

  const [accessibleCompanies, setAccessibleCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);
  const fetchedRef = useRef(false);

  // Check if user is super admin - memoized to prevent re-renders
  const adminStatus = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    
    // Check multiple conditions for super admin detection
    const isSuperAdminByType = user.user_type === 'super_admin';
    const isSuperAdminByFlags = user.is_staff && user.is_superuser;
    const isSuperAdminByEmail = user.email === 'vitalis@gmail.com'; // Temporary fallback
    
    return isSuperAdminByType || isSuperAdminByFlags || isSuperAdminByEmail;
  }, [isAuthenticated, user?.user_type, user?.is_staff, user?.is_superuser, user?.email]);



  // Fetch admin accessible companies - stable reference - TEMPORARILY DISABLED FOR DEBUGGING
  const fetchAccessibleCompanies = useCallback(async () => {
    if (!adminStatus || !token) {
      return;
    }

    if (companiesLoading) {
      return;
    }
    setCompaniesLoading(true);
    setCompaniesError(null);

    try {
      // Import the API function dynamically to avoid circular dependencies
      const { companiesApi } = await import('@/lib/api/companies');
      const response = await companiesApi.getAdminAccessibleCompanies();
      console.log('🏢 Admin Accessible Companies API Response:', response);
      const companies = response.data?.data || response.data || [];
      console.log('🏢 Processed Companies:', companies);
      setAccessibleCompanies(companies);
    } catch (error) {
      console.error('Error fetching accessible companies:', error);
      
      let errorMessage = 'Failed to fetch accessible companies';
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin permissions required.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Companies endpoint not found. Please check API configuration.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCompaniesError(errorMessage);
      setAccessibleCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  }, [adminStatus, token, companiesLoading]);

  // Auto-fetch companies when admin status changes - only once
  useEffect(() => {
    if (adminStatus && token && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchAccessibleCompanies();
    } else if (!adminStatus) {
      fetchedRef.current = false;
      setAccessibleCompanies([]);
      setCompaniesError(null);
    }
  }, [adminStatus, token, fetchAccessibleCompanies]);

  // Memoized computed values to prevent re-renders
  const computedValues = useMemo(() => ({
    canPostJobs: adminStatus && accessibleCompanies.length > 0,
    hasAccessibleCompanies: accessibleCompanies.length > 0,
    accessibleCompaniesCount: accessibleCompanies.length,
    isReady: isAuthenticated && !loading && (adminStatus ? !companiesLoading : true)
  }), [adminStatus, accessibleCompanies.length, isAuthenticated, loading, companiesLoading]);

  // Stable callback functions
  const hasCompanyAccess = useCallback((companyId) => {
    if (!adminStatus || !companyId) return false;
    return accessibleCompanies.some(company => company.id === companyId);
  }, [adminStatus, accessibleCompanies]);

  const getCompanyById = useCallback((companyId) => {
    return accessibleCompanies.find(company => company.id === companyId) || null;
  }, [accessibleCompanies]);

  const refreshAccessibleCompanies = useCallback(() => {
    fetchedRef.current = false;
    return fetchAccessibleCompanies();
  }, [fetchAccessibleCompanies]);

  const checkPermissions = useCallback((action, companyId = null) => {
    if (!adminStatus) {
      return { allowed: false, reason: 'User is not a super admin' };
    }

    switch (action) {
      case 'post_job':
        if (!companyId) {
          return { allowed: false, reason: 'Company ID is required for job posting' };
        }
        if (!hasCompanyAccess(companyId)) {
          return { allowed: false, reason: 'No access to the specified company' };
        }
        return { allowed: true };

      case 'manage_jobs':
        return { allowed: true };

      case 'view_companies':
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Unknown action' };
    }
  }, [adminStatus, hasCompanyAccess]);

  return {
    // Admin status
    isAdmin: adminStatus,
    canPostJobs: computedValues.canPostJobs,
    
    // Company access
    accessibleCompanies,
    companiesLoading,
    companiesError,
    hasCompanyAccess,
    getCompanyById,
    
    // Actions
    refreshAccessibleCompanies,
    checkPermissions,
    
    // Computed properties
    hasAccessibleCompanies: computedValues.hasAccessibleCompanies,
    accessibleCompaniesCount: computedValues.accessibleCompaniesCount,
    
    // Loading states
    isLoadingAuth: loading,
    isLoadingCompanies: companiesLoading,
    isReady: computedValues.isReady
  };
}