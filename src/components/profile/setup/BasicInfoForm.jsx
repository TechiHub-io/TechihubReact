// src/components/profile/setup/BasicInfoForm.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Briefcase, AlertCircle, Sparkles } from 'lucide-react';

export default function BasicInfoForm({ initialData, onSubmit, loading, error, clearError }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    country: '', // Changed from location to country
    website: '',
    bio: '',
    years_experience: 0,
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD'
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        job_title: initialData.job_title || '',
        country: initialData.country || initialData.location || '', // Map location to country
        website: initialData.website || '',
        bio: initialData.bio || '',
        years_experience: initialData.years_experience || 0,
        salary_min: initialData.salary_min || '',
        salary_max: initialData.salary_max || '',
        salary_currency: initialData.salary_currency || 'USD'
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission - format data to match API structure
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format data to match the expected API structure (like BasicInfoSection)
    const submissionData = {
      // User fields
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      
      // Profile fields
      job_title: formData.job_title,
      bio: formData.bio,
      years_experience: parseInt(formData.years_experience) || 0,
      country: formData.country,
      salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
      salary_currency: formData.salary_currency || 'USD'
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
          <User className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Let's Get to Know You
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share your basic information to create your professional profile
        </p>
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
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                placeholder="John"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              placeholder="Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer, UI/UX Designer"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              id="years_experience"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              min="0"
              max="50"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="e.g. United States, Remote"
              className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Portfolio Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Salary
            </label>
            <input
              type="number"
              id="salary_min"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
              min="0"
              placeholder="80000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Salary
            </label>
            <input
              type="number"
              id="salary_max"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
              min="0"
              placeholder="120000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="salary_currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              id="salary_currency"
              name="salary_currency"
              value={formData.salary_currency}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
        
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Professional Summary <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={5}
              maxLength={500}
              placeholder="Tell employers about your background, skills, and career goals. What makes you unique as a professional?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 resize-none"
            ></textarea>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.bio.length}/500
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            💡 Tip: Include your key skills, years of experience, and what you're passionate about
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0CCE68] to-blue-500 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving your information...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Save & Continue
            </span>
          )}
        </button>
      </form>
    </div>
  );
}