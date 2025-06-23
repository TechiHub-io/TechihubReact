// src/app/profile/setup/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import Cookies from 'js-cookie';
import { ChevronLeft, ChevronRight, Check, User, Briefcase, GraduationCap, Award, Sparkles, Target, Star } from 'lucide-react';
// Import the profile form components
import BasicInfoForm from '@/components/profile/setup/BasicInfoForm';
import ExperienceForm from '@/components/profile/setup/ExperienceForm';
import EducationForm from '@/components/profile/setup/EducationForm';
import SkillsForm from '@/components/profile/setup/SkillsForm';
import AuthLayout from '@/components/layout/AuthLayout';

export default function ProfileSetupPage() {
  const router = useRouter();
  
  // Get profile-related state and actions from the store
  const { 
    user,
    token,
    profile, 
    isLoadingProfile,
    error,
    clearError,
    isDarkMode
  } = useStore(state => ({
    user: state.user,
    token: state.token,
    profile: state.profile,
    isLoadingProfile: state.isLoadingProfile,
    error: state.error,
    clearError: state.clearError,
    isDarkMode: state.isDarkMode
  }));
  
  const [step, setStep] = useState(1);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const [completedSteps, setCompletedSteps] = useState({
    1: false, // Basic info
    2: false, // Experience
    3: false, // Education
    4: false  // Skills
  });
  
  // Form data state for each step
  const [basicInfo, setBasicInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    country: '', // Changed from location to country
    website: '',
    bio: '',
    years_experience: 0,
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD'
  });
  
  const [experience, setExperience] = useState({
    company_name: '',
    job_title: '',
    location: '',
    start_date: '',
    end_date: '',
    current_job: false,
    description: '',
    portfolio_link: ''
  });
  
  const [education, setEducation] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });
  
  const [skills, setSkills] = useState([
    { name: '', level: 'intermediate' }
  ]);

  // Step configuration
  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      icon: User,
      description: 'Tell us about yourself',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      title: 'Experience',
      icon: Briefcase,
      description: 'Share your work history',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 3,
      title: 'Education',
      icon: GraduationCap,
      description: 'Your educational background',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 4,
      title: 'Skills',
      icon: Award,
      description: 'Showcase your abilities',
      color: 'from-purple-500 to-pink-600'
    }
  ];
  
  // Get user's profile ID if it exists
  useEffect(() => {
    const getUserProfileId = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        const response = await fetch(`${API_URL}/user/profile-id/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileId(data.profile_id);
          
          // Now fetch the profile data
          if (data.profile_id) {
            await fetchProfileData(data.profile_id);
          }
        }
      } catch (err) {
        console.error('Error getting profile ID:', err);
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getUserProfileId();
  }, [token]);
  
  // Fetch profile data with the ID
  
  const fetchProfileData = async (id) => {
    if (!id || !token) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await fetch(`${API_URL}/profiles/${id}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const profileData = await response.json();
        
        // Pre-fill form data with proper field mapping
        setBasicInfo({
          first_name: profileData.user?.first_name || '',
          last_name: profileData.user?.last_name || '',
          email: profileData.user?.email || '',
          phone: profileData.user?.phone || '',
          job_title: profileData.job_title || '',
          country: profileData.country || '', // Use country field
          website: profileData.website || '',
          bio: profileData.bio || '',
          years_experience: profileData.years_experience || 0,
          salary_min: profileData.salary_min || '',
          salary_max: profileData.salary_max || '',
          salary_currency: profileData.salary_currency || 'USD'
        });
        
        // Mark basic info as completed if all required fields are filled
        const hasRequiredBasicInfo = !!(
          profileData.user?.first_name && 
          profileData.user?.last_name && 
          profileData.job_title && 
          profileData.country && 
          profileData.bio
        );
        
        if (hasRequiredBasicInfo) {
          setCompletedSteps(prev => ({ ...prev, 1: true }));
        }
        
        // Check other step completions
        setCompletedSteps(prev => ({
          ...prev,
          2: profileData.experiences && profileData.experiences.length > 0,
          3: profileData.education && profileData.education.length > 0,
          4: profileData.skills && profileData.skills.length > 0
        }));
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Force redirect to dashboard with cleanup
  const forceRedirectToDashboard = async () => {
    
    // Set cookie to mark profile as completed
    Cookies.set("has_completed_profile", "true", {
      expires: 7,
      sameSite: "strict",
      path: "/",
    });
    
    // Optional: Fetch updated profile strength from backend
    try {
      if (profileId && token) {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        const response = await fetch(`${API_URL}/profiles/${profileId}/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const updatedProfile = await response.json();
          
          // Update cookie based on new profile strength
          if (updatedProfile.profile_strength >= 20) {
            Cookies.set("has_completed_profile", "true", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching updated profile:", error);
      // Continue with redirect even if profile update fails
    }
    
    // Force redirect
    window.location.href = "/dashboard/jobseeker";
  };
  
  // Function to handle next step
  const handleNextStep = () => {
    setStep(prevStep => Math.min(prevStep + 1, 4));
  };
  
  // Function to handle previous step
  const handlePrevStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };
  
  // Function to handle step completion
  const handleStepComplete = (stepNumber) => {
    setCompletedSteps(prev => ({ ...prev, [stepNumber]: true }));
  };

  // Submit handlers for each form
  const handleBasicInfoSubmit = async (formData) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      // Structure the data according to API expectations (matching BasicInfoSection)
      const apiPayload = {
        // User data nested under 'user' object
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || null,
        },
        
        // Profile-specific fields
        bio: formData.bio,
        job_title: formData.job_title,
        years_experience: parseInt(formData.years_experience) || 0,
        country: formData.country, // Use country instead of location
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        salary_currency: formData.salary_currency || 'USD',
      };
      
      if (profileId) {
        // Update existing profile using proper endpoint
        const response = await fetch(`${API_URL}/profiles/${profileId}/`, {
          method: "PUT", // Use PUT for complete update
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(apiPayload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || errorData.message || errorData.name || "Failed to update profile"
          );
        }
        
        await response.json();
      } else {
        // Create new profile
        const response = await fetch(`${API_URL}/profiles/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(apiPayload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || errorData.message || errorData.name || "Failed to create profile"
          );
        }
        
        const data = await response.json();
        // Store the new profile ID
        setProfileId(data.id);
      }
      
      handleStepComplete(1);
      handleNextStep();
    } catch (err) {
      console.error('Error saving basic info:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Submit handler for experience form
  const handleExperienceSubmit = async (formData) => {
    if (!profileId) {
      setApiError("Profile ID is missing. Please complete basic info first.");
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await fetch(`${API_URL}/profiles/${profileId}/experiences/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add experience"
        );
      }
      
      await response.json();
      
      handleStepComplete(2);
      handleNextStep();
      
      // Reset form
      setExperience({
        company_name: '',
        job_title: '',
        location: '',
        start_date: '',
        end_date: '',
        current_job: false,
        description: '',
        portfolio_link: ''
      });
    } catch (err) {
      console.error('Error saving experience:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Submit handler for education form
  const handleEducationSubmit = async (formData) => {
    if (!profileId) {
      setApiError("Profile ID is missing. Please complete basic info first.");
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await fetch(`${API_URL}/profiles/${profileId}/education/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add education"
        );
      }
      
      await response.json();
      
      handleStepComplete(3);
      handleNextStep();
      
      // Reset form
      setEducation({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        current: false,
        description: ''
      });
    } catch (err) {
      console.error('Error saving education:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Submit handler for skills form
  const handleSkillsSubmit = async (formData) => {
    if (!profileId) {
      setApiError("Profile ID is missing. Please complete basic info first.");
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      // Add each skill
      for (const skill of formData) {
        if (skill.name.trim()) {
          const response = await fetch(`${API_URL}/profiles/${profileId}/skills/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(skill),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.detail || errorData.message || errorData.name || "Failed to add skill"
            );
          }
        }
      }
      
      handleStepComplete(4);
      
      // Force redirect to dashboard
      await forceRedirectToDashboard();
    } catch (err) {
      console.error('Error saving skills:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Enhanced skip step handler
  const handleSkipStep = () => {
    // If basic info is completed, allow skip to dashboard
    if (completedSteps[1]) {
      forceRedirectToDashboard();
    } else {
      // If on basic info step, just move to next step
      handleNextStep();
    }
  };
  
  // Function to finish setup early
  const handleFinishEarly = () => {
    // Check if at least basic info is completed
    if (completedSteps[1]) {
      forceRedirectToDashboard();
    } else {
      // Show error - basic info is required
      setApiError('You must complete at least your basic information before proceeding.');
    }
  };

  // Skip to dashboard function (can be called from any step after basic info)
  const skipToFinish = () => {
    if (completedSteps[1] && profileId) {
      forceRedirectToDashboard();
    } else {
      setApiError("Please complete your basic information first.");
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = Object.keys(completedSteps).length;
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.floor((completedCount / totalSteps) * 100);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <BasicInfoForm 
            initialData={basicInfo} 
            onSubmit={handleBasicInfoSubmit} 
            loading={loading}
            error={apiError}
            clearError={() => setApiError(null)}
          />
        );
      case 2:
        return (
          <ExperienceForm 
            initialData={experience} 
            onSubmit={handleExperienceSubmit}
            onSkip={handleSkipStep}
            loading={loading}
            error={apiError}
            clearError={() => setApiError(null)}
          />
        );
      case 3:
        return (
          <EducationForm 
            initialData={education}
            onSubmit={handleEducationSubmit}
            onSkip={handleSkipStep}
            loading={loading}
            error={apiError}
            clearError={() => setApiError(null)}
          />
        );
      case 4:
        return (
          <SkillsForm 
            initialData={skills}
            onSubmit={handleSkillsSubmit}
            onSkip={handleFinishEarly}
            loading={loading}
            error={apiError}
            clearError={() => setApiError(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <div 
        className="min-h-screen relative transition-colors duration-200"
        style={{
          backgroundImage: `url('/images/homepage/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"></div>
        
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#0CCE68]/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0CCE68] to-blue-500 rounded-2xl mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Build Your Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create a compelling profile that showcases your skills and attracts top employers
            </p>
            
            {/* Progress Section */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile completion
                </span>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-bold text-[#0CCE68]">
                    {calculateProgress()}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#0CCE68] to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${calculateProgress()}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            
            {/* Step Navigation */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center space-x-4 overflow-x-auto">
                {steps.map((stepConfig, index) => {
                  const Icon = stepConfig.icon;
                  const isActive = step === stepConfig.id;
                  const isCompleted = completedSteps[stepConfig.id];
                  const isAccessible = stepConfig.id === 1 || completedSteps[stepConfig.id - 1];
                  
                  return (
                    <button
                      key={stepConfig.id}
                      onClick={() => isAccessible && setStep(stepConfig.id)}
                      disabled={!isAccessible}
                      className={`flex-1 min-w-0 transition-all duration-300 ${
                        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div 
                          className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                            isCompleted 
                              ? `bg-gradient-to-r ${stepConfig.color} text-white shadow-lg` 
                              : isActive 
                                ? `bg-gradient-to-r ${stepConfig.color} text-white shadow-lg scale-110` 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-white/30 animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <h3 className={`text-sm font-medium transition-colors duration-300 ${
                            isActive || isCompleted 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {stepConfig.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                            {stepConfig.description}
                          </p>
                        </div>
                        
                        {/* Connection line */}
                        {index < steps.length - 1 && (
                          <div className={`absolute top-6 left-full w-8 h-0.5 hidden lg:block transition-colors duration-300 ${
                            completedSteps[stepConfig.id] && completedSteps[stepConfig.id + 1]
                              ? 'bg-[#0CCE68]'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 lg:p-8">
              {renderStepContent()}
            </div>
            
            {/* Navigation Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex items-center space-x-3">
                  {/* Skip to dashboard option */}
                  {step > 1 && completedSteps[1] && (
                    <button
                      onClick={skipToFinish}
                      className="flex items-center space-x-2 text-[#0CCE68] hover:text-[#0BBE58] font-medium text-sm transition-colors duration-200"
                    >
                      <Target className="h-4 w-4" />
                      <span>Skip to Dashboard</span>
                    </button>
                  )}
                  
                  {step < 4 && completedSteps[step] && (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-[#0CCE68] to-blue-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  )}
                  
                  {step === 4 && completedSteps[4] && (
                    <button
                      onClick={() => handleSkillsSubmit(skills)}
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-[#0CCE68] text-white rounded-lg font-medium text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Complete Profile
                      <Check className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Error display */}
              {apiError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-800 dark:text-red-200 text-sm">{apiError}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Motivational Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🚀 Complete your profile to unlock premium job opportunities
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}