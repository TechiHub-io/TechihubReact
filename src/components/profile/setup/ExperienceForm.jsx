// src/components/profile/setup/ExperienceForm.jsx
import React, { useState, useEffect } from 'react';
import { Building, Briefcase, MapPin, Calendar, Link2, AlertCircle, Clock, Star } from 'lucide-react';

export default function ExperienceForm({ initialData, onSubmit, onSkip, loading, error, clearError }) {
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    location: '',
    start_date: '',
    end_date: '',
    current_job: false,
    description: '',
    portfolio_link: ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        job_title: initialData.job_title || '',
        location: initialData.location || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        current_job: initialData.current_job || false,
        description: initialData.description || '',
        portfolio_link: initialData.portfolio_link || ''
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
      end_date: formData.current_job ? null : formatDate(formData.end_date)
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mb-4">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add your most recent or relevant work experience
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="e.g. Google, Microsoft, Startup Inc."
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Star className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Software Engineer"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA or Remote"
              className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
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
              End Date {!formData.current_job && <span className="text-red-500">*</span>}
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
                disabled={formData.current_job}
                required={!formData.current_job}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <input
            id="current_job"
            name="current_job"
            type="checkbox"
            checked={formData.current_job}
            onChange={handleChange}
            className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="current_job" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            I currently work here
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
            placeholder="Describe your responsibilities, achievements, and key projects. What impact did you make?"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 resize-none"
          ></textarea>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            💡 Include specific achievements, technologies used, and quantifiable results
          </p>
        </div>
        
        <div>
          <label htmlFor="portfolio_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Portfolio Link
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="portfolio_link"
              name="portfolio_link"
              value={formData.portfolio_link}
              onChange={handleChange}
              placeholder="https://github.com/yourproject or https://live-demo.com"
              className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Link to a specific project or work result from this position
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Saving experience...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Save & Continue
            </span>
          )}
        </button>
      </form>
    </div>
  );
}