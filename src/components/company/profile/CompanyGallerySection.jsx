// src/components/company/profile/CompanyGallerySection.jsx
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useNotification } from '@/hooks/useNotification';
import { ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';

export default function CompanyGallerySection({ isOwner, companyId }) {
  const { company, addCompanyImage, deleteImage, isAddingImage } = useCompany();
  const { showSuccess, showError } = useNotification();
  
 
  
  // State for uploading images
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [uploadData, setUploadData] = useState({
    image: null,
    caption: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  // Image compression function
  const compressImage = (file, maxSizeMB = 1, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to maintain aspect ratio
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new file with the compressed blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle file selection with compression
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }
    
    setIsCompressing(true);
    
    try {
      let processedFile = file;
      
      // Check if file is larger than 1MB
      const maxSize = 1 * 1024 * 1024; // 1MB
      
      if (file.size > maxSize) {
        showError(`Image size (${formatFileSize(file.size)}) exceeds 1MB limit. Compressing...`);
        
        // Try compression with different quality levels
        let quality = 0.8;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          processedFile = await compressImage(file, 1, quality);
          
          if (processedFile.size <= maxSize) {
            showSuccess(`Image compressed from ${formatFileSize(file.size)} to ${formatFileSize(processedFile.size)}`);
            break;
          }
          
          quality -= 0.2;
          attempts++;
          
          if (attempts === maxAttempts) {
            showError(`Unable to compress image below 1MB. Current size: ${formatFileSize(processedFile.size)}. Please choose a smaller image.`);
            setIsCompressing(false);
            return;
          }
        }
      }
      
      // Final size check
      if (processedFile.size > maxSize) {
        showError(`Image size (${formatFileSize(processedFile.size)}) is still too large. Please select a smaller image.`);
        setIsCompressing(false);
        return;
      }
      
      setUploadData({
        ...uploadData,
        image: processedFile
      });
      
      // Create preview URL
      const url = URL.createObjectURL(processedFile);
      setPreviewUrl(url);
      
    } catch (error) {
      console.error('Error processing image:', error);
      showError('Error processing image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };
  
  // Handle caption change
  const handleCaptionChange = (e) => {
    setUploadData({
      ...uploadData,
      caption: e.target.value
    });
  };
  
  // Handle image upload
  const handleUploadImage = async () => {
    if (!uploadData.image) {
      showError('Please select an image to upload');
      return;
    }
    
    // Final size check before upload
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (uploadData.image.size > maxSize) {
      showError(`Image size (${formatFileSize(uploadData.image.size)}) exceeds 1MB limit`);
      return;
    }
    
    try {
      await addCompanyImage({
        image: uploadData.image,
        caption: uploadData.caption,
      });
      
      showSuccess('Image uploaded successfully');
      setIsAddingMode(false);
      setUploadData({ image: null, caption: '' });
      setPreviewUrl('');
    } catch (err) {
      console.error('Error uploading image:', err);
      
      // Handle specific error cases
      if (err.response?.status === 413) {
        showError('Image file is too large. Please select an image smaller than 1MB.');
      } else if (err.response?.data?.image) {
        // Handle Django validation errors
        const imageErrors = err.response.data.image;
        if (Array.isArray(imageErrors)) {
          showError(imageErrors.join('. '));
        } else {
          showError(imageErrors);
        }
      } else {
        showError(err.response?.data?.message || err.message || 'Failed to upload image');
      }
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    setDeletingImageId(imageId);
    
    try {
      const success = await deleteImage(companyId, imageId);
      
      if (success) {
        showSuccess('Image deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting company image:', err);
      
      // More specific error handling
      if (err.response?.status === 404) {
        showError('Image not found. It may have already been deleted.');
      } else if (err.response?.status === 403) {
        showError('You do not have permission to delete this image.');
      } else {
        showError(err.response?.data?.message || err.message || 'Failed to delete image');
      }
    } finally {
      setDeletingImageId(null);
    }
  };
  
  // Cancel image upload
  const handleCancelUpload = () => {
    setIsAddingMode(false);
    setUploadData({ image: null, caption: '' });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };
  
  // Helper function to get image URL from different possible field names
  const getImageUrl = (image) => {
    return image.image_url || image.image || image.url || null;
  };
  
  // Helper function to get image ID from different possible field names
  const getImageId = (image) => {
    return image.id || image.uuid || null;
  };
  
  const hasImages = company?.images && company.images.length > 0;
  
  // Filter and ensure unique images with valid URLs
  const validImages = hasImages ? company.images.filter((image, index, arr) => {
    const imageUrl = getImageUrl(image);
    const imageId = getImageId(image);
    
    return imageUrl && 
           imageId && 
           arr.findIndex(img => getImageId(img) === imageId) === index;
  }) : [];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ImageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Company Gallery
          </h2>
        </div>
        
        {!isAddingMode && (
          <button
            onClick={() => setIsAddingMode(true)}
            className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </button>
        )}
      </div>
      
      {/* Image upload form */}
      {isAddingMode && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Upload Company Image
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* File upload area */}
            <div className="relative">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isCompressing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              
              {isCompressing ? (
                <div className="border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                  <p className="text-yellow-700 font-medium">Compressing image...</p>
                  <p className="text-yellow-600 text-sm">Please wait while we optimize your image</p>
                </div>
              ) : previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl('');
                      setUploadData({...uploadData, image: null});
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {uploadData.image && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Size: {formatFileSize(uploadData.image.size)}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#0CCE68] transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Drag and drop an image, or click to select
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 1MB</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Images larger than 1MB will be automatically compressed
                    </p>
                  </div>
                  
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <span className="bg-[#0CCE68] text-white px-4 py-2 rounded-md hover:bg-[#0BBE58] transition-colors">
                      Select Image
                    </span>
                  </label>
                </>
              )}
            </div>
            
            {/* Caption input */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                id="caption"
                value={uploadData.caption}
                onChange={handleCaptionChange}
                placeholder="Add a caption for this image"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUpload}
                disabled={isCompressing}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadImage}
                disabled={!uploadData.image || isAddingImage || isCompressing}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
              >
                {isAddingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Gallery grid */}
      {validImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {validImages.map((image, index) => {
            const imageUrl = getImageUrl(image);
            const imageId = getImageId(image);
            const isDeleting = deletingImageId === imageId;
            
            return (
              <div key={imageId || index} className="relative group">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={image.caption || `Company image ${index + 1}`}
                    className="w-full h-48 object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      // Handle broken images
                      e.target.style.display = 'none';
                      console.error('Failed to load image:', imageUrl);
                    }}
                    loading="lazy"
                  />
                </div>
                
                {/* Caption overlay */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-sm truncate">{image.caption}</p>
                  </div>
                )}
                
                {/* Delete button - only show for owners */}
                {imageId && (
                  <button
                    onClick={() => handleDeleteImage(imageId)}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                    aria-label="Delete image"
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {hasImages ? 'No valid images found in the gallery' : 'Showcase your company culture with photos'}
          </p>
          {!isAddingMode && (
            <button
              onClick={() => setIsAddingMode(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first image
            </button>
          )}
        </div>
      )}
    </div>
  );
}