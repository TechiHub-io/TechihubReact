// src/app/dashboard/jobseeker/applications/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJobSeeker } from '@/hooks/useJobSeeker';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText,
  Download,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { formatDistance, format } from 'date-fns';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id;
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const { fetchApplicationById, withdrawApplication, loading, error } = useJobSeeker();
  const [application, setApplication] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (isEmployer) {
      router.push('/dashboard/employer');
      return;
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Fetch application details
  useEffect(() => {
    const loadApplication = async () => {
      if (applicationId) {
        const data = await fetchApplicationById(applicationId);
        setApplication(data);
      }
    };
    
    loadApplication();
  }, [applicationId, fetchApplicationById]);
  
  // Handle withdraw application
  const handleWithdraw = async () => {
    if (await withdrawApplication(applicationId)) {
      // Update local state
      setApplication(prev => ({
        ...prev,
        status: 'withdrawn',
        status_display: 'Withdrawn'
      }));
      setShowWithdrawModal(false);
    }
  };
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  // Status colors mapping
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    screening: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    interview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    assessment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    hired: 'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };
  
  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <button 
              onClick={() => router.push('/dashboard/jobseeker/applications')}
              className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Not found state
  if (!application) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Application Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The application you're looking for couldn't be found.
            </p>
            <button 
              onClick={() => router.push('/dashboard/jobseeker/applications')}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded hover:bg-[#0BBE58]"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </button>
        
        {/* Application header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {application.job_title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <Building className="w-4 h-4 mr-2" />
                <span>{application.company_name}</span>
              </div>
              
              {application.job_location && (
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{application.job_location}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[application.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                {application.status_display || application.status}
              </span>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Applied: {formatDate(application.applied_date)}
              </div>
              
              {application.updated_at && application.updated_at !== application.applied_date && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {formatDate(application.updated_at)}
                </div>
              )}
            </div>
          </div>
          
          {/* Application timeline */}
          {application.status_history && application.status_history.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Application Timeline
              </h2>
              <div className="relative pl-8 space-y-6">
                {/* Vertical timeline line */}
                <div className="absolute top-0 left-3 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                {application.status_history.map((history, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-5 w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-[#0CCE68]' : 'bg-gray-400 dark:bg-gray-600'
                    }`}></div>
                    
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        {history.status_display || history.status}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>{formatDate(history.timestamp)}</span>
                      </div>
                      {history.notes && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Application actions */}
          <div className="mt-8 flex flex-wrap gap-3 justify-end">
            {application.status !== 'withdrawn' && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-4 py-2 border border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors text-sm font-medium"
              >
                Withdraw Application
              </button>
            )}
            
            {application.status === 'interview' && (
              <button
                onClick={() => router.push(`/messages?application=${application.id}`)}
                className="px-4 py-2 bg-[#0CCE68] text-white hover:bg-[#0BBE58] rounded-md transition-colors text-sm font-medium"
              >
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Recruiter
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Application details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Application Details
          </h2>
          
          {/* Resume */}
          {application.resume && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Resume/CV
                  </span>
                </div>
                <a
                  href={application.resume}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download
                </a>
              </div>
            </div>
          )}
          
          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Cover Letter
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}
          
          {/* Application Questions */}
          {application.answers && application.answers.length > 0 && (
            <div>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="flex items-center text-md font-medium text-gray-800 dark:text-gray-200 mb-2"
              >
                Application Questions
                {showAnswers ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </button>
              
              {showAnswers && (
                <div className="space-y-4">
                  {application.answers.map((answer, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {answer.question}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {answer.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Job details summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Job Summary
          </h2>
          
          {application.job_description && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {application.job_description.length > 300 
                  ? application.job_description.substring(0, 300) + '...' 
                  : application.job_description
                }
              </p>
              <button
                onClick={() => router.push(`/jobs/${application.job_id}`)}
                className="mt-2 text-sm text-[#0CCE68] hover:underline"
              >
                View full job details
              </button>
            </div>
          )}
          
          {/* Job skills */}
          {application.job_skills && application.job_skills.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {application.job_skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-medium">Withdraw Application</h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to withdraw your application for <strong>{application.job_title}</strong> at <strong>{application.company_name}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}