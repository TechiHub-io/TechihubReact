// src/components/company/profile/CompanyGallerySection.jsx
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useNotification } from '@/hooks/useNotification';
import { ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';

export default function CompanyGallerySection({ company, isOwner, companyId }) {
  const { addCompanyImage, deleteImage, isAddingImage } = useCompany();
  const { showSuccess, showError } = useNotification();
  
  // State for uploading images
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [uploadData, setUploadData] = useState({
    image: null,
    caption: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [deletingImageId, setDeletingImageId] = useState(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }
      
      setUploadData({
        ...uploadData,
        image: file
      });
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
      showError(err.response?.data?.message || err.message || 'Failed to upload image');
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    setDeletingImageId(imageId);
    
    try {
      // Try different URL patterns based on your API documentation
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
  
  const hasImages = company?.images && company.images.length > 0;
  
  // Filter and ensure unique images with valid IDs
  const validImages = hasImages ? company.images.filter((image, index, arr) => {
    // Filter out images without IDs or with duplicate IDs
    return image && 
           (image.id || image.uuid) && // Some APIs use 'uuid' instead of 'id'
           image.image && // Ensure image URL exists
           arr.findIndex(img => (img.id || img.uuid) === (image.id || image.uuid)) === index;
  }) : [];
  
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Company Gallery
        </h2>
        
        { !isAddingMode && (
          <button
            onClick={() => setIsAddingMode(true)}
            className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Image
          </button>
        )}
      </div>
      
      {/* Image upload form */}
      { isAddingMode && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Upload Company Image
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-48 rounded-md object-contain" 
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl('');
                      setUploadData({...uploadData, image: null});
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                    Drag and drop an image, or click to select
                  </p>
                  <input
                    type="file"
                    id="company-image"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="company-image"
                    className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500"
                  >
                    <Upload className="w-4 h-4 inline mr-1" />
                    Select Image
                  </label>
                </>
              )}
            </div>
            
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                id="caption"
                value={uploadData.caption}
                onChange={handleCaptionChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                placeholder="e.g. Our office in San Francisco"
                maxLength={200}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              >
                <X className="w-4 h-4 mr-1 inline" />
                Cancel
              </button>
              
              <button
                onClick={handleUploadImage}
                disabled={isAddingImage || !uploadData.image}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isAddingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-1"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1 inline" />
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
            const imageId = image.id || image.uuid;
            const isDeleting = deletingImageId === imageId;
            
            return (
              <div 
                key={`company-image-${imageId || index}`} 
                className="relative group overflow-hidden rounded-lg"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden h-48">
                  <img 
                    src={image.image} 
                    alt={image.caption || `Company image ${index + 1}`} 
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    onError={(e) => {
                      // Handle broken images
                      e.target.style.display = 'none';
                      console.error('Failed to load image:', image.image);
                    }}
                    loading="lazy"
                  />
                </div>
                
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                    <p className="text-sm font-medium truncate">{image.caption}</p>
                  </div>
                )}
                
                {imageId && (
                  <button
                    onClick={() => handleDeleteImage(imageId)}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                    aria-label="Delete image"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100">
                    ID: {imageId}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-md">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {hasImages ? 'No valid images found in the gallery' : 'Showcase your company culture with photos'}
          </p>
          {!isAddingMode && (
            <button
              onClick={() => setIsAddingMode(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your first image
            </button>
          )}
        </div>
      )}
    </div>
  );
}