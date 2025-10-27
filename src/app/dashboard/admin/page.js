'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import AdminJobManagement from '@/components/admin/AdminJobManagement';
import AdminJobPostingForm from '@/components/admin/AdminJobPostingForm';
import { 
  PlusIcon,
  ShieldCheckIcon as Shield,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function AdminDashboardContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const { isAdmin, accessibleCompanies, companiesLoading } = useAdminAuth();
  const { stats, loading: statsLoading } = useAdminStats();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);

  const [isReady, setIsReady] = useState(false);

  // Check for tab parameter in URL and update when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'jobs', 'companies', 'users', 'analytics', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      // Default to overview if no tab parameter
      setActiveTab('overview');
    }
  }, [searchParams]);

  // Simple authentication check with timeout
  useEffect(() => {
    const checkAuth = () => {
      const hasAuthCookie = document.cookie.includes('auth_token=');
      const hasAdminCookie = document.cookie.includes('user_role=super_admin');
      


      // If we have the right cookies, consider it ready - don't redirect
      if (hasAuthCookie && hasAdminCookie) {
        setIsReady(true);
        return;
      }

      // Only redirect if we're certain the user shouldn't be here
      // Don't redirect if we're still loading or if cookies indicate super admin
      if (!hasAuthCookie && !isAuthenticated && !loading) {

        router.push('/auth/login');
        return;
      }

      // If authenticated but not admin and we're sure about the role
      if (isAuthenticated && isAdmin === false && !loading) {
        const userRole = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_role='))
          ?.split('=')[1];
        

        if (userRole === 'employer') {
          router.push('/dashboard/employer');
        } else if (userRole === 'jobseeker') {
          router.push('/dashboard/jobseeker');
        }
        return;
      }

      // If we have auth cookies or are authenticated, we're ready
      if (hasAuthCookie || isAuthenticated) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkAuth();

    // Set a timeout to ensure we don't wait forever
    const timeout = setTimeout(() => {

      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isAdmin, router, user, loading]);

  // Show loading while not ready
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Loading Admin Dashboard...
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Check if user should have access (based on cookies if React state isn't ready)
  const hasAuthCookie = document.cookie.includes('auth_token=');
  const hasAdminCookie = document.cookie.includes('user_role=super_admin');
  const shouldHaveAccess = (isAuthenticated && isAdmin) || (hasAuthCookie && hasAdminCookie);

  if (!shouldHaveAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Super Admin Access Required
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This admin dashboard is only accessible to super administrators.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            If you believe you should have access, please contact your system administrator.
          </p>
        </div>
      </div>
    );
  }



  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  stats?.error ? 'bg-red-500' : statsLoading ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stats?.error ? 'API Disconnected' : statsLoading ? 'Loading...' : 'Connected to https://api.techihub.io'}
                </span>
              </div>
            </div>
            
            {activeTab === 'jobs' && (
              <button
                onClick={() => setShowJobForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Job
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(statsLoading === false && stats?.error) && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  API Connection Issue
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {stats?.error}
                </div>
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Unable to connect to API at: https://api.techihub.io/api/v1
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Jobs
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {statsLoading ? '...' : stats?.totalJobs || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Companies
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {companiesLoading ? '...' : accessibleCompanies?.length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UsersIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Applications
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {statsLoading ? '...' : stats?.totalApplications || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Active Jobs
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {statsLoading ? '...' : stats?.activeJobs || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Jobs */}
              {stats?.recentJobs && stats.recentJobs.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Recent Jobs
                    </h3>
                    <div className="space-y-3">
                      {stats.recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {job.company_name} • {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.is_active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {job.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {job.application_count || 0} applications
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Applications Chart */}
              {stats?.dailyApplications && stats.dailyApplications.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Daily Applications (Last 7 Days)
                    </h3>
                    <div className="space-y-2">
                      {stats.dailyApplications.map((day) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(day.date).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-[#0CCE68] h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.max((day.count / Math.max(...stats.dailyApplications.map(d => d.count))) * 100, 5)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {day.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && !showJobForm && (
            <AdminJobManagement />
          )}

          {activeTab === 'jobs' && showJobForm && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create New Job
                </h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <AdminJobPostingForm
                onSubmit={async (formData) => {
                  // Handle job creation
                  setShowJobForm(false);
                }}
                adminAccessibleCompanies={accessibleCompanies}
              />
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Companies Management
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accessibleCompanies.map((company) => (
                    <div key={company.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{company.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry || 'No industry specified'}</p>
                      <div className="mt-2 flex space-x-2">
                        <button className="text-sm text-[#0CCE68] hover:text-[#0BBE58]">View</button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
                {accessibleCompanies.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No companies available for management.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Users Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                User management interface coming soon...
              </p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Analytics Dashboard
                </h2>
                
                {/* Analytics Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Jobs</p>
                        <p className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalJobs || 0}</p>
                      </div>
                      <div className="text-blue-200">
                        <BriefcaseIcon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Active Jobs</p>
                        <p className="text-2xl font-bold">{statsLoading ? '...' : stats?.activeJobs || 0}</p>
                      </div>
                      <div className="text-green-200">
                        <ChartBarIcon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Applications</p>
                        <p className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalApplications || 0}</p>
                      </div>
                      <div className="text-purple-200">
                        <UsersIcon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Companies</p>
                        <p className="text-2xl font-bold">{companiesLoading ? '...' : accessibleCompanies?.length || 0}</p>
                      </div>
                      <div className="text-orange-200">
                        <BuildingOfficeIcon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Daily Applications (Last 7 Days)
                    </h3>
                    {stats?.dailyApplications && stats.dailyApplications.length > 0 ? (
                      <div className="space-y-3">
                        {stats.dailyApplications.map((day) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <div className="flex items-center space-x-3 flex-1 ml-4">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                                <div 
                                  className="bg-[#0CCE68] h-3 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${Math.max((day.count / Math.max(...stats.dailyApplications.map(d => d.count), 1)) * 100, day.count > 0 ? 10 : 0)}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-right">
                                {day.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {statsLoading ? 'Loading application data...' : 'No application data available'}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Recent Jobs Performance
                    </h3>
                    {stats?.recentJobs && stats.recentJobs.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentJobs.slice(0, 5).map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {job.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {job.company_name}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {job.application_count || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  applications
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                job.is_active 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {job.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {statsLoading ? 'Loading job data...' : 'No recent jobs available'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                System Settings
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      General Settings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Site Maintenance Mode</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0CCE68]">
                          <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      API Configuration
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          API Base URL
                        </label>
                        <input 
                          type="text" 
                          value="https://api.techihub.io/api/v1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Loading Admin Dashboard...
          </h2>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}