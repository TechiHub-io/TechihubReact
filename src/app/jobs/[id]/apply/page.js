// src/app/jobs/[id]/apply/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobApplicationForm from '@/components/applications/JobApplicationForm';

export default function JobApplicationPage({ params }) {
  const router = useRouter();
  const [jobId, setJobId] = useState(null);
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));

  useEffect(() => {
    // Handle params promise in Next.js 15
    if (params) {
      if (params instanceof Promise) {
        params.then(resolvedParams => {
          setJobId(resolvedParams.id);
        });
      } else {
        setJobId(params.id);
      }
    }
  }, [params]);
  
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

  if (!jobId || !isAuthenticated || isEmployer) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <JobApplicationForm jobId={jobId} />
    </DashboardLayout>
  );
}