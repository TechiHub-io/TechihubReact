// src/components/applications/JobApplicationForm.jsx - Enhanced version with optional cover letter
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useDocuments } from '@/hooks/useDocuments';
import { useStore } from '@/hooks/useZustandStore';
import { formatDate } from '@/lib/utils/date';
import currenciesData from '@/data/currencies.json';
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  X,
  Plus,
  ExternalLink
} from 'lucide-react';

export default function JobApplicationForm({ jobId }) {
  const router = useRouter();
  const { currentJob, fetchJobById, loading: jobLoading } = useJobs();
  const { 
    submitApplication, 
    fetchJobQuestions, 
    loading: submitting, 
    error, 
    fieldErrors, // Add field errors
    clearError 
  } = useApplications();
  const {
    resumes, 
    coverLetters, 
    portfolioUrls, 
    loading: documentsLoading,
    getDefaultResume,
    getDefaultCoverLetter,
    getDefaultPortfolio,
  } = useDocuments();

  // Convert currencies object to array for easier use
  const currenciesArray = Object.entries(currenciesData).map(([code, currency]) => ({
    code,
    name: currency.name,
    symbol: currency.symbol,
    country: currency.country
  }));

  // Form state
  const [formData, setFormData] = useState({
    coverLetter: '',
    coverLetterType: 'text', // 'text' or 'file'
    coverLetterFile: null,
    resume: null,
    resumeType: 'existing', // 'existing' or 'new'
    existingResumeId: '',
    portfolioUrl: '',
    portfolioType: 'existing', // 'existing' or 'new'
    existingPortfolioId: '',
    expectedSalary: '',
    expectedSalaryCurrency: 'USD',
    availableStartDate: '',
    additionalInfo: '',
    answers: {}
  });

  const validateForm = () => {
    const errors = [];

    // Resume validation (required)
    if (formData.resumeType === 'new' && !formData.resume) {
      errors.push('Please upload your resume.');
    }

    if (formData.resumeType === 'existing' && !formData.existingResumeId) {
      errors.push('Please select a resume or upload a new one.');
    }

    // Cover letter validation (optional - only validate if user provides one)
    if (formData.coverLetterType === 'text' && formData.coverLetter.trim() && formData.coverLetter.length < 10) {
      errors.push('Cover letter must be at least 10 characters long.');
    }

    if (formData.coverLetterType === 'file' && formData.coverLetterFile) {
      // If user uploads a file, validate it's the right type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(formData.coverLetterFile.type)) {
        errors.push('Cover letter file must be PDF, DOC, or DOCX format.');
      }
    }

    // Portfolio validation - if existing is selected but no portfolio available
    if (formData.portfolioType === 'existing') {
      if (portfolioUrls.length === 0) {
        // Not an error, just switch to new type
        setFormData(prev => ({ ...prev, portfolioType: 'new' }));
      }
    }

    // New portfolio URL validation
    if (formData.portfolioType === 'new' && formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      errors.push('Please enter a valid portfolio URL.');
    }

    // Required questions validation
    const requiredQuestions = questions.filter(q => q.is_required);
    for (const question of requiredQuestions) {
      if (!formData.answers[question.id] || !formData.answers[question.id].trim()) {
        errors.push(`Please answer the required question: ${question.question}`);
      }
    }

    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Application questions
  const [questions, setQuestions] = useState([]);
  
  // UI state
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [resumePreview, setResumePreview] = useState(null);

  // Load job details and questions
  useEffect(() => {
    const loadJobData = async () => {
      if (!jobId) return;
      
      try {
        await fetchJobById(jobId);
        
        try {
          const jobQuestions = await fetchJobQuestions(jobId);
          setQuestions(jobQuestions || []);
        } catch (err) {
          console.error('No custom questions for this job', err);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error loading job data:', error);
      }
    };

    loadJobData();
  }, [jobId, fetchJobById, fetchJobQuestions]);

  // Set default values when documents load
  useEffect(() => {
    if (!documentsLoading && resumes.length > 0) {
      const defaultResume = getDefaultResume();
      const defaultCoverLetter = getDefaultCoverLetter();
      const defaultPortfolio = getDefaultPortfolio();
      
      setFormData(prev => ({
        ...prev,
        expectedSalaryCurrency: currentJob?.salary_currency || 'USD',
        existingResumeId: defaultResume?.id || '',
        existingPortfolioId: defaultPortfolio?.id || '',
        portfolioUrl: defaultPortfolio?.url || ''
      }));

      // Set cover letter text if available
      if (defaultCoverLetter && defaultCoverLetter.file) {
        // If it's a text-based cover letter, we might need to fetch content
        // For now, keep it empty and let user choose
      }
    }
  }, [documentsLoading, resumes, currentJob, getDefaultResume, getDefaultCoverLetter, getDefaultPortfolio]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle question answers
  const handleAnswerChange = (questionId, answer) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  // Handle file upload
  const handleFileUpload = (files, fileType = 'resume') => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document.');
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      alert('File size must be less than 1MB.');
      return;
    }

    if (fileType === 'resume') {
      setFormData(prev => ({
        ...prev,
        resume: file,
        resumeType: 'new'
      }));

      setResumePreview({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    } else if (fileType === 'cover_letter') {
      setFormData(prev => ({
        ...prev,
        coverLetterFile: file,
        coverLetterType: 'file'
      }));
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, 'resume');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      // Get portfolio URL based on selection
      let portfolioUrl = '';
      if (formData.portfolioType === 'existing' && formData.existingPortfolioId) {
        const selectedPortfolio = portfolioUrls.find(p => p.id === formData.existingPortfolioId);
        portfolioUrl = selectedPortfolio?.url || '';
      } else if (formData.portfolioType === 'new') {
        portfolioUrl = formData.portfolioUrl;
      }

      // Prepare application data
      const applicationData = {
        // Resume handling (required)
        resume: formData.resumeType === 'new' ? formData.resume : null,
        // existing_resume_id: formData.resumeType === 'existing' ? formData.existingResumeId : null,
        
        // Cover letter handling (optional - only include if provided)
        cover_letter: (formData.coverLetterType === 'text' && formData.coverLetter.trim()) ? formData.coverLetter : null,
        cover_letter_file: (formData.coverLetterType === 'file' && formData.coverLetterFile) ? formData.coverLetterFile : null,
        
        // Portfolio URL
        portfolio_url: portfolioUrl || null,
        
        // Salary with currency
        expected_salary: formData.expectedSalary ? parseFloat(formData.expectedSalary) : null,
        expected_salary_currency: formData.expectedSalaryCurrency,
        
        // Other fields
        available_start_date: formData.availableStartDate || null,
        additional_info: formData.additionalInfo || null,
        answers: Object.keys(formData.answers).length > 0 ? formData.answers : null
      };
      if (formData.resumeType === 'existing' && formData.existingResumeId) {
        const selectedResume = resumes.find(r => r.id === formData.existingResumeId);
        if (selectedResume) {
          applicationData.resume = selectedResume.file; // Use the file URL from the existing resume
        }
      }

      await submitApplication(jobId, applicationData);
      setStep(3); // Move to success step
    } catch (error) {
      console.error('Application submission failed:', error);
      // Error is already handled in the hook
    }
  };

  // Format salary display with proper currency symbol and formatting
  const formatSalary = () => {
    if (!currentJob?.is_salary_visible || (!currentJob?.min_salary && !currentJob?.max_salary)) {
      return null;
    }

    const currencyCode = currentJob.salary_currency || 'USD';
    const currency = currenciesData[currencyCode] || currenciesData['USD'];
    const symbol = currency.symbol;

    // Format numbers with commas
    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num);
    };

    if (currentJob.min_salary && currentJob.max_salary) {
      return `${symbol}${formatNumber(currentJob.min_salary)} - ${symbol}${formatNumber(currentJob.max_salary)} ${currencyCode}`;
    } else if (currentJob.min_salary) {
      return `From ${symbol}${formatNumber(currentJob.min_salary)} ${currencyCode}`;
    } else if (currentJob.max_salary) {
      return `Up to ${symbol}${formatNumber(currentJob.max_salary)} ${currencyCode}`;
    }
  };

  if (jobLoading || documentsLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Job not found or no longer available.</span>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center text-[#0CCE68] hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
      </div>
    );
  }

  // Success step
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Application Submitted!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your application for <strong>{currentJob.title}</strong> at <strong>{currentJob.company_name}</strong> has been successfully submitted.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard/jobseeker/applications')}
              className="w-full px-6 py-3 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
            >
              View My Applications
            </button>
            
            <button
              onClick={() => router.push('/dashboard/jobseeker/jobs/search')}
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Find More Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const salaryDisplay = formatSalary();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {(error || (fieldErrors && Object.keys(fieldErrors).length > 0)) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {/* General error */}
              {error && (
                <p className="text-red-700 dark:text-red-400 font-medium mb-2">
                  {error}
                </p>
              )}
              
              {/* Field-specific errors */}
              {fieldErrors && Object.keys(fieldErrors).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(fieldErrors).map(([field, messages]) => (
                    <div key={field}>
                      {Array.isArray(messages) ? (
                        messages.map((message, index) => (
                          <p key={index} className="text-red-700 dark:text-red-400 text-sm">
                            <span className="font-medium capitalize">{field.replace('_', ' ')}:</span> {message}
                          </p>
                        ))
                      ) : (
                        <p className="text-red-700 dark:text-red-400 text-sm">
                          <span className="font-medium capitalize">{field.replace('_', ' ')}:</span> {messages}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-500 hover:text-[#0CCE68] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Job
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Apply for Position
        </h1>
      </div>

      {/* Job Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentJob.title}
            </h2>
            
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
              <Building2 className="w-4 h-4 mr-2" />
              <span>{currentJob.company_name}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{currentJob.job_type_display || currentJob.job_type}</span>
              </div>
              
              {currentJob.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{currentJob.location}</span>
                </div>
              )}
              
              {salaryDisplay && (
                <div className="flex items-center text-[#0CCE68] font-medium">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{salaryDisplay}</span>
                </div>
              )}
              
              {currentJob.application_deadline && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Deadline: {formatDate(currentJob.application_deadline, 'short')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Resume Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resume *
          </h3>
          
          {/* Resume Type Selection */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="resumeType"
                  value="existing"
                  checked={formData.resumeType === 'existing'}
                  onChange={handleInputChange}
                  className="text-[#0CCE68] focus:ring-[#0CCE68]"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Use existing resume
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="resumeType"
                  value="new"
                  checked={formData.resumeType === 'new'}
                  onChange={handleInputChange}
                  className="text-[#0CCE68] focus:ring-[#0CCE68]"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Upload new resume
                </span>
              </label>
            </div>
          </div>

          {/* Existing Resume Selection */}
          {formData.resumeType === 'existing' && (
            <div className="space-y-3">
              {resumes.length > 0 ? (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <label key={resume.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="existingResumeId"
                        value={resume.id}
                        checked={formData.existingResumeId === resume.id}
                        onChange={handleInputChange}
                        className="text-[#0CCE68] focus:ring-[#0CCE68]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {resume.label}
                              {resume.is_default && (
                                <span className="ml-2 px-2 py-0.5 bg-[#0CCE68] text-white text-xs rounded">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Uploaded {formatDate(resume.created_at, 'short')}
                            </p>
                          </div>
                          <a
                            href={resume.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No saved resumes found. Upload a new resume below.
                </p>
              )}
            </div>
          )}

          {/* New Resume Upload */}
          {formData.resumeType === 'new' && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                  ? 'border-[#0CCE68] bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#0CCE68]'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {resumePreview ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="w-12 h-12 text-[#0CCE68]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resumePreview.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resumePreview.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, resume: null }));
                      setResumePreview(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Drop your resume here, or{' '}
                      <label className="text-[#0CCE68] hover:text-[#0BBE58] cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e.target.files, 'resume')}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PDF, DOC, or DOCX (Max 1MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cover Letter Section - Made Optional */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cover Letter
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Optional - Providing a cover letter can help strengthen your application
          </p>
          
          {/* Cover Letter Type Selection */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coverLetterType"
                  value="text"
                  checked={formData.coverLetterType === 'text'}
                  onChange={handleInputChange}
                  className="text-[#0CCE68] focus:ring-[#0CCE68]"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Write cover letter
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coverLetterType"
                  value="file"
                  checked={formData.coverLetterType === 'file'}
                  onChange={handleInputChange}
                  className="text-[#0CCE68] focus:ring-[#0CCE68]"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Upload cover letter file
                </span>
              </label>
            </div>
          </div>

          {/* Text Cover Letter */}
          {formData.coverLetterType === 'text' && (
            <div>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                placeholder="Tell us why you're interested in this position and how your experience makes you a great fit... (Optional)"
              />
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formData.coverLetter.length}/2000 characters
              </p>
            </div>
          )}

          {/* File Cover Letter */}
          {formData.coverLetterType === 'file' && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#0CCE68] transition-colors">
              {formData.coverLetterFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#0CCE68]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formData.coverLetterFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(formData.coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverLetterFile: null }))}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                 >
                   Remove
                 </button>
               </div>
             ) : (
               <div className="space-y-4">
                 <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                 <div>
                   <label className="text-[#0CCE68] hover:text-[#0BBE58] cursor-pointer">
                     Upload cover letter (Optional)
                     <input
                       type="file"
                       className="hidden"
                       accept=".pdf,.doc,.docx"
                       onChange={(e) => handleFileUpload(e.target.files, 'cover_letter')}
                     />
                   </label>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                     PDF, DOC, or DOCX (Max 1MB)
                   </p>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>

       {/* Additional Information */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
           Additional Information
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Portfolio URL */}
           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Portfolio URL
             </label>
             
             {/* Portfolio Type Selection */}
             <div className="mb-3">
               <div className="flex space-x-4">
                 <label className="flex items-center">
                   <input
                     type="radio"
                     name="portfolioType"
                     value="existing"
                     checked={formData.portfolioType === 'existing'}
                     onChange={handleInputChange}
                     disabled={portfolioUrls.length === 0}
                     className="text-[#0CCE68] focus:ring-[#0CCE68] disabled:opacity-50"
                   />
                   <span className={`ml-2 text-sm ${portfolioUrls.length === 0 ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                     Use saved portfolio {portfolioUrls.length === 0 && '(None available)'}
                   </span>
                 </label>
                 <label className="flex items-center">
                   <input
                     type="radio"
                     name="portfolioType"
                     value="new"
                     checked={formData.portfolioType === 'new'}
                     onChange={handleInputChange}
                     className="text-[#0CCE68] focus:ring-[#0CCE68]"
                   />
                   <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                     Enter new URL
                   </span>
                 </label>
               </div>
             </div>

             {/* Existing Portfolio Selection */}
             {formData.portfolioType === 'existing' && portfolioUrls.length > 0 && (
               <select
                 name="existingPortfolioId"
                 value={formData.existingPortfolioId}
                 onChange={handleInputChange}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
               >
                 <option value="">Select a portfolio (Optional)</option>
                 {portfolioUrls.map((portfolio) => (
                   <option key={portfolio.id} value={portfolio.id}>
                     {portfolio.label} - {portfolio.url}
                   </option>
                 ))}
               </select>
             )}

             {/* New Portfolio URL */}
             {(formData.portfolioType === 'new' || portfolioUrls.length === 0) && (
               <input
                 type="url"
                 name="portfolioUrl"
                 value={formData.portfolioUrl}
                 onChange={handleInputChange}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                 placeholder="https://your-portfolio.com (Optional)"
               />
             )}
             
             {portfolioUrls.length === 0 && (
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                 You can also leave this empty if you don't have a portfolio to share.
               </p>
             )}
           </div>
           
           {/* Expected Salary with Enhanced Currency Selection */}
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Expected Salary (Optional)
             </label>
             <div className="flex">
               <select
                 name="expectedSalaryCurrency"
                 value={formData.expectedSalaryCurrency}
                 onChange={handleInputChange}
                 className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent border-r-0 w-32"
               >
                 {currenciesArray.map((currency) => (
                   <option key={currency.code} value={currency.code}>
                     {currency.code} ({currency.symbol})
                   </option>
                 ))}
               </select>
               <input
                 type="number"
                 name="expectedSalary"
                 value={formData.expectedSalary}
                 onChange={handleInputChange}
                 className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                 placeholder="50000"
               />
             </div>
             {formData.expectedSalary && formData.expectedSalaryCurrency && (
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                 {(() => {
                   const currency = currenciesData[formData.expectedSalaryCurrency];
                   const symbol = currency?.symbol || '$';
                   const formatted = new Intl.NumberFormat('en-US').format(formData.expectedSalary);
                   return `${symbol}${formatted} ${formData.expectedSalaryCurrency}`;
                 })()}
               </p>
             )}
           </div>
           
           {/* Available Start Date */}
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Available Start Date
             </label>
             <input
               type="date"
               name="availableStartDate"
               value={formData.availableStartDate}
               onChange={handleInputChange}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
             />
           </div>
         </div>
         
         <div className="mt-6">
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Additional Notes
           </label>
           <textarea
             name="additionalInfo"
             value={formData.additionalInfo}
             onChange={handleInputChange}
             rows={4}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
             placeholder="Any additional information you'd like to share..."
           />
         </div>
       </div>

       {/* Custom Questions */}
       {questions.length > 0 && (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             Additional Questions
           </h3>
           
           <div className="space-y-6">
             {questions.map((question) => (
               <div key={question.id}>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {question.question}
                   {question.is_required && <span className="text-red-500 ml-1">*</span>}
                 </label>
                 
                 {question.description && (
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                     {question.description}
                   </p>
                 )}
                 
                 {question.question_type === 'text' && (
                   <input
                     type="text"
                     value={formData.answers[question.id] || ''}
                     onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                     required={question.is_required}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                   />
                 )}
                 
                 {question.question_type === 'textarea' && (
                   <textarea
                     value={formData.answers[question.id] || ''}
                     onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                     required={question.is_required}
                     rows={4}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                   />
                 )}
                 
                 {question.question_type === 'boolean' && (
                   <div className="flex items-center space-x-4">
                     <label className="flex items-center">
                       <input
                         type="radio"
                         name={`question_${question.id}`}
                         value="true"
                         checked={formData.answers[question.id] === 'true'}
                         onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                         required={question.is_required}
                         className="text-[#0CCE68] focus:ring-[#0CCE68]"
                       />
                       <span className="ml-2 text-sm text-gray-900 dark:text-white">Yes</span>
                     </label>
                     <label className="flex items-center">
                       <input
                         type="radio"
                         name={`question_${question.id}`}
                         value="false"
                         checked={formData.answers[question.id] === 'false'}
                         onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                         required={question.is_required}
                         className="text-[#0CCE68] focus:ring-[#0CCE68]"
                       />
                       <span className="ml-2 text-sm text-gray-900 dark:text-white">No</span>
                     </label>
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Submit Button */}
       <div className="flex justify-end space-x-4">
         <button
           type="button"
           onClick={() => router.back()}
           className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
         >
           Cancel
         </button>
         
         <button
           type="submit"
           disabled={submitting}
           className="px-6 py-3 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
         >
           {submitting ? (
             <>
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
               Submitting...
             </>
           ) : (
             'Submit Application'
           )}
         </button>
       </div>
     </form>
   </div>
 );
}