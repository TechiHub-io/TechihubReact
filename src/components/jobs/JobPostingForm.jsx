// src/components/jobs/JobPostingForm.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/useCompany';
import { useJobs } from '@/hooks/useJobs'; // Use the hook instead of store directly
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Check,
  Globe,
  School,
  Clock
} from 'lucide-react';

export default function JobPostingForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { company } = useCompany();
  // Use the hook instead of directly accessing the store
  const { createJob, updateJob, loading, error, clearError } = useJobs();

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

  // New skill input state
  const [newSkill, setNewSkill] = useState({ name: '', is_required: true });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  // Load initial data if in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...initialData,
        company_id: initialData.company_id || company?.id,
        skills: initialData.skills || [] 
      });
    } else if (company) {
      setFormData(prev => ({
        ...prev,
        company_id: company.id
      }));
    }
  }, [isEdit, initialData, company]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle skill input changes
  const handleSkillChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSkill({
      ...newSkill,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add skill to the form data
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setFormData({
      ...formData,
      skills: [...formData.skills, { ...newSkill, id: Date.now() }]
    });
    setNewSkill({ name: '', is_required: true });
  };

  // Remove skill from the form data
  const handleRemoveSkill = (skillId) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill.id !== skillId)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (clearError) clearError();

    try {
      // Transform data as needed
      const jobData = {
        ...formData,
        min_salary: formData.min_salary ? Number(formData.min_salary) : null,
        max_salary: formData.max_salary ? Number(formData.max_salary) : null,
      };

      if (isEdit) {
        await updateJob(initialData.id, jobData);
        setSuccessMessage('Job updated successfully!');
      } else {
        const result = await createJob(jobData);
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
      }

      // Redirect after successful operation
      setTimeout(() => {
        router.push('/jobs/manage');
      }, 2000);
    } catch (err) {
      console.error('Error saving job:', err);
      // No need to set error state manually as the hook will handle it
    }
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
    'Marketing & Communications',
    'Sales & Business Development',
    'Customer Support',
    'Operations',
    'Human Resources',
    'Finance & Accounting',
    'Engineering',
    'Research & Development',
    'Quality Assurance',
    'DevOps & Infrastructure',
    'Other'
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
      </h1>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                placeholder="e.g. Senior Software Engineer"
              />
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
                required
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              >
                <option value="">Select Category</option>
                {jobCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Overview*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              placeholder="Provide a detailed description of the job..."
            />
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
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                placeholder="e.g. San Francisco, CA"
              />
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
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              placeholder="List the job requirements..."
            />
          </div>
          
          <div className="mt-4">
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              placeholder="List the job responsibilities..."
            />
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
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]"
            >
              Add Skill
            </button>
          </div>
          
          {/* Skills list */}
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(formData.skills) && formData.skills.map((skill) => (
              <div 
                key={skill.id || skill.name} 
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
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
                value={formData.min_salary}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                placeholder="e.g. 50000"
              />
            </div>
            
            <div>
              <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Salary
              </label>
              <input
                id="max_salary"
                name="max_salary"
                type="number"
                value={formData.max_salary}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
                placeholder="e.g. 80000"
              />
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
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
              placeholder="Describe the benefits and perks..."
            />
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
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
            />
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
            className="px-6 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}