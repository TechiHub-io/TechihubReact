// src/hooks/useProfileSetup.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from './useZustandStore';
import Cookies from 'js-cookie';

export function useProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    1: false, // Basic info
    2: false, // Experience
    3: false, // Education
    4: false  // Skills
  });
  
  const { 
    profile,
    experiences,
    education,
    skills,
    fetchProfile,
    clearError
  } = useStore(state => ({
    profile: state.profile,
    experiences: state.experiences,
    education: state.education,
    skills: state.skills,
    fetchProfile: state.fetchProfile,
    clearError: state.clearError
  }));
  
  // Check if the profile exists and is complete
  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const profileData = await fetchProfile();
        
        if (profileData) {
          // Check if profile has the minimum required fields
          const hasRequiredBasicInfo = !!(
            profileData.first_name && 
            profileData.last_name && 
            profileData.job_title && 
            profileData.location
          );
          
          if (hasRequiredBasicInfo) {
            setCompletedSteps(prev => ({ ...prev, 1: true }));
            
            // Also check other sections
            setCompletedSteps(prev => ({
              ...prev,
              2: experiences && experiences.length > 0,
              3: education && education.length > 0,
              4: skills && skills.length > 0
            }));
            
            // If profile is complete, set cookie
            if (hasRequiredBasicInfo) {
              Cookies.set("has_completed_profile", "true", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
            }
          }
        }
      } catch (err) {
        console.error('Error checking profile status:', err);
      }
    };
    
    checkProfileStatus();
  }, [fetchProfile, experiences, education, skills]);
  
  // Move to the next step
  const nextStep = useCallback(() => {
    setStep(prevStep => Math.min(prevStep + 1, 4));
  }, []);
  
  // Move to the previous step
  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  }, []);
  
  // Mark a step as completed
  const completeStep = useCallback((stepNumber) => {
    setCompletedSteps(prev => ({ ...prev, [stepNumber]: true }));
  }, []);
  
  // Skip the current step
  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);
  
  // Finish setup and redirect to dashboard
  const finishSetup = useCallback(() => {
    // Check if minimum profile is complete
    if (completedSteps[1]) {
      Cookies.set("has_completed_profile", "true", {
        expires: 7,
        sameSite: "strict",
        path: "/",
      });
      
      router.push('/dashboard/jobseeker');
    }
  }, [completedSteps, router]);
  
  // Calculate overall completion percentage
  const calculateCompletion = useCallback(() => {
    const totalSteps = Object.keys(completedSteps).length;
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.floor((completedCount / totalSteps) * 100);
  }, [completedSteps]);
  
  // Check if setup is complete
  const isSetupComplete = useCallback(() => {
    return completedSteps[1] && Cookies.get("has_completed_profile") === "true";
  }, [completedSteps]);
  
  return {
    // State
    step,
    completedSteps,
    profile,
    completionPercentage: calculateCompletion(),
    
    // Actions
    nextStep,
    prevStep,
    completeStep,
    skipStep,
    finishSetup,
    isSetupComplete,
    calculateCompletion,
    clearError
  };
}