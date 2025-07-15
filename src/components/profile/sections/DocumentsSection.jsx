// src/components/profile/sections/DocumentsSection.jsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Upload, FileText, Download, Trash, Plus, Save, X, AlertCircle, File } from 'lucide-react';
import useAuthAxios from '@/hooks/useAuthAxios';

export default function DocumentsSection() {
  const axios = useAuthAxios();
  const [documents, setDocuments] = useState([]); // Initialize as empty array
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    document_type: 'resume',
    file: null,
    label: '',
    is_default: false
  });

  const documentTypes = [
    { value: 'resume', label: 'Resume', accept: '.pdf', maxSize: '1MB' },
    { value: 'cover_letter', label: 'Cover Letter', accept: '.pdf,.doc,.docx', maxSize: '1MB' },
    { value: 'portfolio', label: 'Portfolio', accept: '.pdf', maxSize: '10MB' },
    { value: 'other', label: 'Other', accept: '.pdf,.doc,.docx', maxSize: '1MB' }
  ];

  const { profileId, fetchProfile } = useStore(state => ({
    profileId: state.profileId,
    fetchProfile: state.fetchProfile
  }));

  // Fetch documents on component mount
  useEffect(() => {
    if (profileId) {
      fetchDocuments();
    }
  }, [profileId]);

  const fetchDocuments = async () => {
    if (!profileId) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/profiles/${profileId}/documents/`);
      
      // Ensure we always set an array
      const data = response.data;
      if (Array.isArray(data)) {
        setDocuments(data);
      } else if (data && Array.isArray(data.results)) {
        setDocuments(data.results);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setDocuments([]); // Set empty array on error
    }
  };

  const resetForm = () => {
    setFormData({
      document_type: 'resume',
      file: null,
      label: '',
      is_default: false
    });
    setShowForm(false);
    setError(null);
    setUploadProgress(0);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.delete(`${API_URL}/profiles/${profileId}/documents/${id}/`);
      
     
      
      await fetchDocuments();
      await fetchProfile();
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to delete document';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file, documentType) => {
    const type = documentTypes.find(t => t.value === documentType);
    if (!type) return 'Invalid document type';

    // Check file size
    const maxSizeBytes = {
      'resume': 1 * 1024 * 1024, // 1MB
      'cover_letter': 3 * 1024 * 1024, // 3MB
      'portfolio': 10 * 1024 * 1024, // 10MB
      'other': 1 * 1024 * 1024 // 1MB
    };

    if (file.size > maxSizeBytes[documentType]) {
      return `File size must be less than ${type.maxSize}`;
    }

    // Check file type
    const allowedTypes = {
      'resume': ['application/pdf'],
      'cover_letter': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      'portfolio': ['application/pdf'],
      'other': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (!allowedTypes[documentType].includes(file.type)) {
      return `Invalid file type. Allowed: ${type.accept}`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setError('Please select a file to upload');
      return;
    }

    // Validate file
    const validationError = validateFile(formData.file, formData.document_type);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      const uploadFormData = new FormData();
      uploadFormData.append('document_type', formData.document_type);
      uploadFormData.append('file', formData.file);
      uploadFormData.append('label', formData.label);
      uploadFormData.append('is_default', formData.is_default);

      await axios.post(`${API_URL}/profiles/${profileId}/documents/`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      await fetchDocuments();
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to upload document');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'file') {
      setFormData(prev => ({
        ...prev,
        file: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const getFileIcon = (documentType) => {
    switch (documentType) {
      case 'resume':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'cover_letter':
        return <File className="h-8 w-8 text-green-500" />;
      case 'portfolio':
        return <FileText className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType ? docType.label : type;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Documents
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Upload Document
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Upload Document
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.file}
                className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} (Max: {type.maxSize})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="Senior Developer Resume"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-[#0CCE68] hover:text-[#0BBE58] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0CCE68]">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                        className="sr-only"
                        accept={documentTypes.find(t => t.value === formData.document_type)?.accept}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {documentTypes.find(t => t.value === formData.document_type)?.accept} up to {documentTypes.find(t => t.value === formData.document_type)?.maxSize}
                  </p>
                  {formData.file && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      Selected: {formData.file.name} ({formatFileSize(formData.file.size)})
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loading && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#0CCE68] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as default {getDocumentTypeLabel(formData.document_type).toLowerCase()}
              </label>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      {(!Array.isArray(documents) || documents.length === 0) && !showForm ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No documents uploaded yet.</p>
          <p className="text-sm mt-1">Upload your resume, cover letters, and other professional documents.</p>
        </div>
      ) : (
        Array.isArray(documents) && documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {getFileIcon(doc.document_type)}
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {doc.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getDocumentTypeLabel(doc.document_type)}
                      </p>
                      {doc.is_default && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#0CCE68] text-white text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={loading}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete document"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <p>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="mt-4">
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}