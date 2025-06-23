// src/app/jobs/create/page.js
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobPostingForm from '@/components/jobs/JobPostingForm';
import { useStore } from '@/hooks/useZustandStore';

export default function JobCreatePage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  // Redirect if not authenticated or not an employer
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isEmployer) {
      router.push('/dashboard/jobseeker');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobPostingForm />
      </div>
    </DashboardLayout>
  );
}