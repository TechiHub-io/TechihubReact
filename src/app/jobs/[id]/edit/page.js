'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobPostingForm from '@/components/jobs/JobPostingForm';
import { useStore } from '@/hooks/useZustandStore';
import { useJobs } from '@/hooks/useJobs';

export default function JobEditPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use() as recommended by Next.js
  const unwrappedParams = React.use(params);
  const jobId = unwrappedParams.id;
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { fetchJobById, currentJob, loading, error } = useJobs();
  
  // Track whether we've attempted to load the job
  const [jobLoaded, setJobLoaded] = useState(false);
  
  // Load job data once
  const loadJob = useCallback(async () => {
    if (jobLoaded) return;
    
    try {
      await fetchJobById(jobId);
      setJobLoaded(true);
    } catch (error) {
      console.error('Error loading job:', error);
      setJobLoaded(true); // Mark as loaded even on error to prevent infinite retries
    }
  }, [jobId, fetchJobById, jobLoaded]);
  
  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!isEmployer) {
      router.push('/dashboard/jobseeker');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Separate effect for loading job data
  useEffect(() => {
    if (isAuthenticated && isEmployer && !jobLoaded) {
      loadJob();
    }
  }, [isAuthenticated, isEmployer, jobLoaded, loadJob]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-700 dark:text-red-300">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (jobLoaded && !currentJob) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-300">
            Job not found
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobPostingForm 
          initialData={currentJob} 
          isEdit={true} 
        />
      </div>
    </DashboardLayout>
  );
}