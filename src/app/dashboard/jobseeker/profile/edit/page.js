// src/app/dashboard/jobseeker/profile/edit/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileEditTabs from '@/components/profile/ProfileEditTabs';

export default function ProfileEditPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, profile, isLoadingProfile, fetchProfile, fetchProfileId } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    profile: state.profile,
    isLoadingProfile: state.isLoadingProfile,
    fetchProfile: state.fetchProfile,
    fetchProfileId: state.fetchProfileId
  }));
  
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (isEmployer) {
      router.push('/dashboard/employer');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);

  // Initialize profile data
  useEffect(() => {
    const initProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        if (!profile) {
          await fetchProfileId();
          await fetchProfile();
        }
        setInitializing(false);
      } catch (error) {
        console.error('Error initializing profile:', error);
        setInitializing(false);
      }
    };

    initProfile();
  }, [isAuthenticated, profile, fetchProfile, fetchProfileId]);
  
  if (initializing || isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex space-x-8 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update your professional information to attract employers
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/jobseeker/profile')}
            className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            View Profile
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ProfileEditTabs profile={profile} />
        </div>
      </div>
    </DashboardLayout>
  );
}