// src/components/admin/AdminJobEditForm.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminJobs } from '@/hooks/useAdminJobs';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminJobPostingForm from './AdminJobPostingForm';
import { 
  AlertCircle, 
  ArrowLeft, 
  Shield,
  Loader2,
  Save,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function AdminJobEditForm({ jobId }) {
  const router = useRouter();
  const { 
    fetchAdminJobById, 
    updateAdminJob, 
    loading, 
    error 
  } = useAdminJobs();
  
  const { 
    isAdmin, 
    accessibleCompanies, 
    hasCompanyAccess,
    companiesLoading 
  } = useAdminAuth();

  // State for job data and form
  const [jobData, setJobData] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [jobError, setJobError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load job data on component mount
  useEffect(() => {
    if (!isAdmin || !jobId) return;
    
    loadJobData();
  }, [isAdmin, jobId]);

  // Load job data
  const loadJobData = async () => {
    setLoadingJob(true);
    setJobError(null);
    
    try {
      const job = await fetchAdminJobById(jobId);
      
      if (!job) {
        setJobError('Job not found or you do not have permission to edit it.');
        return;
      }

      // Check if this is an admin-posted job
      if (!job.posted_by_admin) {
        setJobError('This job was not posted by an admin and cannot be edited through the admin interface.');
        return;
      }

      // Check if admin still has access to the company
      if (!hasCompanyAccess(job.company_id)) {
        setJobError('You no longer have access to the company this job belongs to.');
        return;
      }

      setJobData(job);
      
      // Transform job data to form format
      const formData = transformJobToFormData(job);
      setInitialFormData(formData);
      
    } catch (error) {
      console.error('Error loading job:', error);
      setJobError(error.message || 'Failed to load job data.');
    } finally {
      setLoadingJob(false);
    }
  };

  // Transform job data to form data format
  const transformJobToFormData = (job) => {
    // Determine application methods
    const applicationMethods = [];
    if (job.use_internal_application) {
      applicationMethods.push('internal');
    }
    if (job.application_url) {
      applicationMethods.push('external_url');
    }
    if (job.application_email) {
      applicationMethods.push('email');
    }

    return {
      // Basic job fields
      title: job.title || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      location: job.location || '',
      is_remote: job.is_remote || false,
      is_hybrid: job.is_hybrid || false,
      category: job.category || '',
      job_type: job.job_type || '',
      education_level: job.education_level || '',
      experience_level: job.experience_level || '',
      min_salary: job.min_salary || '',
      max_salary: job.max_salary || '',
      salary_currency: job.salary_currency || 'USD',
      is_salary_visible: job.is_salary_visible !== false,
      application_deadline: job.application_deadline || '',
      skills: job.skills || [],
      
      // Admin-specific fields
      companyId: job.company_id || '',
      applicationMethods: applicationMethods,
      applicationUrl: job.application_url || '',
      applicationEmail: job.application_email || '',
      
      // Preserve admin context
      posted_by_admin: true,
      is_active: job.is_active !== false
    };
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      // Preserve admin posting context
      const updatedFormData = {
        ...formData,
        posted_by_admin: true
      };

      await updateAdminJob(jobId, updatedFormData);
      
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      
      // Redirect to job management or job view
      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      throw error; // Let the form handle the error display
    }
  };

  // Handle form changes to track unsaved changes
  const handleFormChange = (hasChanges) => {
    setHasUnsavedChanges(hasChanges);
  };

  // Handle navigation away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Show loading state
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You need super admin privileges to edit jobs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingJob || companiesLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0CCE68] mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading job data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Job
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {jobError}
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/admin/jobs"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Management
              </Link>
              <button
                onClick={loadJobData}
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!initialFormData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No job data available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/jobs"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job Management
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {jobData && (
              <Link
                href={`/jobs/${jobData.id}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Job
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#0CCE68]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Admin Job
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {jobData?.title && `Editing: ${jobData.title}`}
            </p>
          </div>
        </div>

        {/* Unsaved changes warning */}
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                You have unsaved changes. Make sure to save before leaving this page.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Job Edit Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Admin context indicator */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Admin Job Editing
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  This job was posted by an admin and will maintain its admin posting context after editing.
                  {jobData && !hasCompanyAccess(jobData.company_id) && (
                    <span className="block mt-1 text-yellow-600 dark:text-yellow-400">
                      ⚠️ Note: You may have limited access to this company. Existing jobs can still be edited.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <AdminJobPostingForm
            initialData={initialFormData}
            isEdit={true}
            onSubmit={handleSubmit}
            onFormChange={handleFormChange}
            adminAccessibleCompanies={accessibleCompanies}
            preserveAdminContext={true}
            submitButtonText="Update Job"
            submitButtonIcon={Save}
          />
        </div>
      </div>
    </div>
  );
}