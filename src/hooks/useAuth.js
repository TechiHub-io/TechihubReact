// src/hooks/useAuth.js 
import { useStore } from './useZustandStore';
import { useCallback, useEffect } from 'react';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isEmployer,
    loading,
    error,
    sessionValid,
    login,
    logout,
    register,
    updateUser,
    clearError,
    validateSession,
    profile,
    profileId
  } = useStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    loading: state.loading,
    error: state.error,
    sessionValid: state.sessionValid,
    login: state.login,
    logout: state.logout,
    register: state.register,
    updateUser: state.updateUser,
    clearError: state.clearError,
    validateSession: state.validateSession,
    // Include profile data that's now loaded during login
    profile: state.profile,
    profileId: state.profileId
  }));

  // Session validation on mount and periodically
  useEffect(() => {
    if (isAuthenticated) {
      // Validate session on mount
      validateSession();
      
      // Set up periodic session validation (every 15 minutes)
      const interval = setInterval(() => {
        validateSession();
      }, 15 * 60 * 1000); // 15 minutes
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, validateSession]);

  // Auto-logout on session invalid
  useEffect(() => {
    if (isAuthenticated && !sessionValid) {
      logout();
    }
  }, [sessionValid, isAuthenticated, logout]);

  // Helper to check if job seeker has sufficient profile strength
  const hasMinimumProfileStrength = useCallback(() => {
    if (isEmployer) return true; // Employers don't need profile strength
    return (profile?.profile_strength || 0) >= 20;
  }, [profile?.profile_strength, isEmployer]);

  // Helper to get current profile strength
  const getProfileStrength = useCallback(() => {
    return profile?.profile_strength || 0;
  }, [profile?.profile_strength]);

  // Enhanced login with automatic redirect logic
  const loginWithRedirect = useCallback(async (credentials) => {
    try {
      const result = await login(credentials);
      
      // The middleware will handle the actual redirects based on cookies set during login
      // But we can return guidance for the frontend
      if (result?.user?.is_employer) {
        return {
          ...result,
          redirectTo: '/dashboard/employer', // Middleware will handle company setup if needed
          requiresSetup: false
        };
      } else {
        const profileStrength = profile?.profile_strength || 0;
        return {
          ...result,
          redirectTo: profileStrength >= 20 ? '/dashboard/jobseeker' : '/profile/setup',
          requiresSetup: profileStrength < 20,
          profileStrength
        };
      }
    } catch (error) {
      throw error;
    }
  }, [login, profile?.profile_strength]);

  // Helper to force logout with comprehensive cleanup
  const forceLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    // Basic auth state
    user,
    isAuthenticated,
    isEmployer,
    loading,
    error,
    sessionValid,
    
    // Profile state (loaded during login for job seekers)
    profile,
    profileId,
    
    // Enhanced methods
    login: loginWithRedirect,
    logout: forceLogout,
    register,
    updateUser,
    clearError,
    validateSession,
    
    // Profile strength helpers
    hasMinimumProfileStrength,
    getProfileStrength,
    
    // Computed properties
    isJobSeeker: isAuthenticated && !isEmployer,
    profileStrength: getProfileStrength(),
    needsProfileCompletion: isAuthenticated && !isEmployer && !hasMinimumProfileStrength()
  };
}