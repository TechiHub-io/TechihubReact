// src/components/profile/sections/BasicInfoSection.jsx
'use client';
import { useState, useRef } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { User, Mail, Phone, MapPin, Globe, Briefcase, Edit, Save, X, AlertCircle, Camera, Upload, ChevronDown } from 'lucide-react';
import useAuthAxios from '@/hooks/useAuthAxios';
import countriesData from '@/data/countries.json';
import currenciesData from '@/data/currencies.json';

export default function BasicInfoSection({ profile }) {
  const axios = useAuthAxios();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [error, setError] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  
  // Phone country code state - defaults to Kenya
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('KE');
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.user?.first_name || '',
    last_name: profile?.user?.last_name || '',
    email: profile?.user?.email || '',
    phone: profile?.user?.phone || '',
    job_title: profile?.job_title || '',
    bio: profile?.bio || '',
    years_experience: profile?.years_experience || 0,
    country: profile?.country || 'Kenya', // Default to Kenya
    salary_min: profile?.salary_min || '',
    salary_max: profile?.salary_max || '',
    salary_currency: profile?.salary_currency || 'USD'
  });

  const { updateProfile, fetchProfile, profileId } = useStore(state => ({
    updateProfile: state.updateProfile,
    fetchProfile: state.fetchProfile,
    profileId: state.profileId
  }));

  // Convert countries object to array for dropdown
  const countriesArray = Object.entries(countriesData).map(([code, data]) => ({
    code,
    name: data.name,
    phoneCode: data.code
  }));

  // Get current phone code data
  const currentPhoneData = countriesData[selectedPhoneCode] || countriesData['KE'];

  // Extract phone number without country code for editing
  const getPhoneNumberOnly = (fullPhone) => {
    if (!fullPhone) return '';
    
    // Try to find a matching country code and extract the number
    for (const [code, data] of Object.entries(countriesData)) {
      if (fullPhone.startsWith(data.code)) {
        return fullPhone.substring(data.code.length).trim();
      }
    }
    return fullPhone; // Return as-is if no country code found
  };

  // Clean phone input to remove duplicate country codes
  const cleanPhoneInput = (input) => {
    if (!input) return '';
    
    // Remove any leading + signs
    let cleaned = input.replace(/^\+/, '');
    
    // Check if input starts with any country code and remove it
    for (const [code, data] of Object.entries(countriesData)) {
      const countryCode = data.code.replace('+', '');
      if (cleaned.startsWith(countryCode)) {
        cleaned = cleaned.substring(countryCode.length).trim();
        break;
      }
    }
    
    return cleaned;
  };

  // Detect country code from existing phone number
  const detectCountryFromPhone = (phone) => {
    if (!phone) return 'KE'; // Default to Kenya
    
    for (const [code, data] of Object.entries(countriesData)) {
      if (phone.startsWith(data.code)) {
        return code;
      }
    }
    return 'KE'; // Default to Kenya if no match
  };

  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPG, PNG, WebP)';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 2MB';
    }

    return null;
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPicturePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    await uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    setUploadingPicture(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      const formData = new FormData();
      formData.append('profile_picture', file);

      await axios.post(`${API_URL}/profiles/${profileId}/upload-profile-picture/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh profile data to get updated picture URL
      await fetchProfile();
      setPicturePreview(null); // Clear preview since we now have the actual uploaded image
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to upload profile picture');
      setPicturePreview(null);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleEdit = () => {
    const phoneOnly = getPhoneNumberOnly(profile?.user?.phone || '');
    const detectedCountryCode = detectCountryFromPhone(profile?.user?.phone || '');
    
    setFormData({
      first_name: profile?.user?.first_name || '',
      last_name: profile?.user?.last_name || '',
      email: profile?.user?.email || '',
      phone: phoneOnly,
      job_title: profile?.job_title || '',
      bio: profile?.bio || '',
      years_experience: profile?.years_experience || 0,
      country: profile?.country || 'Kenya',
      salary_min: profile?.salary_min || '',
      salary_max: profile?.salary_max || '',
      salary_currency: profile?.salary_currency || 'USD'
    });
    
    setSelectedPhoneCode(detectedCountryCode);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setPicturePreview(null);
    setPhoneDropdownOpen(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Clean phone number and format with country code if phone number exists
      const cleanedPhone = cleanPhoneInput(formData.phone);
      const formattedPhone = cleanedPhone ? `${currentPhoneData.code} ${cleanedPhone}` : '';
      
      const dataToSave = {
        ...formData,
        phone: formattedPhone
      };
      
      await updateProfile(dataToSave);
      await fetchProfile(); // Refresh profile data
      setIsEditing(false);
      setPhoneDropdownOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone input to prevent duplicates
    if (name === 'phone') {
      const cleanedValue = cleanPhoneInput(value);
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle phone country code selection - also updates country field
  const handlePhoneCodeSelect = (countryCode) => {
    setSelectedPhoneCode(countryCode);
    setPhoneDropdownOpen(false);
    
    // Auto-update the country field when phone country code changes
    const selectedCountryData = countriesData[countryCode];
    if (selectedCountryData) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountryData.name
      }));
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg">
                    {picturePreview ? (
                      <img
                        src={picturePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profile?.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  {uploadingPicture && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleProfilePictureClick}
                    disabled={uploadingPicture}
                    className="absolute bottom-0 right-0 p-2 bg-[#0CCE68] text-white rounded-full shadow-lg hover:bg-[#0BBE58] transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                
                <button
                  onClick={handleProfilePictureClick}
                  disabled={uploadingPicture}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {uploadingPicture ? 'Uploading...' : 'Change Photo'}
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  JPG, PNG or WebP. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
              </div>

              {/* Enhanced Phone Input with Country Code Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                      className="flex items-center justify-between px-3 py-2 w-28 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                    >
                      <span className="text-sm font-medium">{currentPhoneData.code}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    {/* Dropdown */}
                    {phoneDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {countriesArray.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handlePhoneCodeSelect(country.code)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors duration-150 ${
                              selectedPhoneCode === country.code ? 'bg-gray-50 dark:bg-gray-700' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-900 dark:text-white truncate mr-2">{country.name}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{country.phoneCode}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Input */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="712 345 678"
                      maxLength="15"
                      className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    />
                  </div>
                </div>
                {formData.phone && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Full number: {currentPhoneData.code} {cleanPhoneInput(formData.phone)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  min="0"
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  💡 This field updates automatically when you select a phone country code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  min="0"
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  min="0"
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>

              {/* Currency Selector - NEW ADDITION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="salary_currency"
                  value={formData.salary_currency}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                >
                  {Object.entries(currenciesData).map(([code, currency]) => (
                    <option key={code} value={code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Professional Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="Tell employers about your background, skills, and career goals..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {phoneDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setPhoneDropdownOpen(false)}
          ></div>
        )}
      </div>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>
        <button
          onClick={handleEdit}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Picture Display */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Profile Picture
            </p>
          </div>
        </div>

        {/* Profile Info Display */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.user?.first_name} {profile?.user?.last_name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.user?.phone || 'Not provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Job Title
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.job_title}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Years of Experience
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.years_experience || 0} years
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Country
              </label>
              <p className="text-gray-900 dark:text-white">
                {profile?.country || 'Not specified'}
              </p>
            </div>

            {(profile?.salary_min || profile?.salary_max) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Salary Range
                </label>
                <p className="text-gray-900 dark:text-white">
                  {profile?.salary_min && profile?.salary_max
                    ? `${profile.salary_min} - ${profile.salary_max} ${profile.salary_currency || 'USD'}`
                    : profile?.salary_min
                    ? `From ${profile.salary_min} ${profile.salary_currency || 'USD'}`
                    : `Up to ${profile.salary_max} ${profile.salary_currency || 'USD'}`
                  }
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Professional Summary
              </label>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {profile?.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}