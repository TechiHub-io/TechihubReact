// src/app/jobs/[...params]/page.js 
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import PublicJobsList from '@/components/jobs/PublicJobsList';
import PublicJobDetail from '@/components/jobs/PublicJobDetail';
import { parseUrlToFilters, generateBreadcrumbs } from '@/lib/utils/urlParser';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  // Await the params
  const resolvedParams = await params;
  const pathSegments = resolvedParams.params || [];
  
  // Check if this is an individual job page
  if (pathSegments.length >= 3) {
    const jobId = pathSegments[pathSegments.length - 1];
    
    // If the last segment looks like a job ID, fetch job data for meta tags
    if (jobId && jobId.match(/^[a-f0-9-]{36}$/i)) {
      try {
        // Fetch job data for meta tags
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${API_URL}/jobs/${jobId}/`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store' // Always fetch fresh data for meta tags
        });
        
        if (response.ok) {
          const job = await response.json();
          
          return {
            title: `${job.title} at ${job.company_name} | TechHub Jobs`,
            description: job.description 
              ? `${job.description.substring(0, 155)}...`
              : `Join ${job.company_name} as ${job.title}. ${job.location ? `Located in ${job.location}.` : ''} Apply now on TechHub.`,
            keywords: `${job.title}, ${job.company_name}, ${job.location || ''}, jobs, careers, employment`,
            openGraph: {
              title: `${job.title} at ${job.company_name}`,
              description: job.description?.substring(0, 200) || `Join ${job.company_name} as ${job.title}`,
              type: 'article',
              url: `/jobs/${pathSegments.join('/')}`,
              siteName: 'TechHub',
              images: job.company_logo ? [{
                url: job.company_logo,
                width: 400,
                height: 400,
                alt: `${job.company_name} logo`
              }] : [],
            },
            twitter: {
              card: 'summary',
              title: `${job.title} at ${job.company_name}`,
              description: job.description?.substring(0, 150) || `Join ${job.company_name} as ${job.title}`,
              images: job.company_logo ? [job.company_logo] : [],
            },
            alternates: {
              canonical: `/jobs/${pathSegments.join('/')}`,
            },
          };
        }
      } catch (error) {
        console.error('Error fetching job for metadata:', error);
      }
    }
  }
  
  // Default metadata for filter pages
  const filters = parseUrlToFilters(pathSegments);
  const filterDescriptions = [];
  
  if (filters.remote) filterDescriptions.push('remote');
  if (filters.location) filterDescriptions.push(`in ${filters.location}`);
  if (filters.job_type) filterDescriptions.push(filters.job_type.replace('_', '-'));
  if (filters.experience_level) filterDescriptions.push(`${filters.experience_level} level`);
  if (filters.skills.length > 0) filterDescriptions.push(filters.skills.join(', '));
  
  const filterText = filterDescriptions.length > 0 ? ` - ${filterDescriptions.join(', ')}` : '';
  const title = `Jobs${filterText} | TechHub`;
  const description = `Find ${filterDescriptions.join(', ')} jobs. Browse opportunities from top companies and apply today.`;
  
  return {
    title,
    description,
    keywords: `jobs, careers, employment, hiring, ${filterDescriptions.join(', ')}`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/jobs/${pathSegments.join('/')}`,
      siteName: 'TechHub',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/jobs/${pathSegments.join('/')}`,
    },
  };
}

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

// Loading component for job detail
function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component - also needs to await params
export default async function JobsParamsPage({ params }) {
  // Await the params
  const resolvedParams = await params;
  const pathSegments = resolvedParams.params || [];
  
  // Check if this is an individual job page (last segment is a UUID)
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isJobDetailPage = lastSegment && lastSegment.match(/^[a-f0-9-]{36}$/i);
  
  if (isJobDetailPage) {
    // Individual job page
    const jobId = lastSegment;
    const companySlug = pathSegments[pathSegments.length - 3] || '';
    const jobSlug = pathSegments[pathSegments.length - 2] || '';
    
    return (
      <PublicLayout showBreadcrumbs={true}>
        <Suspense fallback={<JobDetailLoading />}>
          <PublicJobDetail 
            jobId={jobId}
            companySlug={companySlug}
            jobSlug={jobSlug}
          />
        </Suspense>
      </PublicLayout>
    );
  } else {
    // Jobs listing with filters
    const filters = parseUrlToFilters(pathSegments);
    const breadcrumbs = generateBreadcrumbs(pathSegments);
    
    return (
      <PublicLayout showBreadcrumbs={true} breadcrumbs={breadcrumbs}>
        <Suspense fallback={<JobsListLoading />}>
          <PublicJobsList 
            initialFilters={filters}
            initialPathSegments={pathSegments}
            showTitle={pathSegments.length === 0}
          />
        </Suspense>
      </PublicLayout>
    );
  }
}

// Generate static params for common filter combinations (optional for better SEO)
export async function generateStaticParams() {
  return [
    { params: ['remote'] },
    { params: ['type', 'full-time'] },
    { params: ['type', 'part-time'] },
    { params: ['type', 'contract'] },
    { params: ['level', 'entry'] },
    { params: ['level', 'mid'] },
    { params: ['level', 'senior'] },
    { params: ['remote', 'type', 'full-time'] },
    { params: ['remote', 'level', 'senior'] },
    { params: ['skill', 'javascript'] },
    { params: ['skill', 'python'] },
    { params: ['skill', 'react'] },
    { params: ['skill', 'node-js'] },
  ];
}