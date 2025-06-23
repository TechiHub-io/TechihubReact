// src/app/dashboard/employer/applications/analytics/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ApplicationsAnalytics from '@/components/applications/ApplicationsAnalytics';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationAnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));

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

  if (!isAuthenticated || !isEmployer) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/employer/applications"
            className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Applications
          </Link>
        </div>

        <ApplicationsAnalytics />
      </div>
    </DashboardLayout>
  );
}