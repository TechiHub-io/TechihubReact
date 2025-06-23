// src/app/company/[id]/edit/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/useCompany';
import { useStore } from '@/hooks/useZustandStore';
import { useNotification } from '@/hooks/useNotification';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowLeft, Save, Upload, Clock, Building, MapPin, Globe, Mail, Phone, CalendarDays } from 'lucide-react';

export default function CompanyProfileEditor() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id;
  
  // Get company data and actions from custom hook
  const { 
    company, 
    fetchCompany, 
    updateCompany, 
    uploadCompanyLogo,
    isUpdatingCompany, 
    isUploadingLogo, 
    error 
  } = useCompany();
  
  // Get user data from auth store
  const { user, isAuthenticated, isEmployer } = useStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  // Use notification hook for success/error messages
  const { showSuccess, showError } = useNotification();
  
  // Local state
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    size: '',
    website: '',
    email: '',
    phone: '',
    founding_date: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });
  
  // Check authentication and user type
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (!isEmployer) {
      router.push('/dashboard/jobseeker');
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Fetch company data when component mounts
  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId || !isAuthenticated || !isEmployer) return;
      
      setLoading(true);
      try {
        await fetchCompany(companyId);
      } catch (err) {
        showError(err.message || 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    
    loadCompany();
  }, [companyId, isAuthenticated, isEmployer]);
  
  // Update form data when company data changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        location: company.location || '',
        size: company.size || '',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        founding_date: company.founding_date || '',
        linkedin: company.linkedin || '',
        twitter: company.twitter || '',
        facebook: company.facebook || '',
        instagram: company.instagram || ''
      });
      
      if (company.logo) {
        setLogoPreview(company.logo);
      }
    }
  }, [company]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile) return;
    
    try {
      await uploadCompanyLogo(logoFile);
      showSuccess('Company logo updated successfully');
      setLogoFile(null); // Clear selected file
    } catch (err) {
      showError(err.message || 'Failed to upload logo');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateCompany({
        ...formData,
        id: companyId
      });
      
      showSuccess('Company profile updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update company profile');
    }
  };
  
  // Display error from the company hook
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);
  
  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-500 hover:text-[#0CCE68] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Company Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Update your company information to attract top talent
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Company logo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company Logo
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Company logo preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-center p-4">
                    <Building className="w-12 h-12 mx-auto mb-2" />
                    <p>No logo uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 w-full">
                <div className="relative">
                  <input
                    type="file"
                    id="logo-upload"
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="sr-only"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Logo
                  </label>
                </div>
                
                {logoFile && (
                  <button
                    onClick={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Clock className="animate-spin w-4 h-4 mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Recommended size: 400x400 pixels, max 2MB. 
                Square images work best.
              </p>
            </div>
          </div>
          
          {/* Right column - Company details form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                />
              </div>
              
              {/* Company description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                  placeholder="Tell potential candidates about your company..."
                ></textarea>
              </div>
              
              {/* Two columns layout for smaller fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry*
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                    placeholder="e.g. Technology, Healthcare, Finance"
                  />
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
                
                {/* Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Size
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1001-5000">1001-5000 employees</option>
                    <option value="5000+">5000+ employees</option>
                  </select>
                </div>
                
                {/* Founding Date */}
                <div>
                  <label htmlFor="founding_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Founding Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="founding_date"
                      name="founding_date"
                      value={formData.founding_date}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                        placeholder="info@example.com"
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Social Media
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                      placeholder="https://linkedin.com/company/example"
                    />
                  </div>
                  
                  {/* Twitter */}
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                      placeholder="https://twitter.com/example"
                    />
                  </div>
                  
                  {/* Facebook */}
                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                      placeholder="https://facebook.com/example"
                    />
                  </div>
                  
                  {/* Instagram */}
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700"
                      placeholder="https://instagram.com/example"
                    />
                  </div>
                </div>
              </div>
              
              {/* Form actions */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingCompany}
                  className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdatingCompany ? (
                    <>
                      <Clock className="animate-spin w-5 h-5 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Bottom actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard/employer')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => router.push(`/company/${companyId}`)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-[#0CCE68] bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              View Company Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}