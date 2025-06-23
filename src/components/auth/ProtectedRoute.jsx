// src/components/auth/ProtectedRoute.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, employerOnly, jobSeekerOnly }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth status from cookies instead of context
    const token = Cookies.get('auth_token');
    const isAuthenticated = !!token;
    const userRole = Cookies.get('user_role');
    const isEmployer = userRole === 'employer';
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (employerOnly && !isEmployer) {
      router.push('/dashboard/jobseeker');
      return;
    }

    if (jobSeekerOnly && isEmployer) {
      router.push('/dashboard/employer');
      return;
    }

    // If employer without company, redirect to setup
    if (isEmployer) {
      const hasCompany = Cookies.get('has_company') === 'true';
      if (!hasCompany) {
        router.push('/company/setup');
        return;
      }
    }

    setIsLoading(false);
  }, [router, employerOnly, jobSeekerOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;