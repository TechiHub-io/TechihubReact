// src/app/jobs/page.js - Main public jobs listing page
import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PublicJobsList from '@/components/jobs/PublicJobsList';

export const metadata = {
  title: 'Find Jobs | TechHub - Browse Thousands of Opportunities',
  description: 'Discover your next career opportunity. Browse thousands of jobs from top companies across various industries. Apply today and take the next step in your career.',
  keywords: 'jobs, careers, employment, hiring, opportunities, work, tech jobs, remote jobs',
  openGraph: {
    title: 'Find Jobs | TechHub',
    description: 'Discover your next career opportunity. Browse thousands of jobs from top companies.',
    type: 'website',
    url: '/jobs',
    siteName: 'TechHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Jobs | TechHub',
    description: 'Discover your next career opportunity. Browse thousands of jobs from top companies.',
  },
  alternates: {
    canonical: '/jobs',
  },
};

// Loading component for jobs list
function JobsListLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="flex gap-6">
            <div className="w-80 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: null },
  ];

  return (
    <PublicLayout showBreadcrumbs={true} breadcrumbs={breadcrumbs}>
      <Suspense fallback={<JobsListLoading />}>
        <PublicJobsList showTitle={true} />
      </Suspense>
    </PublicLayout>
  );
}