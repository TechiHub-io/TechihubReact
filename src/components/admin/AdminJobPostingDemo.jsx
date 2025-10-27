// src/components/admin/AdminJobPostingDemo.jsx
'use client';
import React from 'react';
import AdminJobPostingForm from './AdminJobPostingForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';

/**
 * Demo component for testing AdminJobPostingForm
 * This component can be used for development and testing purposes
 */
export default function AdminJobPostingDemo() {
  const { isAdmin, isLoadingAuth } = useAdminAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-400">
              You need super admin privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminJobPostingForm />
    </div>
  );
}

// Export for easy testing
export { AdminJobPostingForm };