// src/components/profile/forms/BasicInfoForm.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import useAuthAxios from '@/hooks/useAuthAxios';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Save,
  Clock,
  Upload,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function BasicInfoForm({ profile }) {
  const router = useRouter();
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { profileId, updateProfile, uploadProfilePicture } = useStore(state => ({
    profileId: state.profileId,
    updateProfile: state.updateProfile,
    uploadProfilePicture: state.uploadProfilePicture
  }));

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    location: '',
    website: '',
    bio: '',
    years_experience: 0,
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD'
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.user?.first_name || '',
        last_name: profile.user?.last_name || '',
        email: profile.user?.email || '',
        phone: profile.user?.phone || '',
        job_title: profile.job_title || '',
        location: profile.location || '',
        website: profile.website || '',
        bio: profile.bio || '',
        years_experience: profile.years_experience || 0,
        salary_min: profile.salary_min || '',
        salary_max: profile.salary_max || '',
        salary_currency: profile.salary_currency || 'USD'
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 1 * 1024 * 1024) { // 1MB limit
      setError('Profile picture must be less than 1MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      await uploadProfilePicture(file);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your personal and professional details
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Profile Picture
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingImage ? 'Uploading...' : 'Change Picture'}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG up to 1MB
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Personal Details
          </h3>
          
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
                  value={formData.first_name}
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
                value={formData.last_name}
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
                  value={formData.email}
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
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Professional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Professional Details
          </h3>
          
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
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Software Engineer, UI/UX Designer"
                  className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  placeholder="e.g. New York, Remote"
                  className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div>
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
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="pl-10 shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Salary Expectations */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Salary Expectations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Salary
              </label>
              <input
                type="number"
                id="salary_min"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="50000"
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Salary
              </label>
              <input
                type="number"
                id="salary_max"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="80000"
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
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
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
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
            value={formData.bio}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell employers about your background, skills, and career goals..."
            className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          ></textarea>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/jobseeker/profile')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <Clock className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}