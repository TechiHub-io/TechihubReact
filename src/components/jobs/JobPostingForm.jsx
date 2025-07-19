// src/components/jobs/JobPostingForm.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/useCompany';
import { useJobs } from '@/hooks/useJobs';
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
  X
} from 'lucide-react';

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

export default function JobPostingForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { company } = useCompany();
  const { createJob, updateJob, loading, error, clearError } = useJobs();

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

  // Form state
  const [formData, setFormData] = useState({
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
    company_id: '',
    skills: []
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // New skill input state
  const [newSkill, setNewSkill] = useState({ name: '', is_required: true });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  // Character limits
  const CHARACTER_LIMITS = {
    title: { min: 3, max: 100 },
    description: { min: 50, max: 5000 },
    responsibilities: { min: 20, max: 3000 },
    requirements: { min: 20, max: 3000 },
    benefits: { min: 10, max: 2000 },
    location: { min: 2, max: 100 }
  };

  const MAX_SKILLS = 15;

  // Currency salary ranges (annual in local currency)
  const SALARY_RANGES = {
    USD: { min: 200, max: 1000000 },
    EUR: { min: 180, max: 900000 },
    GBP: { min: 150, max: 800000 },
    CAD: { min: 250, max: 1200000 },
    AUD: { min: 300, max: 1200000 },
    JPY: { min: 200, max: 100000000 },
    INR: { min: 300, max: 50000000 },
    KES: { min: 500, max: 30000000 },
    NGN: { min: 100, max: 100000000 },
    ZAR: { min: 200, max: 5000000 }
  };

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
              setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
              }));
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

  // Load initial data
  useEffect(() => {
    if (isEdit && initialData) {
      const data = {
        ...initialData,
        company_id: initialData.company_id || company?.id,
        skills: initialData.skills || []
      };
      setFormData(data);
      
      // Update Quill editors with initial data
      Object.keys(quillInstances).forEach(field => {
        if (quillInstances[field] && data[field]) {
          quillInstances[field].root.innerHTML = data[field];
        }
      });
    } else if (company) {
      setFormData(prev => ({
        ...prev,
        company_id: company.id
      }));
    }
  }, [isEdit, initialData, company, quillInstances]);

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors[name] = 'Job title is required';
        } else if (value.length < CHARACTER_LIMITS.title.min) {
          errors[name] = `Title must be at least ${CHARACTER_LIMITS.title.min} characters`;
        } else if (value.length > CHARACTER_LIMITS.title.max) {
          errors[name] = `Title must not exceed ${CHARACTER_LIMITS.title.max} characters`;
        }
        break;

      case 'description':
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        if (!textContent) {
          errors[name] = 'Job description is required';
        } else if (textContent.length < CHARACTER_LIMITS.description.min) {
          errors[name] = `Description must be at least ${CHARACTER_LIMITS.description.min} characters`;
        } else if (textContent.length > CHARACTER_LIMITS.description.max) {
          errors[name] = `Description must not exceed ${CHARACTER_LIMITS.description.max} characters`;
        }
        break;

      case 'responsibilities':
        if (value) {
          const textContent = value.replace(/<[^>]*>/g, '').trim();
          if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.responsibilities.min) {
            errors[name] = `Responsibilities must be at least ${CHARACTER_LIMITS.responsibilities.min} characters`;
          } else if (textContent.length > CHARACTER_LIMITS.responsibilities.max) {
            errors[name] = `Responsibilities must not exceed ${CHARACTER_LIMITS.responsibilities.max} characters`;
          }
        }
        break;

      case 'requirements':
        if (value) {
          const textContent = value.replace(/<[^>]*>/g, '').trim();
          if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.requirements.min) {
            errors[name] = `Requirements must be at least ${CHARACTER_LIMITS.requirements.min} characters`;
          } else if (textContent.length > CHARACTER_LIMITS.requirements.max) {
            errors[name] = `Requirements must not exceed ${CHARACTER_LIMITS.requirements.max} characters`;
          }
        }
        break;

      case 'benefits':
        if (value) {
          const textContent = value.replace(/<[^>]*>/g, '').trim();
          if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.benefits.min) {
            errors[name] = `Benefits must be at least ${CHARACTER_LIMITS.benefits.min} characters`;
          } else if (textContent.length > CHARACTER_LIMITS.benefits.max) {
            errors[name] = `Benefits must not exceed ${CHARACTER_LIMITS.benefits.max} characters`;
          }
        }
        break;

      case 'category':
        if (!value) {
          errors[name] = 'Job category is required';
        }
        break;

      case 'location':
        if (value && value.length < CHARACTER_LIMITS.location.min) {
          errors[name] = `Location must be at least ${CHARACTER_LIMITS.location.min} characters`;
        } else if (value.length > CHARACTER_LIMITS.location.max) {
          errors[name] = `Location must not exceed ${CHARACTER_LIMITS.location.max} characters`;
        }
        break;

      case 'min_salary':
        if (value) {
          const numValue = Number(value);
          const range = SALARY_RANGES[formData.salary_currency];
          if (isNaN(numValue) || numValue < 0) {
            errors[name] = 'Minimum salary must be a positive number';
          } else if (numValue < range.min || numValue > range.max) {
            errors[name] = `Minimum salary should be between ${range.min.toLocaleString()} and ${range.max.toLocaleString()} ${formData.salary_currency}`;
          }
        }
        break;

      case 'max_salary':
        if (value) {
          const numValue = Number(value);
          const minSalary = Number(formData.min_salary);
          const range = SALARY_RANGES[formData.salary_currency];
          if (isNaN(numValue) || numValue < 0) {
            errors[name] = 'Maximum salary must be a positive number';
          } else if (numValue < range.min || numValue > range.max) {
            errors[name] = `Maximum salary should be between ${range.min.toLocaleString()} and ${range.max.toLocaleString()} ${formData.salary_currency}`;
          } else if (minSalary && numValue <= minSalary) {
            errors[name] = 'Maximum salary must be greater than minimum salary';
          }
        }
        break;

      case 'application_deadline':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate <= today) {
            errors[name] = 'Application deadline must be in the future';
          }
        }
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });

    // Skills validation
    if (formData.skills.length === 0) {
      errors.skills = 'At least one skill is recommended';
    } else if (formData.skills.length > MAX_SKILLS) {
      errors.skills = `Maximum ${MAX_SKILLS} skills allowed`;
    }

    return errors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Real-time validation
    if (touched[name]) {
      const fieldErrors = validateField(name, newValue);
      setValidationErrors(prev => ({
        ...prev,
        ...fieldErrors,
        [name]: fieldErrors[name] || undefined
      }));
    }

    // Clear global error
    if (error && clearError) {
      clearError();
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
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
      setValidationErrors(prev => ({
        ...prev,
        skills: `Maximum ${MAX_SKILLS} skills allowed`
      }));
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

    // Clear skills validation error
    if (validationErrors.skills) {
      setValidationErrors(prev => ({
        ...prev,
        skills: undefined
      }));
    }
  };

  // Remove skill from the form data
  const handleRemoveSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // Validate form
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (clearError) clearError();

    try {
      // Convert rich text to strings for database storage
      const jobData = {
        ...formData,
        description: formData.description || '',
        responsibilities: formData.responsibilities || '',
        requirements: formData.requirements || '',
        benefits: formData.benefits || '',
        min_salary: formData.min_salary ? Number(formData.min_salary) : null,
        max_salary: formData.max_salary ? Number(formData.max_salary) : null,
      };

      if (isEdit) {
        await updateJob(initialData.id, jobData);
        setSuccessMessage('Job updated successfully!');
      } else {
        await createJob(jobData);
        setSuccessMessage('Job created successfully!');
        
        // Clear form for new entry
        setFormData({
          ...formData,
          title: '',
          description: '',
          responsibilities: '',
          requirements: '',
          benefits: '',
          location: '',
          skills: []
        });

        // Clear Quill editors
        Object.values(quillInstances).forEach(quill => {
          if (quill) {
            quill.setContents([]);
          }
        });
      }

      // Redirect after successful operation
      setTimeout(() => {
        router.push('/jobs/manage');
      }, 2000);
    } catch (err) {
      console.error('Error saving job:', err);
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
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive Level' }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h1>
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
        
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-[#0CCE68]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
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
              
              <div>
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
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education Level
                </label>
                <select
                  id="education_level"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
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
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
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
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
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
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Salary
              </label>
              <input
                id="min_salary"
                name="min_salary"
                type="number"
                min="0"
                value={formData.min_salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
                  validationErrors.min_salary ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g. 50000"
              />
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
              <input
                id="max_salary"
                name="max_salary"
                type="number"
                min="0"
                value={formData.max_salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
                  validationErrors.max_salary ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g. 80000"
              />
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
              <select
                id="salary_currency"
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
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
            <input
              id="application_deadline"
              name="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent ${
                validationErrors.application_deadline ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {validationErrors.application_deadline && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.application_deadline}
              </p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/jobs/manage')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && <Clock className="animate-spin w-4 h-4 mr-2" />}
            {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}