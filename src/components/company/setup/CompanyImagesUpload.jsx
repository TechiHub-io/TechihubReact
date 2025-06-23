// src/components/company/setup/CompanyImagesUpload.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus, 
  Camera, 
  Grid3x3,
  Eye,
  Trash2,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function CompanyImagesUpload({ onComplete, onBack, onSkip }) {
  const { company, addCompanyImage, error } = useStore(state => ({
    company: state.company,
    addCompanyImage: state.addCompanyImage,
    error: state.error
  }));

  const [images, setImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Suggested image categories for inspiration
  const imageCategories = [
    {
      title: "Office Space",
      description: "Showcase your work environment",
      examples: ["Open office areas", "Meeting rooms", "Break areas", "Reception"]
    },
    {
      title: "Team Culture",
      description: "Show your team in action",
      examples: ["Team meetings", "Social events", "Collaborative work", "Team outings"]
    },
    {
      title: "Workplace Amenities",
      description: "Highlight your perks",
      examples: ["Kitchen/café", "Game room", "Gym", "Outdoor spaces"]
    },
    {
      title: "Events & Activities",
      description: "Share company culture",
      examples: ["Company parties", "Training sessions", "Workshops", "Celebrations"]
    }
  ];

  // Populate images from company if available
  useEffect(() => {
    if (company?.images) {
      setImages(company.images);
    }
  }, [company]);

  // Generate previews when files are selected
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = [];
    const loadPromises = selectedFiles.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls[index] = reader.result;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises).then(() => {
      setPreviewUrls(urls);
    });

    if (validationError) {
      setValidationError('');
    }
  }, [selectedFiles, validationError]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    validateAndSetFiles(files);
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
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      validateAndSetFiles(files);
    }
  };
  
  const validateAndSetFiles = (files) => {
    const validFiles = [];
    const errors = [];

    files.forEach((file, index) => {
      // Check file type
      if (!file.type.match('image.*')) {
        errors.push(`File ${index + 1}: Please select image files only`);
        return;
      }
      
      // Check file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`File ${index + 1}: File size must be less than 5MB`);
        return;
      }
      
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setValidationError(errors.join('. '));
      return;
    }

    // Check total number of images (max 10)
    const totalImages = images.length + pendingImages.length + validFiles.length;
    if (totalImages > 10) {
      setValidationError(`Maximum 10 images allowed. You can add ${10 - images.length - pendingImages.length} more.`);
      return;
    }

    setSelectedFiles(validFiles);
  };

  const handleAddImagesToPending = () => {
    if (selectedFiles.length === 0) {
      setValidationError('Please select images to add');
      return;
    }

    const newPendingImages = selectedFiles.map((file, index) => ({
      file: file,
      caption: '',
      previewUrl: previewUrls[index],
      id: Date.now() + index
    }));

    setPendingImages(prev => [...prev, ...newPendingImages]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleUpdateCaption = (id, caption) => {
    setPendingImages(prev => prev.map(img => 
      img.id === id ? { ...img, caption } : img
    ));
  };

  const handleRemovePendingImage = (id) => {
    setPendingImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmitAllImages = async () => {
    if (pendingImages.length === 0) {
      onComplete();
      return;
    }
    
    setIsUploading(true);
    const progress = {};
    
    try {
      for (let i = 0; i < pendingImages.length; i++) {
        const image = pendingImages[i];
        
        // Update progress for this image
        progress[image.id] = 0;
        setUploadProgress({ ...progress });

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          progress[image.id] = Math.min(progress[image.id] + 20, 90);
          setUploadProgress({ ...progress });
        }, 200);

        const imageData = {
          image: image.file,
          caption: image.caption,
          display_order: images.length + i
        };
        
        await addCompanyImage(imageData);
        
        clearInterval(progressInterval);
        progress[image.id] = 100;
        setUploadProgress({ ...progress });
      }
      
      setPendingImages([]);
      
      // Brief delay to show completion
      setTimeout(() => {
        onComplete();
      }, 500);
      
    } catch (err) {
      console.error('Error adding images:', err);
      setValidationError('Failed to save images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mb-4">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Showcase Your Workplace
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add photos that give candidates a glimpse into your company culture and environment
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

      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Images added to your gallery!</span>
        </div>
      )}

      {/* Image Inspiration */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-orange-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
          Photo Ideas for Your Gallery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageCategories.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{category.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
              <div className="flex flex-wrap gap-1">
                {category.examples.map((example, i) => (
                  <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Images Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Grid3x3 className="h-5 w-5 mr-2 text-[#0CCE68]" />
            Current Gallery ({images.length} images)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id || index} 
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={image.image} 
                    alt={image.caption || 'Company image'} 
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white/90 text-gray-800 rounded-full p-2 hover:bg-white transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                {image.caption && (
                  <div className="p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Images */}
      {pendingImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            New Images <span className="text-sm font-normal text-gray-500">(Not yet saved)</span>
          </h3>
          <div className="space-y-4">
            {pendingImages.map((image) => (
              <div 
                key={image.id} 
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  {/* Image Preview */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={image.previewUrl} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    {isUploading && uploadProgress[image.id] !== undefined && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs font-medium">
                          {uploadProgress[image.id]}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Caption Input */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image Caption (Optional)
                    </label>
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                      placeholder="Describe this image..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    />
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemovePendingImage(image.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                    disabled={isUploading}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Images</h3>
        
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div 
            className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
              dragActive 
                ? 'border-[#0CCE68] bg-green-50 dark:bg-green-900/20 scale-[1.02]' 
                : 'border-gray-300 dark:border-gray-600 hover:border-[#0CCE68] hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFiles.length > 0 ? (
              <div className="p-6">
                <div className="text-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
                  </p>
                </div>
                
                {/* Preview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedFiles([]);
                      setPreviewUrls([]);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleAddImagesToPending}
                    className="px-6 py-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] transition-colors"
                  >
                    Add to Gallery
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Support for multiple files (Max 10 images, 5MB each)
                </p>
              </div>
            )}
            
            {/* Hidden file input */}
            <input 
              type="file" 
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          {/* Manual Upload Button */}
          <div className="text-center">
            <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              <Plus className="h-5 w-5 mr-2" />
              Choose Images
              <input 
                type="file" 
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Image Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex">
          <div className="flex-shrink-0">
            <Camera className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3 text-sm text-blue-700 dark:text-blue-400">
            <p className="font-medium">Photography Tips:</p>
            <ul className="mt-1 space-y-1">
              <li>• Use natural lighting when possible</li>
              <li>• Show diverse team members and activities</li>
              <li>• Include both work areas and social spaces</li>
              <li>• Ensure photos reflect your company culture authentically</li>
            </ul>
            {pendingImages.length > 0 && (
              <p className="mt-2 font-medium">
                You have {pendingImages.length} unsaved image{pendingImages.length > 1 ? 's' : ''}. They'll be saved when you continue.
              </p>
            )}
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
            onClick={handleSubmitAllImages}
            disabled={isUploading}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving images...
              </span>
            ) : (
              <span className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Continue to Team
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}