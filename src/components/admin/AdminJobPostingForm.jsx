// src/components/admin/AdminJobPostingForm.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminJobs } from '@/hooks/useAdminJobs';
import { useAdminJobValidation } from '@/hooks/useAdminJobValidation';
import { useAdminJobErrorHandler } from '@/hooks/useErrorHandler';
import { useAdminJobLoadingState } from '@/hooks/useLoadingState';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Check,
  Globe,
  School,
  Clock,
  AlertCircle,
  X,
  Building2,
  HelpCircle,
  Info
} from 'lucide-react';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CompanySelector from '@/components/admin/CompanySelector';
import ApplicationMethodSelector, { APPLICATION_METHODS } from '@/components/admin/ApplicationMethodSelector';
import { LoadingButton, Spinner, InlineLoader } from '@/components/ui/LoadingIndicators';
import Tooltip from '@/components/ui/Tooltip';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { getAllCurrencies, getSalaryRange, getCurrencySymbol } from '@/lib/utils/currencyUtils';
import { 
  validateAdminJobForm, 
  validateSingleField, 
  hasValidationErrors, 
  getFirstErrorField,
  CHARACTER_LIMITS,
  MAX_SKILLS 
} from '@/lib/utils/adminJobValidation';

// Load Quill dynamically
const loadQuill = () => {
  return new Promise((resolve) => {
    if (window.Quill) {
      resolve(window.Quill);
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
    script.onload = () => resolve(window.Quill);
    document.head.appendChild(script);
  });
};

export default function AdminJobPostingForm({ 
  initialData = null, 
  isEdit = false,
  onSubmit = null,
  onFormChange = null,
  adminAccessibleCompanies = null,
  preserveAdminContext = false,
  submitButtonText = null,
  submitButtonIcon = null
}) {
  const router = useRouter();
  const { 
    isAdmin, 
    accessibleCompanies: defaultAccessibleCompanies, 
    companiesLoading, 
    companiesError,
    hasCompanyAccess,
    getCompanyById 
  } = useAdminAuth();

  const { 
    createAdminJob, 
    updateAdminJob, 
    loading, 
    error, 
    clearError 
  } = useAdminJobs();

  // Loading state management - must be declared before using setCompaniesLoading
  const {
    isJobCreating,
    isJobUpdating,
    isCompaniesLoading,
    setJobCreating,
    setJobUpdating,
    setCompaniesLoading,
    canCreateJob,
    canEditJob
  } = useAdminJobLoadingState();

  // Use passed companies or default from hook
  const accessibleCompanies = adminAccessibleCompanies || defaultAccessibleCompanies;

  // Success message state - must be declared before error handler
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error handling with retry mechanisms
  const {
    error: errorHandlerError,
    isRetrying,
    hasError,
    executeJobCreation,
    executeJobUpdate,
    handleJobCreationError,
    handleJobUpdateError,
    clearError: clearHandlerError,
    canRetry,
    retry,
    getErrorSummary
  } = useAdminJobErrorHandler({
    onError: (processedError, rawError) => {
      console.error('Admin job form error:', processedError, rawError);
      setSuccessMessage(''); // Clear success message on error
    }
  });

  // Sync companies loading state - now setCompaniesLoading is available
  useEffect(() => {
    if (companiesLoading !== isCompaniesLoading) {
      setCompaniesLoading(companiesLoading);
    }
  }, [companiesLoading, isCompaniesLoading, setCompaniesLoading]);

  // Refs for rich text editors
  const descriptionRef = useRef(null);
  const responsibilitiesRef = useRef(null);
  const requirementsRef = useRef(null);
  const benefitsRef = useRef(null);

  // Quill instances
  const [quillInstances, setQuillInstances] = useState({
    description: null,
    responsibilities: null,
    requirements: null,
    benefits: null
  });

  // Form state - extended for admin functionality
  const [formData, setFormData] = useState({
    // Basic job fields
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    location: '',
    is_remote: false,
    is_hybrid: false,
    category: '',
    job_type: 'full_time',
    education_level: 'bachelor',
    experience_level: 'mid',
    min_salary: '',
    max_salary: '',
    salary_currency: 'USD',
    is_salary_visible: true,
    application_deadline: '',
    skills: [],
    
    // Admin-specific fields
    companyId: '',
    applicationMethods: [APPLICATION_METHODS.INTERNAL],
    applicationUrl: '',
    applicationEmail: '',
    postedByAdmin: true
  });

  // Admin job validation hook
  const {
    validationErrors,
    hasErrors,
    validateAndSetFieldError,
    handleFieldChange,
    handleFieldBlur,
    handleFormSubmit,
    clearAllErrors,
    clearFieldError,
    getFieldProps
  } = useAdminJobValidation(formData);

  // New skill input state
  const [newSkill, setNewSkill] = useState({ name: '', is_required: true });
  
  // Confirmation dialog state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Manual retry function
  const handleRetry = async () => {
    if (!canRetry) return;
    
    setIsSubmitting(true);
    
    // Set appropriate loading state
    if (isEdit) {
      setJobUpdating(initialData?.id, true);
    } else {
      setJobCreating(true);
    }
    
    try {
      await retry(async () => {
        if (isEdit) {
          return await updateAdminJob(initialData.id, formData);
        } else {
          return await createAdminJob(formData);
        }
      });
      setSuccessMessage(isEdit ? 'Job updated successfully!' : 'Job created successfully!');
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsSubmitting(false);
      
      // Clear loading states
      if (isEdit) {
        setJobUpdating(initialData?.id, false);
      } else {
        setJobCreating(false);
      }
    }
  };

  // Character limits and max skills are now imported from validation utility

  // Load currencies data
  const [currencies] = useState(() => getAllCurrencies());
  
  // Get salary range function
  const getSalaryRangeForValidation = (currencyCode) => {
    return getSalaryRange(currencyCode);
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [isAdmin, router]);

  // Initialize Quill editors
  useEffect(() => {
    const initQuill = async () => {
      const Quill = await loadQuill();
      
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ];

      const initEditor = (ref, field) => {
        if (ref.current && !quillInstances[field]) {
          const quill = new Quill(ref.current, {
            theme: 'snow',
            modules: {
              toolbar: toolbarOptions
            },
            placeholder: `Enter ${field}...`
          });

          // Set initial content
          if (formData[field]) {
            quill.root.innerHTML = formData[field];
          }

          // Handle content changes
          quill.on('text-change', () => {
            const content = quill.root.innerHTML;
            setFormData(prev => ({
              ...prev,
              [field]: content
            }));
            
            // Clear validation error for this field
            if (validationErrors[field]) {
              clearFieldError(field);
            }
          });

          return quill;
        }
        return null;
      };

      setQuillInstances({
        description: initEditor(descriptionRef, 'description'),
        responsibilities: initEditor(responsibilitiesRef, 'responsibilities'),
        requirements: initEditor(requirementsRef, 'requirements'),
        benefits: initEditor(benefitsRef, 'benefits')
      });
    };

    initQuill();
  }, []);

  // Track initial form data for change detection
  const [initialFormData, setInitialFormData] = useState(null);

  // Load initial data
  useEffect(() => {
    if (isEdit && initialData) {
      console.log('🔄 Loading initial job data for editing:', initialData);
      
      // Transform skills from API format to form format
      const transformedSkills = (initialData.required_skills || initialData.skills || []).map((skill, index) => {
        if (typeof skill === 'string') {
          return { 
            id: `skill-${index}-${Date.now()}`, 
            name: skill, 
            is_required: true 
          };
        } else if (skill && typeof skill === 'object') {
          return {
            id: skill.id || `skill-${index}-${Date.now()}`,
            name: skill.skill || skill.name || skill,
            is_required: skill.is_required !== undefined ? skill.is_required : true
          };
        }
        return { 
          id: `skill-${index}-${Date.now()}`, 
          name: String(skill), 
          is_required: true 
        };
      });

      const data = {
        ...initialData,
        // Company ID - use company_id from API or company.id if company object is provided
        companyId: initialData.company_id || initialData.company?.id || initialData.companyId || '',
        // Transform skills to form format
        skills: transformedSkills,
        // Map existing application method data
        applicationMethods: getApplicationMethodsFromData(initialData),
        applicationUrl: initialData.application_url || '',
        applicationEmail: initialData.application_email || '',
        postedByAdmin: initialData.posted_by_admin || true
      };
      
      console.log('🔄 Transformed form data:', {
        companyId: data.companyId,
        skills: data.skills,
        title: data.title
      });
      
      setFormData(data);
      setInitialFormData(data);
      
      // Update Quill editors with initial data
      Object.keys(quillInstances).forEach(field => {
        if (quillInstances[field] && data[field]) {
          quillInstances[field].root.innerHTML = data[field];
        }
      });
    }
  }, [isEdit, initialData, quillInstances]);

  // Track form changes and notify parent component
  useEffect(() => {
    if (onFormChange && initialFormData) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      onFormChange(hasChanges);
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, initialFormData, onFormChange]);

  // Helper function to extract application methods from existing data
  const getApplicationMethodsFromData = (data) => {
    const methods = [];
    if (data.use_internal_application) {
      methods.push(APPLICATION_METHODS.INTERNAL);
    }
    if (data.application_url) {
      methods.push(APPLICATION_METHODS.EXTERNAL_URL);
    }
    if (data.application_email) {
      methods.push(APPLICATION_METHODS.EMAIL);
    }
    return methods.length > 0 ? methods : [APPLICATION_METHODS.INTERNAL];
  };

  // Validation is now handled by the useAdminJobValidation hook

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: newValue
      };
      
      // Handle field change with validation
      handleFieldChange(name, newValue, updatedData);
      
      return updatedData;
    });

    // Clear global error
    if (error && clearError) {
      clearError();
    }
  };

  // Handle company selection
  const handleCompanySelect = (companyId) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        companyId
      };
      
      // Handle field change with validation
      handleFieldChange('companyId', companyId, updatedData);
      
      return updatedData;
    });
  };

  // Handle application method changes
  const handleApplicationMethodChange = (methods) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        applicationMethods: methods
      };
      
      // Handle field change with validation
      handleFieldChange('applicationMethods', methods, updatedData);
      
      return updatedData;
    });
  };

  const handleApplicationUrlChange = (url) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        applicationUrl: url
      };
      
      // Handle field change with validation
      handleFieldChange('applicationUrl', url, updatedData);
      
      return updatedData;
    });
  };

  const handleApplicationEmailChange = (email) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        applicationEmail: email
      };
      
      // Handle field change with validation
      handleFieldChange('applicationEmail', email, updatedData);
      
      return updatedData;
    });
  };

  // Handle field blur - now uses validation hook
  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleFieldBlur(name, value, formData);
  };

  // Handle skill input changes
  const handleSkillChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add skill to the form data
  const handleAddSkill = (e) => {
    e.preventDefault();
    
    if (!newSkill.name.trim()) {
      return;
    }

    if (formData.skills.length >= MAX_SKILLS) {
      handleFieldChange('skills', formData.skills, { ...formData, skills: [...formData.skills, { ...newSkill, id: Date.now() }] });
      return;
    }

    // Check for duplicate skills
    const isDuplicate = formData.skills.some(
      skill => skill.name.toLowerCase() === newSkill.name.toLowerCase()
    );

    if (isDuplicate) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, id: Date.now() }]
    }));

    setNewSkill({ name: '', is_required: true });

    // Validate skills after adding
    const updatedSkills = [...formData.skills, { ...newSkill, id: Date.now() }];
    handleFieldChange('skills', updatedSkills, { ...formData, skills: updatedSkills });
  };

  // Remove skill from the form data
  const handleRemoveSkill = (skillId) => {
    setFormData(prev => {
      const updatedSkills = prev.skills.filter(skill => skill.id !== skillId);
      const updatedData = {
        ...prev,
        skills: updatedSkills
      };
      
      // Validate skills after removal
      handleFieldChange('skills', updatedSkills, updatedData);
      
      return updatedData;
    });
  };

  // Handle form submission with admin context
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form using the validation hook
    const { isValid, errors } = handleFormSubmit(formData);
    
    if (!isValid) {
      return;
    }

    // Clear previous errors
    if (clearError) clearError();
    clearHandlerError();
    setIsSubmitting(true);
    setSuccessMessage('');

    // Set appropriate loading state
    if (isEdit) {
      setJobUpdating(initialData?.id, true);
    } else {
      setJobCreating(true);
    }

    try {
      let result;
      
      // Use custom onSubmit if provided, otherwise use default behavior
      if (onSubmit) {
        result = await onSubmit(formData);
        setSuccessMessage(isEdit ? 'Job updated successfully!' : 'Job created successfully!');
      } else {
        if (isEdit) {
          // Execute job update with error handling and retry
          result = await executeJobUpdate(async () => {
            return await updateAdminJob(initialData.id, formData);
          });
          setSuccessMessage('Job updated successfully!');
        } else {
          // Execute job creation with error handling and retry
          result = await executeJobCreation(async () => {
            return await createAdminJob(formData);
          });
          setSuccessMessage('Job created successfully!');
          
          // Clear form for new entry
          const clearedFormData = {
            ...formData,
            title: '',
            description: '',
            responsibilities: '',
            requirements: '',
            benefits: '',
            location: '',
            skills: [],
            companyId: '',
            applicationMethods: [APPLICATION_METHODS.INTERNAL],
            applicationUrl: '',
            applicationEmail: ''
          };
          
          setFormData(clearedFormData);
          
          // Clear validation errors
          clearAllErrors();

          // Clear Quill editors
          Object.values(quillInstances).forEach(quill => {
            if (quill) {
              quill.setContents([]);
            }
          });
        }

        // Redirect after successful operation (only if no custom onSubmit)
        setTimeout(() => {
          router.push('/dashboard/admin?tab=jobs');
        }, 2000);
      }
      
      return result;
    } catch (err) {
      // Error is handled by the error handler hook
      console.error('Error saving admin job:', err);
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
      
      // Clear loading states
      if (isEdit) {
        setJobUpdating(initialData?.id, false);
      } else {
        setJobCreating(false);
      }
    }
  };

  // Helper function to get character count from rich text
  const getCharacterCount = (htmlContent) => {
    return htmlContent.replace(/<[^>]*>/g, '').trim().length;
  };

  // Job types options
  const jobTypes = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  // Education levels options
  const educationLevels = [
    { value: 'high_school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'other', label: 'Other' }
  ];

  // Experience levels options
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level: 0-2 years' },
    { value: 'mid', label: 'Mid Level: 3-5 years' },
    { value: 'senior', label: 'Senior Level: 6-9 years' },
    { value: 'executive', label: 'Executive Level: 10+ yrs' }
  ];

  // Job categories
  const jobCategories = [
    'Software Development',
    'Data Science & Analytics',
    'Design & UX',
    'Product Management',
    'Customer Support',
    'Operations',
    'Engineering',
    'Research & Development',
    'Quality Assurance',
    'DevOps & Infrastructure',
  ];

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Job Posting (Admin)' : 'Create New Job Posting (Admin)'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Post a job on behalf of a company you have access to.
          </p>
        </div>
      
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Error message with retry */}
        {(error || hasError) && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <div className="text-sm text-red-700 dark:text-red-300">
                  {hasError ? getErrorSummary()?.message : error}
                </div>
                {hasError && getErrorSummary()?.details && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {getErrorSummary().details}
                  </div>
                )}
                {canRetry && (
                  <div className="mt-3 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isSubmitting || isRetrying}
                      className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 text-xs font-medium rounded text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRetrying ? 'Retrying...' : 'Retry'}
                    </button>
                    <span className="text-xs text-red-600 dark:text-red-400">
                      Attempt {getErrorSummary()?.retryCount || 0} of {getErrorSummary()?.maxRetries || 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Companies error */}
        {companiesError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{companiesError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {hasErrors && Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                  {Object.entries(validationErrors)
                    .filter(([_, error]) => error)
                    .slice(0, 5) // Show only first 5 errors
                    .map(([field, error]) => (
                      <li key={field}>
                        {field === 'companyId' ? 'Company Selection' : 
                         field === 'applicationMethods' ? 'Application Methods' :
                         field === 'applicationUrl' ? 'Application URL' :
                         field === 'applicationEmail' ? 'Application Email' :
                         field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}: {error}
                      </li>
                    ))}
                  {Object.keys(validationErrors).filter(key => validationErrors[key]).length > 5 && (
                    <li className="text-xs">...and {Object.keys(validationErrors).filter(key => validationErrors[key]).length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Admin Company Selection */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-md border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Company Selection (Admin)
              <Tooltip 
                content="As an admin, you can post jobs on behalf of companies you have access to. Select the company this job posting should be associated with."
                position="top"
              >
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </h2>
            
            <div className="space-y-4">
              <CompanySelector
                companies={accessibleCompanies}
                selectedCompanyId={formData.companyId}
                onCompanySelect={handleCompanySelect}
                loading={companiesLoading || isCompaniesLoading}
                error={validationErrors.companyId}
                placeholder="Select a company to post job for..."
                className="w-full"
              />
              
              {formData.companyId && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Selected Company:
                  </h4>
                  {(() => {
                    const selectedCompany = getCompanyById(formData.companyId);
                    return selectedCompany ? (
                      <div className="flex items-center space-x-3">
                        {selectedCompany.logo ? (
                          <img
                            src={selectedCompany.logo}
                            alt={selectedCompany.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {selectedCompany.name}
                          </div>
                          {selectedCompany.location && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedCompany.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Application Methods */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Methods</h2>
                <Tooltip 
                  content="Choose how job seekers can apply for this position. You can enable multiple methods to give applicants flexibility in how they submit their applications."
                  position="top"
                >
                  <HelpCircle className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                </Tooltip>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Tip:</strong> Internal applications are processed through TechHub's system and provide better tracking. 
                    External URLs redirect to your company's career page, while email applications allow direct contact.
                  </div>
                </div>
              </div>
            </div>
            <ApplicationMethodSelector
              selectedMethods={formData.applicationMethods}
              applicationUrl={formData.applicationUrl}
              applicationEmail={formData.applicationEmail}
              onMethodChange={handleApplicationMethodChange}
              onUrlChange={handleApplicationUrlChange}
              onEmailChange={handleApplicationEmailChange}
              errors={{
                applicationUrl: validationErrors.applicationUrl,
                applicationEmail: validationErrors.applicationEmail,
                general: validationErrors.applicationMethods
              }}
              allowMultiple={false}
            />
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Basic Information
              <Tooltip 
                content="Provide the essential details about the job position. A clear, descriptive title and comprehensive overview help attract the right candidates."
                position="top"
              >
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 ${
                    validationErrors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g. Senior Software Engineer"
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.title.length}/{CHARACTER_LIMITS.title.max} characters
                </p>
              </div>
              
              <div className="lg:col-span-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 ${
                    validationErrors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Category</option>
                  {jobCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.category}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Overview*
              </label>
              <div 
                ref={descriptionRef} 
                className={`min-h-[120px] bg-white dark:bg-gray-800 border rounded-md ${
                  validationErrors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getCharacterCount(formData.description)}/{CHARACTER_LIMITS.description.max} characters
              </p>
            </div>
          </div>          

          {/* Location and Work Type */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Location & Work Type
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 ${
                    validationErrors.location ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g. San Francisco, CA"
                />
                {validationErrors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.location}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type*
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="is_remote"
                  name="is_remote"
                  type="checkbox"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 rounded"
                />
                <label htmlFor="is_remote" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remote Work
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="is_hybrid"
                  name="is_hybrid"
                  type="checkbox"
                  checked={formData.is_hybrid}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 rounded"
                />
                <label htmlFor="is_hybrid" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Hybrid Work
                </label>
              </div>
            </div>
          </div>
          
          {/* Qualifications */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Qualifications
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education Level
                </label>
                <select
                  id="education_level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200"
                >
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience_level"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requirements
              </label>
              <div 
                ref={requirementsRef} 
                className={`min-h-[100px] bg-white dark:bg-gray-800 border rounded-md ${
                  validationErrors.requirements ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.requirements && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.requirements}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getCharacterCount(formData.requirements)}/{CHARACTER_LIMITS.requirements.max} characters
              </p>
            </div>
            
            <div className="mt-4">
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Responsibilities
              </label>
              <div 
                ref={responsibilitiesRef} 
                className={`min-h-[100px] bg-white dark:bg-gray-800 border rounded-md ${
                  validationErrors.responsibilities ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.responsibilities && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.responsibilities}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getCharacterCount(formData.responsibilities)}/{CHARACTER_LIMITS.responsibilities.max} characters
              </p>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Skills
              <Tooltip 
                content="Add relevant skills for this position. Mark skills as 'Required' if they are essential, or leave unchecked for preferred/nice-to-have skills."
                position="top"
              >
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </h2>
            
            {/* Add skill form */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                name="name"
                value={newSkill.name}
                onChange={handleSkillChange}
                placeholder="Add a skill (e.g. JavaScript, Python)"
                maxLength={50}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200"
              />
              
              <div className="flex items-center">
                <input
                  id="is_required"
                  name="is_required"
                  type="checkbox"
                  checked={newSkill.is_required}
                  onChange={handleSkillChange}
                  className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 rounded"
                />
                <label htmlFor="is_required" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Required Skill
                </label>
              </div>
              
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkill.name.trim() || formData.skills.length >= MAX_SKILLS}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Skill
              </button>
            </div>
            
            {/* Skills validation error */}
            {validationErrors.skills && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.skills}
              </p>
            )}
            
            {/* Skills list */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(formData.skills) && formData.skills.map((skill) => (
                <div 
                  key={skill.id || skill.name} 
                  className={`px-3 py-1 rounded-full flex items-center ${
                    skill.is_required 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>{skill.name}</span>
                  {skill.is_required && (
                    <span className="ml-1 text-xs">(Required)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formData.skills.length}/{MAX_SKILLS} skills added
            </p>
          </div>
          
          {/* Compensation */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Compensation
              <Tooltip 
                content="Specify the salary range and benefits. Transparent compensation information helps attract qualified candidates and reduces time spent on mismatched applications."
                position="top"
              >
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                    {getCurrencySymbol(formData.salary_currency)}
                  </span>
                  <input
                    id="min_salary"
                    name="min_salary"
                    type="number"
                    min="0"
                    value={formData.min_salary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 pl-10 pr-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 ${
                      validationErrors.min_salary ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g. 50000"
                  />
                </div>
                {validationErrors.min_salary && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.min_salary}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                    {getCurrencySymbol(formData.salary_currency)}
                  </span>
                  <input
                    id="max_salary"
                    name="max_salary"
                    type="number"
                    min="0"
                    value={formData.max_salary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 pl-10 pr-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 ${
                      validationErrors.max_salary ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g. 80000"
                  />
                </div>
                {validationErrors.max_salary && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.max_salary}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="salary_currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <SearchableSelect
                  id="salary_currency"
                  name="salary_currency"
                  options={currencies}
                  value={formData.salary_currency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select currency..."
                  searchPlaceholder="Search currencies..."
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                id="is_salary_visible"
                name="is_salary_visible"
                type="checkbox"
                checked={formData.is_salary_visible}
                onChange={handleChange}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 rounded"
              />
              <label htmlFor="is_salary_visible" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Display salary range to applicants
              </label>
            </div>
            
            <div className="mt-4">
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Benefits
              </label>
              <div 
                ref={benefitsRef} 
                className={`min-h-[100px] bg-white dark:bg-gray-800 border rounded-md ${
                  validationErrors.benefits ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {validationErrors.benefits && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.benefits}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getCharacterCount(formData.benefits)}/{CHARACTER_LIMITS.benefits.max} characters
              </p>
            </div>
          </div>
          
          {/* Application Details */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Application Details
            </h2>
            
            <div>
              <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Application Deadline
              </label>
              <div className="relative">
                <input
                  id="application_deadline"
                  name="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 pr-10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 transition-all duration-200 cursor-pointer ${
                    validationErrors.application_deadline ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={(e) => e.target.showPicker?.()}
                />
                <Calendar 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                  aria-hidden="true"
                />
              </div>
              {validationErrors.application_deadline && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.application_deadline}
                </p>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => {
                if (hasUnsavedChanges) {
                  setShowCancelConfirm(true);
                } else {
                  router.push('/dashboard/admin?tab=jobs');
                }
              }}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            
            <LoadingButton
              type="submit"
              loading={loading || isSubmitting || isJobCreating || (isEdit && isJobUpdating(initialData?.id))}
              loadingText={isEdit ? 'Updating Job...' : 'Creating Job...'}
              disabled={!formData.companyId || hasErrors || !canCreateJob || (isEdit && !canEditJob(initialData?.id))}
              size="md"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {submitButtonText || (isEdit ? 'Update Job' : 'Create Job')}
            </LoadingButton>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          router.push('/dashboard/admin?tab=jobs');
        }}
        title="Discard Changes?"
        message="You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="warning"
      />
    </div>
  );
}