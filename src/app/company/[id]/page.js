// src/app/company/[id]/page.js 
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/useCompany';
import { useStore } from '@/hooks/useZustandStore';
import { useNotification } from '@/hooks/useNotification';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CompanyProfile from '@/components/company/CompanyProfile';
import { ArrowLeft } from 'lucide-react';

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id;
  
  // Get company data and actions from custom hook
  const { 
    company, 
    fetchCompany, 
    isLoadingCompany, 
    error 
  } = useCompany();
  
  // Get user data from auth store
  const { isAuthenticated, isEmployer, user } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    user: state.user
  }));
  
  // Use notification hook for error messages
  const { showError } = useNotification();
  
  // Local state - only use this for initial loading
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Check authentication just once
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);
  
  // Fetch company data once on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadCompany = async () => {
      if (!companyId) return;
      
      try {
        await fetchCompany(companyId);
      } catch (err) {
        if (isMounted) {
          showError(err?.message || 'Failed to load company data');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };
    
    loadCompany();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [companyId]); // Only depend on companyId, NOT on fetchCompany or showError
  
  // Handle error from company hook separately
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]); // Only depend on error, not on showError
  
  // Determine if current user is the owner of this company
  const isOwner = isEmployer && 
    company && 
    user && 
    ((company.owner_id && company.owner_id === user.id) || 
     (company.members && company.members.some(m => m.user_id === user.id && (m.role === 'admin' || m.is_owner))));
  
  // Loading state
  if (initialLoading || isLoadingCompany) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // No company found
  if (!company && !initialLoading && !isLoadingCompany) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-200 mb-4">
            <p>Company not found or you don't have permission to view it.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-[#0CCE68] hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-500 hover:text-[#0CCE68] dark:text-gray-400 dark:hover:text-[#0CCE68]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
        
        {/* Company Profile */}
        <CompanyProfile 
          company={company} 
          isOwner={isOwner} 
          companyId={companyId}
        />
      </div>
    </DashboardLayout>
  );
}