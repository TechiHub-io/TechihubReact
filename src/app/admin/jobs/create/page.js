'use client';

import { useStore } from '@/hooks/useZustandStore';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminJobPostingForm from '@/components/admin/AdminJobPostingForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AdminJobCreatePage() {
  const { user, isAuthenticated } = useStore();
  const { isAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAdmin) {
      console.log("❌ Non-super admin trying to access admin job creation");
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
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Super Admin Access Required</h2>
          <p className="text-gray-600 mb-4">
            Admin job creation is only accessible to super administrators.
          </p>
          <p className="text-sm text-gray-500">
            If you believe you should have access, please contact your system administrator.
          </p>
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
            Post New Job
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a new job posting as a super admin
          </p>
        </div>

        {/* Job Posting Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <AdminJobPostingForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            submitButtonText="Post Job"
          />
        </div>
      </div>
    </div>
  );
}