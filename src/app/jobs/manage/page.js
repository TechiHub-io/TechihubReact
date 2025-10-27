'use client';

import { useStore } from '@/hooks/useZustandStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JobsManagementTable from '@/components/jobs/JobsManagementTable';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function JobsManagePage() {
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if user is an employer
    const userRole = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_role='))
      ?.split('=')[1];

    // Redirect super admins to their admin dashboard
    if (userRole === 'super_admin') {
      router.push('/dashboard/admin?tab=jobs');
      return;
    }

    // Only allow employers
    if (userRole !== 'employer') {
      router.push('/dashboard/jobseeker');
      return;
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const userRole = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_role='))
    ?.split('=')[1];

  if (userRole === 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
          <p className="text-gray-600">Super admins should use the admin dashboard for job management.</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">You need employer privileges to manage jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Job Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your company's job postings
              </p>
            </div>
            
            <button
              onClick={() => router.push('/jobs/create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Post New Job
            </button>
          </div>
        </div>

        {/* Employer Job Management Component */}
        <JobsManagementTable />
      </div>
    </DashboardLayout>
  );
}