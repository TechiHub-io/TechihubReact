// src/app/applications/[id]/page.js 
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ApplicationStatusUpdate from '@/components/applications/ApplicationStatusUpdate';
import TeamComments from '@/components/applications/TeamComments';
import { useStore } from '@/hooks/useZustandStore';
import { useApplications } from '@/hooks/useApplications';

import { 
  MessageCircle, 
  Share2, 
  Eye, 
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage({ params }) {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSharing, setShowSharing] = useState(false);
  
  const { isAuthenticated, isEmployer, user } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    user: state.user
  }));
  
  const { 
    applications,
    currentApplication,
    fetchApplicationById,
    fetchApplications, 
    loading, 
    error 
  } = useApplications();
  
  
  // Unwrap params Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setApplicationId(resolvedParams.id);
    };
    
    unwrapParams();
  }, [params]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);
  
  // Load application data
  useEffect(() => {
    if (applicationId) {
      fetchApplicationById(applicationId);
    }
  }, [applicationId, fetchApplicationById, refreshKey]);
  
  // Load applications list for navigation (only once)
  useEffect(() => {
    const applicationsArray = Array.isArray(applications) ? applications : [];
    if (applicationsArray.length === 0) {
      fetchApplications();
    }
  }, [applications, fetchApplications]);
  
  // Get navigation info
  const getNavigationInfo = () => {
    // Ensure applications is an array and not null/undefined
    const applicationsArray = Array.isArray(applications) ? applications : [];
    
    if (applicationsArray.length === 0 || !currentApplication) {
      return { canGoNext: false, canGoPrevious: false, currentIndex: -1, total: 0 };
    }

    const currentIndex = applicationsArray.findIndex(app => app.id === currentApplication.id);
    
    // If current application is not found in the list, return safe defaults
    if (currentIndex === -1) {
      return { canGoNext: false, canGoPrevious: false, currentIndex: -1, total: applicationsArray.length };
    }

    return {
      canGoNext: currentIndex > 0, // Next means earlier in the list (newer applications)
      canGoPrevious: currentIndex < applicationsArray.length - 1, // Previous means later in the list (older applications)
      currentIndex,
      total: applicationsArray.length,
      nextId: currentIndex > 0 ? applicationsArray[currentIndex - 1].id : null,
      previousId: currentIndex < applicationsArray.length - 1 ? applicationsArray[currentIndex + 1].id : null
    };
  };

  const navigationInfo = getNavigationInfo();

  // Handle navigation
  const handleNavigation = (direction) => {
    const { nextId, previousId } = navigationInfo;
    
    if (direction === 'next' && nextId) {
      router.push(`/applications/${nextId}`);
    } else if (direction === 'previous' && previousId) {
      router.push(`/applications/${previousId}`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && navigationInfo.canGoPrevious) {
        handleNavigation('previous');
      } else if (event.key === 'ArrowRight' && navigationInfo.canGoNext) {
        handleNavigation('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigationInfo]);
  
  // Handle status update completion
  const handleStatusUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle notes update
  const handleNotesUpdated = (updatedNotes) => {
    if (currentApplication) {
      currentApplication.employer_notes = updatedNotes;
    }
  };

  // Format date helper
  const formatDate = (dateString, format = 'long') => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (format === 'short') {
      return date.toLocaleDateString();
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'assessment':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'offer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300';
    }
  };
  
  // Loading state
  if (!applicationId || (loading && !currentApplication)) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && !currentApplication) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Application Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The application you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
              {isEmployer && (
                <Link
                  href="/dashboard/employer/applications"
                  className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
                >
                  View All Applications
                </Link>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No application loaded yet
  if (!currentApplication) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract data from currentApplication based on actual structure
  const applicantName = currentApplication.user?.full_name || 'Unknown Applicant';
  const applicantEmail = currentApplication.user?.email || '';
  const applicantPhone = currentApplication.user?.phone || '';
  const jobTitle = currentApplication.job?.title || 'Unknown Position';
  const companyName = currentApplication.job?.company_name || 'Company';
  const applicationStatus = currentApplication.status_display || currentApplication.status;
  const appliedDate = currentApplication.applied_date;
  const updatedDate = currentApplication.updated_at;
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            
            {isEmployer && (
              <Link
                href="/dashboard/employer/applications"
                className="text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium"
              >
                View All Applications
              </Link>
            )}
          </div>
          
          {/* Application Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {applicantName}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {jobTitle}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied {formatDate(appliedDate)}
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    {applicantEmail && (
                      <a
                        href={`mailto:${applicantEmail}`}
                        className="flex items-center text-[#0CCE68] hover:text-[#0BBE58]"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {applicantEmail}
                      </a>
                    )}
                    {applicantPhone && (
                      <a
                        href={`tel:${applicantPhone}`}
                        className="flex items-center text-[#0CCE68] hover:text-[#0BBE58]"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {applicantPhone}
                      </a>
                    )}
                  </div>
                  
                  {updatedDate && updatedDate !== appliedDate && (
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      Last updated {formatDate(updatedDate)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Badge and Actions */}
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentApplication.status)}`}>
                  {applicationStatus}
                </span>
                
                {currentApplication.resume && (
                  <a 
                    href={currentApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Application Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Applicant Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{applicantName}</span>
                    </div>
                    {applicantEmail && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{applicantEmail}</span>
                      </div>
                    )}
                    {applicantPhone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{applicantPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{jobTitle}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{companyName}</span>
                    </div>
                    {currentApplication.job?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{currentApplication.job.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {currentApplication.cover_letter && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Cover Letter
                  </h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {currentApplication.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Application Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Application Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400 flex-1">Application Submitted</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(appliedDate, 'short')}
                    </span>
                  </div>
                  
                  {updatedDate && updatedDate !== appliedDate && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-400 flex-1">Status Updated</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatDate(updatedDate, 'short')}
                      </span>
                    </div>
                  )}
                  
                  {/* Status History */}
                  {currentApplication.status_history && currentApplication.status_history.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status History</h5>
                      <div className="space-y-1">
                        {currentApplication.status_history.slice(0, 3).map((status, index) => (
                          <div key={status.id} className="flex items-center text-xs">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-gray-600 dark:text-gray-400 flex-1">
                              {status.status_display}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatDate(status.created_at, 'short')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Section */}
              {currentApplication.resume && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Submitted Documents
                  </h4>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-8 h-8 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Resume
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF Document
                      </p>
                    </div>
                    <a
                      href={currentApplication.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-[#0CCE68] hover:text-[#0BBE58]"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Team Notes Section */}
            {isEmployer && (
              <TeamComments 
                applicationId={applicationId}
                application={currentApplication}
                onNotesUpdate={handleNotesUpdated}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Applicant Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Applicant Profile
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{applicantName}</p>
                </div>
                
                {applicantEmail && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</h4>
                    <p className="text-sm text-gray-900 dark:text-white">{applicantEmail}</p>
                  </div>
                )}
                
                {applicantPhone && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</h4>
                    <p className="text-sm text-gray-900 dark:text-white">{applicantPhone}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</h4>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentApplication.user?.email_verified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            {isEmployer && (
              <ApplicationStatusUpdate 
                applicationId={applicationId} 
                currentStatus={currentApplication.status} 
                onStatusUpdated={handleStatusUpdated}
              />
            )}
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {currentApplication.resume && (
                  <a
                    href={currentApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </a>
                )}
                
                {applicantEmail && (
                  <a
                    href={`mailto:${applicantEmail}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                )}
                
                <button
                  onClick={() => setShowSharing(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Application
                </button>
              </div>
            </div>
            
            {/* Application Navigation Card */}
            {navigationInfo.total > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Navigation
                </h3>
                
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Application {navigationInfo.currentIndex + 1} of {navigationInfo.total}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleNavigation('previous')}
                      disabled={!navigationInfo.canGoPrevious}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('next')}
                      disabled={!navigationInfo.canGoNext}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Use arrow keys to navigate
                  </div>
                </div>
              </div>
            )}

            {/* Application Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Application Progress
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600 dark:text-gray-400">Applied</span>
                  <span className="ml-auto text-gray-500 dark:text-gray-400">
                    {formatDate(appliedDate, 'short')}
                  </span>
                </div>
                
                <div className={`flex items-center text-sm ${
                  ['screening', 'interview', 'assessment', 'offer', 'hired'].includes(currentApplication.status) 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['screening', 'interview', 'assessment', 'offer', 'hired'].includes(currentApplication.status)
                      ? 'bg-yellow-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span>Screening</span>
                  {currentApplication.status === 'screening' && (
                    <span className="ml-auto text-[#0CCE68] text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                
                <div className={`flex items-center text-sm ${
                  ['interview', 'assessment', 'offer', 'hired'].includes(currentApplication.status)
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['interview', 'assessment', 'offer', 'hired'].includes(currentApplication.status)
                      ? 'bg-purple-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span>Interview</span>
                  {currentApplication.status === 'interview' && (
                    <span className="ml-auto text-[#0CCE68] text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                
                <div className={`flex items-center text-sm ${
                  ['assessment', 'offer', 'hired'].includes(currentApplication.status)
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['assessment', 'offer', 'hired'].includes(currentApplication.status)
                      ? 'bg-indigo-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span>Assessment</span>
                  {currentApplication.status === 'assessment' && (
                    <span className="ml-auto text-[#0CCE68] text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                
                <div className={`flex items-center text-sm ${
                  ['offer', 'hired'].includes(currentApplication.status)
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['offer', 'hired'].includes(currentApplication.status)
                      ? 'bg-orange-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span>Offer</span>
                  {currentApplication.status === 'offer' && (
                    <span className="ml-auto text-[#0CCE68] text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                
                <div className={`flex items-center text-sm ${
                  currentApplication.status === 'hired'
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    currentApplication.status === 'hired'
                      ? 'bg-green-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span>Hired</span>
                  {currentApplication.status === 'hired' && (
                    <span className="ml-auto text-[#0CCE68] text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Sharing Modal */}
        {showSharing && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSharing(false)} />
             
             <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                 <Share2 className="w-5 h-5 mr-2" />
                 Share Application
               </h3>
               
               <p className="text-gray-600 dark:text-gray-400 mb-6">
                 Share this application with your team members for review and collaboration.
               </p>
               
               <div className="flex space-x-3">
                 <button
                   onClick={() => setShowSharing(false)}
                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     setShowSharing(false);
                   }}
                   className="flex-1 px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
                 >
                   Share
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   </DashboardLayout>
 );
}