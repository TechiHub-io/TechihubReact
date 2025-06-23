// src/app/dashboard/jobseeker/profile/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileView from '@/components/profile/ProfileView';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, profile, loading } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    profile: state.profile,
    loading: state.loading
  }));
  
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
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          My Profile
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        ) : !profile ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              Your profile needs to be set up
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Complete your profile to increase your chances of finding the perfect job.
            </p>
            <button
              onClick={() => router.push('/dashboard/jobseeker/profile/edit')}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              Set Up Profile
            </button>
          </div>
        ) : (
          <ProfileView profile={profile} isOwner={true} />
        )}
      </div>
    </DashboardLayout>
  );
}