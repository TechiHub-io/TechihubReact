// src/components/applications/ApplicationDetailView.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
import { formatDate } from '@/lib/utils/date';

import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Download, 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle
} from 'lucide-react';


const StatusTimeline = ({ application }) => {
  const statusHistory = application.status_history || [];
  
  const statusOrder = ['pending', 'reviewing', 'interview', 'offer', 'hired', 'rejected'];
  const currentStatusIndex = statusOrder.indexOf(application.status);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Application Progress
      </h3>
      
      <div className="space-y-4">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={status} className="flex items-center">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                isCompleted 
                  ? 'bg-[#0CCE68]' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`} />
              
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  isCurrent 
                    ? 'text-[#0CCE68]' 
                    : isCompleted 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
                
                {statusHistory.find(h => h.status === status) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(statusHistory.find(h => h.status === status).created_at, 'full')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ApplicationDetailView({ applicationId }) {
  const router = useRouter();
  const { 
    currentApplication, 
    fetchApplicationById, 
    updateApplicationStatus, 
    loading, 
    error 
  } = useApplications();
  
  // State for status update
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    notes: ''
  });
  
  // State for showing/hiding notes form
  const [showNotes, setShowNotes] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load application data
  useEffect(() => {
    if (applicationId) {
      fetchApplicationById(applicationId);
    }
  }, [applicationId, fetchApplicationById]);
  
  // Status options
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];
  
  // Handle status change
  const handleStatusChange = (e) => {
    setStatusUpdate({
      ...statusUpdate,
      status: e.target.value
    });
    
    // Show notes form when status is changed
    setShowNotes(true);
  };
  
  // Handle notes change
  const handleNotesChange = (e) => {
    setStatusUpdate({
      ...statusUpdate,
      notes: e.target.value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!statusUpdate.status) return;
    
    try {
      await updateApplicationStatus(applicationId, statusUpdate.status, statusUpdate.notes);
      
      // Show success message
      setSuccessMessage('Application status updated successfully');
      
      // Reset form
      setStatusUpdate({
        status: '',
        notes: ''
      });
      
      setShowNotes(false);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };
  
  // Helper to get status badge color
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'screening': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'interview': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'assessment': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'offer': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'withdrawn': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-700 dark:text-red-300 mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-[#0CCE68] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
    );
  }
  
  // No application found
  if (!currentApplication) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-300 mb-4">
          Application not found
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-[#0CCE68] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
    );
  }
  
  const { 
    applicant, 
    job, 
    status, 
    status_display, 
    applied_date, 
    resume, 
    cover_letter, 
    answers,
    status_history
  } = currentApplication;
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-500 hover:text-[#0CCE68] mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Application Details
        </h1>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}
      
      {/* Status and actions bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(status)}`}>
              {status_display}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Download resume */}
            {resume && (
              <a
                href={resume}
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </a>
            )}
            
            {/* Start conversation */}
            <Link
              href={`/messages/new?application=${applicationId}&applicant=${applicant?.id}`}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Applicant
            </Link>
          </div>
        </div>
      </div>
      
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Applicant info and application details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Job Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  {job?.title || 'Unknown Position'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {job?.company_name || 'Unknown Company'}
                </p>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on {formatDate(applied_date)}
                </span>
              </div>
              
              <div>
                <Link
                  href={`/jobs/${job?.id}`}
                  className="text-[#0CCE68] hover:underline text-sm"
                >
                  View Full Job Post
                </Link>
              </div>
            </div>
          </div>
          
          {/* Applicant details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Applicant Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {applicant?.name || 'Anonymous'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {applicant?.job_title || 'No title provided'}
                  </p>
                </div>
                
                {applicant?.profile_id && (
                  <Link
                    href={`/profile/${applicant.profile_id}`}
                    className="text-[#0CCE68] hover:underline text-sm"
                  >
                    View Full Profile
                  </Link>
                )}
              </div>
              
              {/* Contact details */}
              <div className="space-y-2">
                {applicant?.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <a 
                      href={`mailto:${applicant.email}`} 
                      className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                    >
                      {applicant.email}
                    </a>
                  </div>
                )}
                
                {applicant?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <a 
                      href={`tel:${applicant.phone}`} 
                      className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                    >
                      {applicant.phone}
                    </a>
                  </div>
                )}
                
                {applicant?.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {applicant.location}
                    </span>
                  </div>
                )}
                
                {applicant?.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <a 
                      href={applicant.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                    >
                      Personal Website
                    </a>
                  </div>
                )}
              </div>
              
              {/* Skills */}
              {applicant?.skills && applicant.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                      >
                        {skill.name}
                        {skill.level && <span className="ml-1 text-gray-500">({skill.level})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Experience */}
              {applicant?.experience && applicant.experience.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Experience
                  </h4>
                  <div className="space-y-3">
                    {applicant.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {exp.job_title} at {exp.company_name}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(exp.start_date, 'short')} - 
                          {exp.current_job ? ' Present' : ` ${formatDate(exp.end_date, 'short')}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Education */}
              {applicant?.education && applicant.education.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Education
                  </h4>
                  <div className="space-y-3">
                    {applicant.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {edu.degree} in {edu.field_of_study}
                        </h5>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(edu.start_date, 'short')} - 
                          {edu.current ? ' Present' : ` ${formatDate(edu.end_date, 'short')}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Cover Letter */}
          {cover_letter && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#0CCE68]" />
                Cover Letter
              </h2>
              
              <div className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
                {cover_letter}
              </div>
            </div>
          )}
          
          {/* Application Questions */}
          {answers && answers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#0CCE68]" />
                Application Questions
              </h2>
              
              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                      {answer.question}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {answer.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Status update and history */}
        <div className="space-y-6">
          {/* Status update form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Status
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={statusUpdate.status}
                  onChange={handleStatusChange}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {showNotes && (
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={statusUpdate.notes}
                    onChange={handleNotesChange}
                    placeholder="Add notes about this status change..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#0CCE68] focus:border-[#0CCE68] block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={!statusUpdate.status || loading}
                className="w-full px-4 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </form>
          </div>
          
          {/* Status history */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status History
            </h2>
            
            {status_history && status_history.length > 0 ? (
              <div className="space-y-4">
                {status_history.map((history, index) => (
                  <div 
                    key={index} 
                    className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    {/* Status indicator */}
                    <div className="absolute -left-1 top-0">
                      <div className={`w-2 h-2 rounded-full ${getStatusBadgeColor(history.status).split(' ')[0]}`}></div>
                    </div>
                    
                    {/* Status details */}
                    <div>
                      <div className="flex justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(history.status)}`}>
                          {history.status_display}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(history.created_at, 'datetime')}
                        </span>
                      </div>
                      
                      {/* User who made the change */}
                      {history.created_by && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          By: {history.created_by}
                        </p>
                      )}
                      
                      {/* Notes */}
                      {history.notes && (
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {history.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No status history available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

