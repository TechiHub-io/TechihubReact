// src/app/dashboard/employer/applications/page.js 
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useApplications } from '@/hooks/useApplications';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ApplicationsTable from '@/components/applications/ApplicationsTable';
import ApplicationsAnalytics from '@/components/applications/ApplicationsAnalytics';
import { 
  Users, 
  BarChart3, 
  Grid3x3, 
  List,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function EmployerApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, company } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    company: state.company
  }));

  const {
    applications,
    fetchApplications,
    loading,
    error,
    pagination
  } = useApplications();
  
  const [view, setView] = useState('table');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    hired: 0,
    rejected: 0
  });

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

  // Don't fetch applications here - let ApplicationsTable handle all filtering and fetching
  // This was causing conflicts where parent would load unfiltered data
  // and override the filtered data from ApplicationsTable component

  // Calculate stats from applications - IMPROVED STATUS MAPPING
  useEffect(() => {
    if (Array.isArray(applications) && applications.length > 0) {
      const newStats = applications.reduce((acc, app) => {
        acc.total++;
        
        // Map statuses according to your backend STATUS_CHOICES
        switch (app.status) {
          case 'applied':
            acc.pending++;
            break;
          case 'screening':
          case 'interview':
          case 'assessment':
            acc.inProgress++;
            break;
          case 'offer':
            acc.inProgress++; // Offer is still in progress
            break;
          case 'hired':
            acc.hired++;
            break;
          case 'rejected':
          case 'withdrawn':
            acc.rejected++;
            break;
          default:
            // Handle any unexpected statuses
            break;
        }
        return acc;
      }, { total: 0, pending: 0, inProgress: 0, hired: 0, rejected: 0 });
      
      setStats(newStats);
    } else {
      // Reset stats if no applications
      setStats({ total: 0, pending: 0, inProgress: 0, hired: 0, rejected: 0 });
    }
  }, [applications]);

  if (!isAuthenticated || !isEmployer) {
    return null;
  }

  // Get recent applications (last 5) - FIXED
  const recentApplications = Array.isArray(applications) ? applications.slice(0, 5) : [];
  
  // Get status color helper function
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'screening':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'assessment':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

 
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Application Management
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Review and manage applications for {company?.name || 'your company'}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === 'table'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4 mr-2 inline" />
                Table
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === 'analytics'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Analytics
              </button>
            </div>
            
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>
          </div>
        </div>

        {/* Quick Stats Cards - IMPROVED */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : (pagination?.count || stats.total)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.pending}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Grid3x3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.inProgress}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hired</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.hired}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-8">
            <ApplicationsAnalytics />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {view === 'table' ? (
            <ApplicationsTable showJobColumn={true} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ApplicationsAnalytics />
            </div>
          )}
        </div>

        {/* Recent Applications - FIXED DATA ACCESS */}
        {recentApplications.length > 0 && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Applications
              </h3>
              
              <div className="space-y-3">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.applicant_name || 'Unknown Applicant'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Applied for {application.job_title || application.job?.title || 'Unknown Position'} • {new Date(application.applied_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status_display || application.status}
                      </span>
                      
                      <button
                        onClick={() => router.push(`/applications/${application.id}`)}
                        className="text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {Array.isArray(applications) && applications.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setView('table')}
                    className="text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium"
                  >
                    View All Applications ({applications.length}) →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !Array.isArray(applications) && (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && Array.isArray(applications) && applications.length === 0 && (
          <div className="mt-8 text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Applications will appear here when candidates apply to your job postings.
            </p>
            <button
              onClick={() => router.push('/dashboard/employer/jobs')}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              View Job Postings
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}