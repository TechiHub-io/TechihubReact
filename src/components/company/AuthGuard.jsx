// src/components/company/AuthGuard.jsx
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';

export default function AuthGuard({ children, employerRequired = false }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, isEmployer, company } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    company: state.company
  }));

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Check if employer access is required
    if (employerRequired && !isEmployer) {
      router.push('/dashboard/jobseeker');
      return;
    }
    
    // If user is an employer, check company setup
    if (isEmployer && !company?.id) {
      router.push('/company/setup');
      return;
    }
    
    // Everything is good, show the content
    setIsLoading(false);
  }, [isAuthenticated, isEmployer, company, employerRequired, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  return children;
}