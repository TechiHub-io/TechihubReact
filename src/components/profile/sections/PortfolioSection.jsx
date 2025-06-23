// src/components/profile/sections/PortfolioSection.jsx
'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Link, ExternalLink, Edit, Trash, Plus, Save, X, AlertCircle, Globe } from 'lucide-react';
import useAuthAxios from '@/hooks/useAuthAxios';

export default function PortfolioSection({ portfolioItems = [] }) {
  const axios = useAuthAxios();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioUrls, setPortfolioUrls] = useState([]); // Initialize as empty array
  const [formData, setFormData] = useState({
    url: '',
    label: '',
    is_default: false
  });

  const { profileId, fetchProfile } = useStore(state => ({
    profileId: state.profileId,
    fetchProfile: state.fetchProfile
  }));

  // Fetch portfolio URLs function
  const fetchPortfolioUrls = async () => {
    if (!profileId) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const response = await axios.get(`${API_URL}/profiles/${profileId}/portfolio-urls/`);
      
      // Ensure we always set an array
      const data = response.data;
      if (Array.isArray(data)) {
        setPortfolioUrls(data);
      } else if (data && Array.isArray(data.results)) {
        setPortfolioUrls(data.results);
      } else {
        setPortfolioUrls([]);
      }
    } catch (err) {
      console.error('Error fetching portfolio URLs:', err);
      setPortfolioUrls([]); // Set empty array on error
    }
  };

  // Fetch portfolio URLs on component mount
  useEffect(() => {
    if (profileId) {
      fetchPortfolioUrls();
    }
  }, [profileId]);

  const resetForm = () => {
    setFormData({
      url: '',
      label: '',
      is_default: false
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      url: item.url || '',
      label: item.label || '',
      is_default: item.is_default || false
    });
    setEditingId(item.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this portfolio URL?')) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      await axios.delete(`${API_URL}/profiles/${profileId}/portfolio-urls/${id}/`);
      await fetchPortfolioUrls();
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete portfolio URL');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      if (editingId) {
        await axios.put(`${API_URL}/profiles/${profileId}/portfolio-urls/${editingId}/`, formData);
      } else {
        await axios.post(`${API_URL}/profiles/${profileId}/portfolio-urls/`, formData);
      }
      
      await fetchPortfolioUrls();
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to save portfolio URL');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Safely combine portfolio items and URLs for display with array checks
  const allPortfolioItems = [
    ...(Array.isArray(portfolioItems) ? portfolioItems.map(item => ({ ...item, type: 'item' })) : []),
    ...(Array.isArray(portfolioUrls) ? portfolioUrls.map(url => ({ ...url, type: 'url' })) : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Portfolio
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Portfolio URL
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingId ? 'Edit Portfolio URL' : 'Add Portfolio URL'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="https://johndoe.dev"
                  required
                />
              </div>
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
                placeholder="Personal Website"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as default portfolio URL
              </label>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Items List */}
      {allPortfolioItems.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Link className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No portfolio items added yet.</p>
          <p className="text-sm mt-1">Add your portfolio URLs and project links to showcase your work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portfolio URLs */}
          {Array.isArray(portfolioUrls) && portfolioUrls.map((item) => (
            <div key={`url-${item.id}`} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </h3>
                    {item.is_default && (
                      <span className="ml-2 px-2 py-0.5 bg-[#0CCE68] text-white text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">
                    {item.url}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-gray-400 hover:text-[#0CCE68] transition-colors"
                    aria-label="Edit portfolio URL"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete portfolio URL"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Website
                </a>
              </div>
            </div>
          ))}

          {/* Existing Portfolio Items (from portfolio_items field) */}
          {Array.isArray(portfolioItems) && portfolioItems.map((item) => (
            <div key={`item-${item.id}`} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              
              {item.image && (
                <div className="mb-3">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              {item.url && (
                <div className="mt-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Project
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}