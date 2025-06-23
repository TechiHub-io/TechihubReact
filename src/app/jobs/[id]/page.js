// src/app/jobs/[id]/page.js - Better approach
'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobDetailsView from '@/components/jobs/JobDetailsView';
import { useStore } from '@/hooks/useZustandStore';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  
  const { isAuthenticated } = useStore(state => ({
    isAuthenticated: state.isAuthenticated
  }));
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);
  
  return (
    <DashboardLayout>
      <JobDetailsView jobId={jobId} />
    </DashboardLayout>
  );
}