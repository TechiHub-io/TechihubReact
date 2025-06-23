// src/app/dashboard/employer/applications/job/[jobId]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useJobs } from '@/hooks/useJobs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ApplicationsTable from '@/components/applications/ApplicationsTable';
import ApplicationsAnalytics from '@/components/applications/ApplicationsAnalytics';
import { 
  Briefcase, 
  ArrowLeft, 
  Calendar, 
  MapPin,
  Users,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function JobApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { fetchJobById, currentJob, loading } = useJobs();
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Authentication and role check
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

  // Fetch job details
  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    }
  }, [jobId, fetchJobById]);

  if (!isAuthenticated || !isEmployer) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentJob) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Job Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The job you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link
              href="/dashboard/employer/applications"
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard/employer/applications"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to All Applications
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#0CCE68]/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-[#0CCE68]" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentJob.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Applications for this position
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentJob.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Posted {new Date(currentJob.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {currentJob.application_count || 0} applications
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {showAnalytics ? 'Hide' : 'Show'} Analytics
                </button>
                
                <Link
                  href={`/jobs/${currentJob.id}`}
                  className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Job Posting
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Job-specific Analytics */}
        {showAnalytics && (
          <div className="mb-8">
            <ApplicationsAnalytics jobId={jobId} />
          </div>
        )}

        {/* Applications Table */}
        <ApplicationsTable jobId={jobId} showJobColumn={false} />
      </div>
    </DashboardLayout>
  );
}