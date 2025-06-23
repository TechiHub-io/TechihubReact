// src/app/dashboard/jobseeker/jobs/search/page.js - 
'use client';
import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobSearchPage from '@/components/jobs/JobSearchPage';

// Loading component
function JobSearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="flex gap-6">
          <div className="w-80 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsSearchPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
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
  
  if (!isAuthenticated || isEmployer) {
    return <JobSearchLoading />;
  }
  
  return (
    <DashboardLayout>
      <Suspense fallback={<JobSearchLoading />}>
        <JobSearchPage />
      </Suspense>
    </DashboardLayout>
  );
}