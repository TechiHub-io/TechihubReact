// src/components/profile/ProfileForm.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useForm } from '@/hooks/useForm';
import useAuthAxios from '@/hooks/useAuthAxios';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Save,
  Clock
} from 'lucide-react';

export default function ProfileForm({ profile }) {
  const router = useRouter();
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize form with profile data when available
  const initialValues = {
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    job_title: profile?.job_title || '',
    location: profile?.location || '',
    website: profile?.website || '',
    bio: profile?.bio || ''
  };
  
  // Custom onSubmit function to use with axios
  const handleFormSubmit = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the environment variable for API URL with fallback
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      // Make sure we're using the full API URL with the profiles endpoint
      const response = await axios.put(`${API_URL}/profiles/me/`, values);
      
      // Navigate back to profile view
      router.push('/dashboard/jobseeker/profile');
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Use the useForm hook
  const { values, handleChange, handleSubmit, setValues } = useForm(
    initialValues,
    handleFormSubmit
  );
  
  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      setValues({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        job_title: profile.job_title || '',
        location: profile.location || '',
        website: profile.website || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, setValues]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Personal Information */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.first_name}
                onChange={handleChange}
                required
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.email}
                onChange={handleChange}
                required
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.phone}
                onChange={handleChange}
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Information */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Professional Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.job_title}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer, UI/UX Designer"
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.location}
                onChange={handleChange}
                required
                placeholder="e.g. New York, Remote"
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                value={values.website}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Professional Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={values.bio}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell employers about your background, skills, and career goals..."
          className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
        ></textarea>
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/dashboard/jobseeker/profile')}
          className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </span>
          )}
        </button>
      </div>
    </form>
  );
}