// src/hooks/useCompanySetup.js
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from './useCompany';
import { useAuth } from './useAuth';

/**
 * Custom hook specifically for company setup flow
 * Handles routing logic based on authentication and setup progress
 */
export function useCompanySetup() {
  const router = useRouter();
  
  const { isAuthenticated, isEmployer } = useAuth();
  const { 
    company,
    companySetupStep,
    setupProgress,
    isSetupComplete,
    setCompanySetupStep,
    initializeCompany 
  } = useCompany();

  // Initialize company data and handle routing
  useEffect(() => {
    const setup = async () => {
      // Check authentication and user type
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      
      // Check if user is an employer
      if (!isEmployer) {
        router.push('/dashboard/jobseeker');
        return;
      }
      
      // Initialize company data
      await initializeCompany();
      
      // Check if setup is already complete
      if (company && isSetupComplete()) {
        router.push('/dashboard/employer');
      }
    };
    
    setup();
  }, [isAuthenticated, isEmployer, company, isSetupComplete, router, initializeCompany]);

  // Helper function to navigate to the next step
  const goToNextStep = () => {
    setCompanySetupStep(companySetupStep + 1);
  };

  // Helper function to navigate to the previous step
  const goToPreviousStep = () => {
    setCompanySetupStep(Math.max(1, companySetupStep - 1));
  };

  // Helper function to skip the current step
  const skipStep = () => {
    goToNextStep();
  };

  // Helper function to finish setup
  const finishSetup = () => {
    router.push('/dashboard/employer');
  };

  return {
    // State
    company,
    companySetupStep,
    setupProgress,
    isSetupComplete: isSetupComplete(),
    
    // Navigation helpers
    goToNextStep,
    goToPreviousStep,
    skipStep,
    finishSetup
  };
}