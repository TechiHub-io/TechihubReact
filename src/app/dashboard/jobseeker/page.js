// src/app/dashboard/jobseeker/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useJobSeeker } from '@/hooks/useJobSeeker';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobSeekerDashboard from '@/components/dashboard/jobseeker/JobSeekerDashboard';

export default function JobSeekerDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  // Redirect if not authenticated or if user is an employer
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
      <JobSeekerDashboard />
    </DashboardLayout>
  );
}