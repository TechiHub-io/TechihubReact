// src/components/auth/AdminRoute.jsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminRoute({ children, fallbackPath = '/dashboard' }) {
  const router = useRouter();
  const { 
    isAdmin, 
    isLoadingAuth, 
    isLoadingCompanies, 
    isReady 
  } = useAdminAuth();

  useEffect(() => {
    // Wait for authentication and admin data to load
    if (isReady && !isAdmin) {
      // Redirect non-admin users to appropriate dashboard
      router.replace(fallbackPath);
    }
  }, [isReady, isAdmin, router, fallbackPath]);

  // Show loading state while checking authentication and admin status
  if (isLoadingAuth || isLoadingCompanies || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Access Denied</p>
            <p className="text-sm">You don't have admin permissions to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render children for admin users
  return children;
}

// Higher-order component version for easier usage
export function withAdminAuth(Component, options = {}) {
  const { fallbackPath = '/dashboard' } = options;
  
  return function AdminProtectedComponent(props) {
    return (
      <AdminRoute fallbackPath={fallbackPath}>
        <Component {...props} />
      </AdminRoute>
    );
  };
}