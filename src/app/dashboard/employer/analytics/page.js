// src/app/dashboard/employer/analytics/page.js
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { useStore } from '@/hooks/useZustandStore';

export default function EmployerAnalyticsPage() {
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
      <AnalyticsDashboard />
    </DashboardLayout>
  );
}