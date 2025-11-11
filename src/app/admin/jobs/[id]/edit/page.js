'use client';

import { useStore } from '@/hooks/useZustandStore';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminJobs } from '@/hooks/useAdminJobs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminJobPostingForm from '@/components/admin/AdminJobPostingForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AdminJobEditPage({ params }) {
  const { user, isAuthenticated } = useStore();
  const { isAdmin } = useAdminAuth();
  const { fetchAdminJobById } = useAdminJobs();
  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);

  // Handle async params in Next.js 15
  useEffect(() => {
    const getJobId = async () => {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);
    };
    getJobId();
  }, [params]);

  useEffect(() => {
    if (!jobId) return; // Wait for jobId to be set
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAdmin) {
      // Check user role from cookie to redirect appropriately
      const userRole = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_role='))
        ?.split('=')[1];
      
      if (userRole === 'employer') {
        router.push('/dashboard/employer');
      } else {
        router.push('/dashboard/jobseeker');
      }
      return;
    }

    loadJobData();
  }, [isAuthenticated, isAdmin, jobId, router]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      setError(null);
      const job = await fetchAdminJobById(jobId);
      setJobData(job);
    } catch (err) {
      console.error('Error loading job data:', err);
      setError('Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Super Admin Access Required</h2>
          <p className="text-gray-600 mb-4">
            Admin job editing is only accessible to super administrators.
          </p>
          <p className="text-sm text-gray-500">
            If you believe you should have access, please contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadJobData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push('/dashboard/admin?tab=jobs');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Admin Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Job: {jobData?.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update job posting details
          </p>
        </div>

        {/* Job Editing Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <AdminJobPostingForm 
            initialData={jobData}
            isEdit={true}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            submitButtonText="Update Job"
          />
        </div>
      </div>
    </div>
  );
}