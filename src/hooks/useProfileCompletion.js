// src/hooks/useProfileCompletion.js
'use client';
import { useStore } from '@/hooks/useZustandStore';
import { useMemo, useEffect } from 'react';

export function useProfileCompletion() {
  const { 
    profile, 
    profileId,
    fetchProfile
  } = useStore(state => ({
    profile: state.profile,
    profileId: state.profileId,
    fetchProfile: state.fetchProfile
  }));

  // Ensure profile data is loaded
  useEffect(() => {
    if (profileId && !profile) {
      fetchProfile();
    }
  }, [profileId, profile, fetchProfile]);

  // Use backend's profile_strength directly
  const percentage = useMemo(() => {
    if (!profile) return 0;
    return profile.profile_strength || 0;
  }, [profile]);

  // Calculate completion status for each section using correct field paths
  const sections = useMemo(() => {
    if (!profile) return {
      basic: { complete: false, weight: 20 },
      experience: { complete: false, weight: 20 },
      education: { complete: false, weight: 20 },
      skills: { complete: false, weight: 20 },
      additional: { complete: false, weight: 20 }
    };

    // Use profile.user fields for basic information
    const basicComplete = !!(
      profile.user?.first_name && 
      profile.user?.last_name && 
      profile.job_title && 
      profile.bio
    );

    // Use nested arrays from profile response
    const experienceComplete = profile.experiences && profile.experiences.length > 0;
    const educationComplete = profile.education && profile.education.length > 0;
    const skillsComplete = profile.skills && profile.skills.length > 0;
    const additionalComplete = (profile.certifications && profile.certifications.length > 0) || 
                              (profile.portfolio_items && profile.portfolio_items.length > 0);

    return {
      basic: {
        complete: basicComplete,
        weight: 20,
      },
      experience: {
        complete: experienceComplete,
        weight: 20,
      },
      education: {
        complete: educationComplete,
        weight: 20,
      },
      skills: {
        complete: skillsComplete,
        weight: 20,
      },
      additional: {
        complete: additionalComplete,
        weight: 20,
      }
    };
  }, [profile]);

  // Generate next steps based on incomplete sections
  const nextSteps = useMemo(() => {
    if (!profile) return [];
    
    const steps = [];
    
    if (!sections.basic.complete) {
      steps.push('Complete your basic information');
    }
    
    if (!sections.experience.complete) {
      steps.push('Add your work experience');
    }
    
    if (!sections.education.complete) {
      steps.push('Add your education history');
    }
    
    if (!sections.skills.complete) {
      steps.push('Add your skills');
    }
    
    if (!sections.additional.complete) {
      steps.push('Add certifications or portfolio items');
    }
    
    return steps;
  }, [sections, profile]);

  // Consider profile minimally complete if basic info is complete
  const isMinimallyComplete = useMemo(() => {
    return sections.basic.complete;
  }, [sections]);

  return {
    percentage,
    sections,
    nextSteps,
    isComplete: percentage === 100,
    isMinimallyComplete
  };
}