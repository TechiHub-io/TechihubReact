// src/components/company/setup/CompanyDetailsForm.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import Cookies from 'js-cookie';
import { 
  Building, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building2, 
  LinkIcon, 
  Facebook, 
  Twitter, 
  Linkedin,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function CompanyDetailsForm({ onComplete }) {
  const { createCompany, updateCompany, isCreatingCompany, isUpdatingCompany, error, company } = useStore(state => ({
    createCompany: state.createCompany,
    updateCompany: state.updateCompany,
    isCreatingCompany: state.isCreatingCompany,
    isUpdatingCompany: state.isUpdatingCompany,
    error: state.error,
    company: state.company
  }));

  const initialFormData = {
    name: '',
    industry: '',
    location: '',
    size: '',
    founding_date: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    linkedin: '',
    twitter: '',
    facebook: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill form if company exists
  useEffect(() => {
    const companyId = Cookies.get('company_id');
    const hasCompany = Cookies.get('has_company') === 'true';
    
    if (company && company.id && companyId && hasCompany) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        location: company.location || '',
        size: company.size || '',
        founding_date: company.founding_date || '',
        description: company.description || '',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        linkedin: company.linkedin || '',
        twitter: company.twitter || '',
        facebook: company.facebook || ''
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setFormData(initialFormData);
      
      if (companyId && !company) {
        Cookies.remove('company_id', { path: '/' });
        Cookies.set('has_company', 'false', { 
          expires: 7,
          sameSite: 'strict',
          path: '/' 
        });
      }
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Company name is required';
    if (!formData.industry.trim()) errors.industry = 'Industry is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEditing && company?.id) {
        await updateCompany(formData);
      } else {
        const createdCompany = await createCompany(formData);
        
        if (createdCompany?.id) {
          Cookies.set('company_id', createdCompany.id, { 
            expires: 7, 
            sameSite: 'strict',
            path: '/' 
          });
          Cookies.set('has_company', 'true', { 
            expires: 7,
            sameSite: 'strict',
            path: '/' 
          });
        }
      }
      
      onComplete();
    } catch (err) {
      console.error('Error saving company:', err);
      setValidationErrors({ 
        general: err.message || 'Failed to save company information. Please try again.' 
      });
    }
  };

  const isLoading = isCreatingCompany || isUpdatingCompany;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mb-4">
          <Building className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell Us About Your Company
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide essential information that helps candidates understand your organization
        </p>
      </div>

      {(error || validationErrors.general) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error || validationErrors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-[#0CCE68]" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 ${
                    validationErrors.name ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="Enter your company name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 ${
                    validationErrors.industry ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="e.g. Software Development, Fintech"
                />
                {validationErrors.industry && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.industry}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location <span className="text-red-500">*</span>
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
                  className={`pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 ${
                    validationErrors.location ? 'border-red-300 dark:border-red-600' : ''
                  }`}
                  placeholder="e.g. San Francisco, CA or Remote-First"
                />
                {validationErrors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.location}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Size
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees (Startup)</option>
                <option value="11-50">11-50 employees (Small)</option>
                <option value="51-200">51-200 employees (Medium)</option>
                <option value="201-500">201-500 employees (Large)</option>
               <option value="501-1000">501-1000 employees (Enterprise)</option>
               <option value="1001+">1001+ employees (Corporation)</option>
             </select>
           </div>
           
           <div>
             <label htmlFor="founding_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Founded
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Calendar className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="date"
                 id="founding_date"
                 name="founding_date"
                 value={formData.founding_date}
                 onChange={handleChange}
                 className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
               />
             </div>
           </div>
         </div>
       </div>
       
       {/* Company Description Section */}
       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
           <Sparkles className="h-5 w-5 mr-2 text-[#0CCE68]" />
           Company Story
         </h3>
         
         <div>
           <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Company Description <span className="text-red-500">*</span>
           </label>
           <textarea
             id="description"
             name="description"
             rows={6}
             value={formData.description}
             onChange={handleChange}
             className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 resize-none ${
               validationErrors.description ? 'border-red-300 dark:border-red-600' : ''
             }`}
             placeholder="Tell candidates about your company mission, values, culture, and what makes you unique. What's it like to work at your company?"
           />
           {validationErrors.description && (
             <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.description}</p>
           )}
           <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
             <span>💡 Include your mission, values, and company culture</span>
             <span>{formData.description.length}/1000</span>
           </div>
         </div>
       </div>
       
       {/* Contact Information Section */}
       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
           <Mail className="h-5 w-5 mr-2 text-[#0CCE68]" />
           Contact Information
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Company Website
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
                 className={`pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 ${
                   validationErrors.website ? 'border-red-300 dark:border-red-600' : ''
                 }`}
                 placeholder="https://yourcompany.com"
               />
               {validationErrors.website && (
                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.website}</p>
               )}
             </div>
           </div>
           
           <div>
             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Contact Email
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
                 className={`pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 ${
                   validationErrors.email ? 'border-red-300 dark:border-red-600' : ''
                 }`}
                 placeholder="hiring@yourcompany.com"
               />
               {validationErrors.email && (
                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
               )}
             </div>
           </div>
           
           <div>
             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Phone Number
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
         </div>
       </div>
       
       {/* Social Media Section */}
       <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
           <LinkIcon className="h-5 w-5 mr-2 text-[#0CCE68]" />
           Social Media Presence
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               LinkedIn Company Page
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Linkedin className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="url"
                 id="linkedin"
                 name="linkedin"
                 value={formData.linkedin}
                 onChange={handleChange}
                 className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                 placeholder="https://linkedin.com/company/your-company"
               />
             </div>
           </div>
           
           <div>
             <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Twitter/X Handle
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Twitter className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="url"
                 id="twitter"
                 name="twitter"
                 value={formData.twitter}
                 onChange={handleChange}
                 className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                 placeholder="https://twitter.com/yourcompany"
               />
             </div>
           </div>
           
           <div>
             <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Facebook Page
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Facebook className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="url"
                 id="facebook"
                 name="facebook"
                 value={formData.facebook}
                 onChange={handleChange}
                 className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                 placeholder="https://facebook.com/yourcompany"
               />
             </div>
           </div>
         </div>
       </div>
       
       {/* Information Note */}
       <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
         <div className="flex">
           <div className="flex-shrink-0">
             <Sparkles className="h-5 w-5 text-blue-500" />
           </div>
           <div className="ml-3 text-sm text-blue-700 dark:text-blue-400">
             <p className="font-medium">Why complete your profile?</p>
             <p className="mt-1">A detailed company profile increases candidate applications by up to 300% and helps you attract higher-quality talent who align with your company culture.</p>
           </div>
         </div>
       </div>
       
       {/* Submit Button */}
       <div className="flex justify-end pt-4">
         <button
           type="submit"
           disabled={isLoading}
           className="bg-gradient-to-r from-[#0CCE68] to-blue-500 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
         >
           {isLoading ? (
             <span className="flex items-center justify-center">
               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               {isEditing ? 'Updating company...' : 'Creating company...'}
             </span>
           ) : (
             <span className="flex items-center justify-center">
               <Building className="h-5 w-5 mr-2" />
               Continue to Benefits
             </span>
           )}
         </button>
       </div>
     </form>
   </div>
 );
}