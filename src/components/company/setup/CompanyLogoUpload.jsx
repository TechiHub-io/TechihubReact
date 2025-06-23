// src/components/company/setup/CompanyLogoUpload.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, ChevronLeft } from 'lucide-react';
import Cookies from 'js-cookie';

export default function CompanyLogoUpload({ onComplete, onBack, onSkip }) {
  const { company, uploadCompanyLogo, error } = useStore(state => ({
    company: state.company,
    uploadCompanyLogo: state.uploadCompanyLogo,
    error: state.error
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Set preview URL if company already has a logo
  useEffect(() => {
    if (company?.logo) {
      setPreviewUrl(company.logo);
    }
  }, [company]);

  // Generate preview when file is selected
  useEffect(() => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
    
    if (validationError) {
      setValidationError('');
    }
  }, [selectedFile, validationError]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const validateAndSetFile = (file) => {
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        setValidationError('Please select an image file (JPEG, PNG, SVG)');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('File size must be less than 2MB');
        return;
      }
      
      setSelectedFile(file);
      setValidationError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(company?.logo || null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile && !company?.logo) {
      setValidationError('Please select a logo image');
      return;
    }
    
    // If company already has a logo and no new file is selected, just continue
    if (!selectedFile && company?.logo) {
      onComplete();
      return;
    }
    
    const companyId = company?.id || Cookies.get('company_id');
    
    if (!companyId) {
      setValidationError('Company ID not found. Please complete the company details step first.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      await uploadCompanyLogo(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Brief delay to show completion
      setTimeout(() => {
        onComplete();
      }, 500);
      
    } catch (err) {
      console.error('Error uploading logo:', err);
      setValidationError(err.message || 'Failed to upload logo. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-4">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add Your Company Logo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your company logo to strengthen your brand presence
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {validationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Logo Upload Area */}
      <div className="flex flex-col items-center space-y-6">
        {/* Preview Area */}
        <div className="relative">
          <div 
            className={`w-64 h-64 border-2 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
              dragActive 
                ? 'border-[#0CCE68] bg-green-50 dark:bg-green-900/20 scale-105' 
                : previewUrl 
                  ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                  : 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-[#0CCE68] hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Company logo preview" 
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
                {selectedFile && (
                  <button 
                    onClick={handleRemoveFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {company?.logo && !selectedFile && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your logo here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to browse files
                </p>
              </div>
            )}
            
            {/* Hidden file input */}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <div 
                    className="h-2 bg-[#0CCE68] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col items-center space-y-4">
          <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            <Upload className="h-5 w-5 mr-2" />
            {previewUrl ? 'Change Logo' : 'Choose Logo'}
            <input 
              type="file" 
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>📏 Recommended: Square format (1:1 ratio)</p>
            <p>📐 Minimum size: 200x200px</p>
            <p>📁 Formats: PNG, JPG, SVG (Max 2MB)</p>
          </div>
        </div>
      </div>

      {/* Logo Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-purple-600" />
          Logo Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Use high contrast colors for readability</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Ensure logo works on light and dark backgrounds</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Keep text legible at small sizes</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Use vector formats (SVG) when possible</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onSkip}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
          >
            Skip for now
          </button>
          
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading logo...
              </span>
            ) : (
              <span className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Continue to Gallery
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}