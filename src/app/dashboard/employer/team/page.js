// src/app/dashboard/employer/team/page.js
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeamManagement from '@/components/company/TeamManagement';
import { useStore } from '@/hooks/useZustandStore';
import { useCompany } from '@/hooks/useCompany';

export default function TeamManagementPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { company, loading, error } = useCompany();
  
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
    
    // If company is loaded and doesn't exist, redirect to setup
    if (!loading && !company && !error) {
      router.push('/company/setup');
      return;
    }
  }, [isAuthenticated, isEmployer, company, loading, error, router]);
  
  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <TeamManagement />
    </DashboardLayout>
  );
}