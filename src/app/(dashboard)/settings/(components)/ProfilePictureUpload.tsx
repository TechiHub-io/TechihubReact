import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

interface ProfilePictureUploadProps {
  onFileUpload: (file: File | null) => void;
  isLoading: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onFileUpload, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 1 * 1024 * 1024) {
        toast.error('File size should be less than 1MB', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce
        });
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG and PNG files are allowed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 1 * 1024 * 1024, // 1MB
    multiple: false,
    disabled: isLoading
  });

  const removeImage = () => {
    setPreview(null);
    onFileUpload(null);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg p-4 text-center cursor-pointer transition duration-300 ease-in-out hover:border-blue-500 hover:bg-blue-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isLoading} />
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Uploading...</span>
          </div>
        ) : preview ? (
          <div className="relative w-32 h-32 mx-auto">
            <Image src={preview} alt="Profile preview" layout="fill" objectFit="cover" className="rounded-full" />
            <button 
              onClick={(e) => { e.stopPropagation(); removeImage(); }} 
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300 ease-in-out"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p>Drag and drop your profile picture here, or click to select a file</p>
            <p className="text-sm text-gray-500 mt-2">Max file size: 1MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
