// src/components/jobs/JobDetailsView.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useJobs } from '@/hooks/useJobs';
import { useSavedJobs } from '@/hooks/useSavedJobs'; 
import { formatDate } from '@/lib/utils/date';
import SaveJobButton from './SaveJobButton'; 
import ContactEmployerButton from './ContactEmployerButton';
import WriteReviewButton from '@/components/reviews/WriteReviewButton';
import StarRating from '@/components/reviews/StarRating';
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  Globe, 
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function JobDetailsView({ jobId }) {
  const router = useRouter();
  const { currentJob, fetchJobById, toggleJobStatus, loading, error } = useJobs();
  
  // Add saved jobs hook for job seekers
  const { 
    isJobSaved, 
    saveJob, 
    unsaveJob, 
    loading: savingLoading 
  } = useSavedJobs();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  
  // Reference to track component mount status
  const isMounted = useRef(false);
  const dataFetched = useRef(false);
  
  // Get user info
  const { isEmployer, company } = useStore(state => ({
    isEmployer: state.isEmployer,
    company: state.company
  }));

  // Check if current user owns this job
  const isOwner = isEmployer && company && currentJob && 
    (currentJob.company_id === company.id || currentJob.company_name === company.name);

  // Helper function to safely render HTML content
  const createMarkup = (htmlContent) => {
    // If content is plain text (no HTML tags), convert line breaks to <br> tags
    if (htmlContent && !htmlContent.includes('<')) {
      return { __html: htmlContent.replace(/\n/g, '<br>') };
    }
    // If content already contains HTML, use it as is
    return { __html: htmlContent || '' };
  };

  // Helper function to check if content has meaningful text
  const hasContent = (htmlContent) => {
    if (!htmlContent) return false;
    // Remove HTML tags and check if there's actual text content
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };
  
  useEffect(() => {
    // Only load data once
    if (dataFetched.current) return;
    
    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        await fetchJobById(jobId);
        dataFetched.current = true;
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    isMounted.current = true;
    loadJob();
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [jobId]);
  
  // Handle job activation/deactivation
  const handleToggleStatus = async () => {
    if (!currentJob) return;
    
    try {
      await toggleJobStatus(currentJob.id, !currentJob.is_active);
      setSuccessMessage(`Job ${currentJob.is_active ? 'deactivated' : 'activated'} successfully!`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        if (isMounted.current) {
          setSuccessMessage('');
        }
      }, 3000);
    } catch (error) {
      console.error('Error toggling job status:', error);
    }
  };

  // Handle save job (for job seekers)
  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      setSuccessMessage('Job saved successfully!');
      setTimeout(() => {
        if (isMounted.current) {
          setSuccessMessage('');
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  // Handle unsave job (for job seekers)
  const handleUnsaveJob = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSuccessMessage('Job removed from saved jobs!');
      setTimeout(() => {
        if (isMounted.current) {
          setSuccessMessage('');
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };
  
  // Format salary range
  const formatSalaryRange = () => {
    if (!currentJob) return 'Not specified';
    
    const { min_salary, max_salary, salary_currency } = currentJob;
    
    if (!min_salary && !max_salary) return 'Not specified';
    
    if (min_salary && max_salary) {
      return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: salary_currency, maximumFractionDigits: 0 }).format(min_salary)} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: salary_currency, maximumFractionDigits: 0 }).format(max_salary)}`;
    }
    
    if (min_salary) {
      return `From ${new Intl.NumberFormat('en-US', { style: 'currency', currency: salary_currency, maximumFractionDigits: 0 }).format(min_salary)}`;
    }
    
    if (max_salary) {
      return `Up to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: salary_currency, maximumFractionDigits: 0 }).format(max_salary)}`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
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
  
  if (!currentJob) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-300 mb-4">
          Job posting not found
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
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-500 hover:text-[#0CCE68] mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Details
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Job Seeker Actions */}
          {!isEmployer && (
            <>
              <SaveJobButton
                jobId={jobId}
                isSaved={isJobSaved(jobId)}
                onSave={handleSaveJob}
                onUnsave={handleUnsaveJob}
                size="lg"
                showText={true}
              />
              <Link
                href={`/jobs/${jobId}/apply`}
                className="inline-flex items-center px-6 py-3 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
              >
                Apply Now
              </Link>
            </>
          )}
          
          {/* Employer Actions - Only for Job Owners */}
          {isEmployer && isOwner && (
            <>
              <Link
                href={`/jobs/${jobId}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Link>
              
              <button
                onClick={handleToggleStatus}
                className={`inline-flex items-center px-4 py-2 rounded-md ${
                  currentJob.is_active
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/30'
                }`}
              >
                {currentJob.is_active ? (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Deactivate Job
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Activate Job
                  </>
                )}
              </button>
            </>
          )}
          
          {/* Non-owner Employer View */}
          {isEmployer && !isOwner && (
            <div className="text-gray-500 dark:text-gray-400">
              <p>Posted by {currentJob.company_name}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}
      
      {/* Status and metrics bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 dark:text-gray-300">Status:</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentJob.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {currentJob.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {currentJob.view_count || 0}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Applications</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {currentJob.application_count || 0}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Posted</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(currentJob.created_at, 'short')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job title and company */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentJob.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentJob.company.name || 'Company Name'}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Briefcase className="w-4 h-4 mr-1.5" />
                <span>
                  {currentJob.job_type_display || currentJob.job_type}
                </span>
              </div>
              
              {currentJob.location && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>{currentJob.location}</span>
                </div>
              )}
              
              {currentJob.is_remote && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Globe className="w-4 h-4 mr-1.5" />
                  <span>Remote</span>
                </div>
              )}
              
              {currentJob.is_hybrid && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Globe className="w-4 h-4 mr-1.5" />
                  <span>Hybrid</span>
                </div>
              )}
              
              {currentJob.application_deadline && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>
                    Deadline: {formatDate(currentJob.application_deadline, 'short')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Company Info Section */}
          {currentJob?.company && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {currentJob.company.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentJob.company.name }
              </p>
              <div className="space-y-4">
                {/* Company Rating */}
                {currentJob.company.average_rating && (
                  <div className="flex items-center space-x-3">
                    <StarRating rating={Math.round(currentJob.company.average_rating)} size="sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentJob.company.average_rating.toFixed(1)} ({currentJob.company.review_count} reviews)
                    </span>
                  </div>
                )}
                
                {/* Company Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Industry:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{currentJob.company.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Size:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{currentJob.company.size}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`${isEmployer ? `/company/${currentJob.company.id}` : `/dashboard/jobseeker/companies/${currentJob.company.id}`}`}
                    className="text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium"
                  >
                    View Company Profile
                  </Link>
                  
                  {!isEmployer && (
                    <WriteReviewButton 
                      company={currentJob.company}
                      variant="link"
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Job description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h3>
            {hasContent(currentJob.description) ? (
              <div 
                className="job-content text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createMarkup(currentJob.description)}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
            )}
          </div>
          
          {/* Responsibilities */}
          {hasContent(currentJob.responsibilities) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Responsibilities
              </h3>
              <div 
                className="job-content text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createMarkup(currentJob.responsibilities)}
              />
            </div>
          )}
          
          {/* Requirements */}
          {hasContent(currentJob.requirements) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibent text-gray-900 dark:text-white mb-4">
                Requirements
              </h3>
              <div 
                className="job-content text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createMarkup(currentJob.requirements)}
              />
            </div>
          )}
          
          {/* Skills */}
          {currentJob.skills && currentJob.skills.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`px-3 py-1 rounded-full flex items-center ${
                      skill.is_required 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    {skill.is_required && (
                      <span className="ml-1 text-xs">(Required)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Benefits */}
          {hasContent(currentJob.benefits) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Benefits
              </h3>
              <div 
                className="job-content text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={createMarkup(currentJob.benefits)}
              />
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Details
            </h3>
            
            <div className="space-y-4">
              {/* Job Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {currentJob.job_type_display || currentJob.job_type}
                </p>
              </div>
              
              {/* Location */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentJob.location && (
                    <span className="text-gray-900 dark:text-white">{currentJob.location}</span>
                  )}
                  {currentJob.is_remote && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-xs">
                      Remote
                    </span>
                  )}
                  {currentJob.is_hybrid && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-full text-xs">
                      Hybrid
                    </span>
                  )}
                </div>
              </div>
              
              {/* Salary */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary Range
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {formatSalaryRange()}
                </p>
                {currentJob.is_salary_visible === false && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Hidden from applicants
                  </p>
                )}
              </div>
              
              {/* Experience */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {currentJob.experience_level_display || currentJob.experience_level || 'Not specified'}
                </p>
              </div>
              
              {/* Education */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education Level
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {currentJob.education_level_display || currentJob.education_level || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              {/* Job Seeker Actions */}
              {!isEmployer && (
                <>
                  <Link
                    href={`/jobs/${jobId}/apply`}
                    className="block w-full px-4 py-2 bg-[#0CCE68] text-white text-center rounded-md hover:bg-[#0BBE58]"
                  >
                    Apply for Job
                  </Link>
                  
                  <SaveJobButton
                    jobId={jobId}
                    isSaved={isJobSaved(jobId)}
                    onSave={handleSaveJob}
                    onUnsave={handleUnsaveJob}
                    size="md"
                    showText={true}
                    className="w-full justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  />

                  <ContactEmployerButton 
                    job={currentJob}
                    jobDetails={currentJob} 
                    variant="button"
                    size="md"
                    className="w-full"
                  />
                </>
              )}
              
              {/* Employer Actions - Only for Job Owners */}
              {isEmployer && isOwner && (
                <>
                  <Link
                    href={`/applications/${jobId}`}
                    className="block w-full px-4 py-2 bg-[#0CCE68] text-white text-center rounded-md hover:bg-[#0BBE58]"
                  >
                    View Applications
                  </Link>
                  
                  <Link
                    href={`/jobs/${jobId}/edit`}
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Edit Job
                  </Link>
                  
                  <button
                    onClick={handleToggleStatus}
                    className={`w-full px-4 py-2 text-center rounded-md ${
                      currentJob.is_active
                        ? 'border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    {currentJob.is_active ? 'Deactivate Job' : 'Activate Job'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}