// src/components/profile/setup/EducationForm.jsx
import React, { useState, useEffect } from 'react';
import { School, BookOpen, Calendar, AlertCircle, Clock, GraduationCap, Award } from 'lucide-react';

export default function EducationForm({ initialData, onSubmit, onSkip, loading, error, clearError }) {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });
  
  const degreeOptions = [
    { value: 'undergraduate', label: "Bachelor's Degree" },
    { value: 'postgraduate', label: "Bachelor's Degree Post graduate" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'other', label: 'Other' }
  ];

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        institution: initialData.institution || '',
        degree: initialData.degree || '',
        field_of_study: initialData.field_of_study || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        current: initialData.current || false,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format dates before submission
    const submissionData = {
      ...formData,
      start_date: formatDate(formData.start_date),
      end_date: formData.current ? null : formatDate(formData.end_date)
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mb-4">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Educational Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Share your educational background and achievements
            </p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium hover:underline transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <School className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              placeholder="e.g. Harvard University, MIT, Stanford"
              className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Degree <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Award className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 appearance-none"
              >
                <option value="">Select degree type</option>
                {degreeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Field of Study <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="field_of_study"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                required
                placeholder="e.g. Computer Science, Engineering"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date {!formData.current && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={formData.current}
                required={!formData.current}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <input
            id="current"
            name="current"
            type="checkbox"
            checked={formData.current}
            onChange={handleChange}
            className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="current" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            I am currently studying here
          </label>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your studies, achievements, honors, relevant coursework, or extracurricular activities..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 resize-none"
          ></textarea>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            💡 Include GPA (if impressive), honors, relevant projects, or leadership roles
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Saving education...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Save & Continue
            </span>
          )}
        </button>
      </form>
    </div>
  );
}