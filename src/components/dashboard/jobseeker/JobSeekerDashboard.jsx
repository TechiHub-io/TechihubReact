// src/components/dashboard/jobseeker/JobSeekerDashboard.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { useJobRecommendations } from '@/hooks/useJobRecommendations'; // Add this import
import ProfileCompleteness from './ProfileCompleteness';
import ApplicationsOverview from './ApplicationsOverview';
import RecommendedJobs from './RecommendedJobs';
import DashboardStats from './DashboardStats';
import ProfileViewsAnalytics from './ProfileViewsAnalytics';
import ApplicationsChart from './ApplicationsChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Cookies from 'js-cookie';

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Get profile data and functions from store
  const { 
    isAuthenticated, 
    token, 
    profile,
    profileId,
    fetchProfileId,
    fetchProfile
  } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    profile: state.profile,
    profileId: state.profileId,
    fetchProfileId: state.fetchProfileId,
    fetchProfile: state.fetchProfile
  }));

  // Get profile completion status
  const { isMinimallyComplete } = useProfileCompletion();
 
  // Get dashboard analytics
  const { 
    analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    fetchDashboardAnalytics
  } = useDashboardAnalytics();

  // Get job recommendations
  const {
    recommendations,
    recommendationCount,
    loading: recommendationsLoading,
    error: recommendationsError,
    fetchRecommendations,
    sortRecommendations
  } = useJobRecommendations();

  // In JobSeekerDashboard.jsx
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isAuthenticated || !token) {
        router.push('/auth/login');
        return;
      }
      
      try {
        setIsInitializing(true);
        
        // Get profile ID if we don't have it
        let currentProfileId = profileId;
        if (!currentProfileId) {
          currentProfileId = await fetchProfileId();
        }
        
        if (!currentProfileId) {
          router.push('/profile/setup');
          return;
        }
        
        const freshProfile = await fetchProfile();
        
        if (freshProfile) {
          const profileStrength = freshProfile.profile_strength || 0;
          console.log("Current profile strength:", profileStrength);
          
          if (profileStrength < 20) {
            console.log("Profile strength insufficient (", profileStrength, "%), redirecting to setup...");
            
            // Update cookie to reflect actual status
            Cookies.set("has_completed_profile", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
            
            router.push('/profile/setup');
            return;
          } else {
            
            // Update cookie to reflect successful validation
            Cookies.set("has_completed_profile", "true", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
        } else {
          // No profile found, redirect to setup
          router.push('/profile/setup');
          return;
        }
        
        // Continue with dashboard initialization if validation passed
        await Promise.all([
          fetchDashboardAnalytics(),
          fetchRecommendations()
        ]);
        
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        // On error, redirect to setup to be safe
        router.push('/profile/setup');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeDashboard();
  }, [isAuthenticated, token, profileId, fetchProfile, fetchProfileId, router]);

  // Initialize profile and dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isAuthenticated || !token) {
        router.push('/auth/login');
        return;
      }
      
      try {
        setIsInitializing(true);
        
        // Get profile ID if we don't have it
        let currentProfileId = profileId;
        if (!currentProfileId) {
          currentProfileId = await fetchProfileId();
        }
        
        // Redirect to setup if no profile ID found
        if (!currentProfileId) {
          router.push('/profile/setup');
          return;
        }
        
        // Fetch profile data if we don't have it
        if (currentProfileId && !profile) {
          await fetchProfile();
        }
        
        // Check if profile is minimally complete
        const hasCompletedProfile = Cookies.get("has_completed_profile") === "true";
        
        // Allow access if profile is minimally complete OR cookie says it's complete
        if (isMinimallyComplete || hasCompletedProfile) {
          // Set the cookie to prevent future redirects
          Cookies.set("has_completed_profile", "true", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
          
          // Load dashboard analytics data and recommendations
          await Promise.all([
            fetchDashboardAnalytics(),
            fetchRecommendations()
          ]);
        } else {
          // Profile is not complete, redirect to setup
          router.push('/profile/setup');
          return;
        }
        
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeDashboard();
  }, [isAuthenticated, token, profileId, profile, isMinimallyComplete, fetchProfileId, fetchProfile, fetchDashboardAnalytics, fetchRecommendations, router]);
  
  // Handle sorting recommendations
  const handleSortRecommendations = (criteria) => {
    sortRecommendations(criteria);
  };

  // Show loading state while initializing
  if (isInitializing || (!profile && isAuthenticated)) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.user?.first_name || 'there'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your job search overview
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
            className="px-6 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors font-medium"
          >
            Find Jobs
          </button>
        </div>
      </div>
      
      {/* Dashboard Statistics Cards */}
      <DashboardStats 
        analyticsData={analyticsData} 
        loading={analyticsLoading} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Overview */}
          <ApplicationsOverview 
            applications={analyticsData.applications || []} 
            onViewAll={() => router.push('/dashboard/jobseeker/applications')}
          />
          
          {/* Applications Timeline Chart */}
          <ApplicationsChart 
            applicationsOverTime={analyticsData.applicationsOverTime || {}}
            loading={analyticsLoading}
          />
          
          {/* Recommended Jobs */}
          <RecommendedJobs 
            jobs={recommendations}
            recommendationCount={recommendationCount}
            loading={recommendationsLoading}
            error={recommendationsError}
            onViewAll={() => router.push('/dashboard/jobseeker/jobs/search')}
            onSort={handleSortRecommendations}
            onRefresh={fetchRecommendations}
          />
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <ProfileCompleteness 
            onEditProfile={() => router.push('/dashboard/jobseeker/profile/edit')} 
          />
          
          {/* Profile Views Analytics */}
          <ProfileViewsAnalytics 
            profileViews={analyticsData.profileViews}
            loading={analyticsLoading}
          />
        </div>
      </div>
      
      {/* Error state */}
      {(analyticsError || recommendationsError) && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="text-sm">
            Some dashboard data couldn't be loaded:
            {analyticsError && <span className="block">• Analytics: {analyticsError}</span>}
            {recommendationsError && <span className="block">• Recommendations: {recommendationsError}</span>}
          </p>
        </div>
      )}
    </div>
  );
}