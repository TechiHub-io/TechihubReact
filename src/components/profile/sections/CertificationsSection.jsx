// src/components/profile/sections/CertificationsSection.jsx
'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Award, ExternalLink, Edit, Trash, Plus, Save, X, AlertCircle } from 'lucide-react';

export default function CertificationsSection({ certifications = [] }) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    year_awarded: new Date().getFullYear(),
    credential_url: ''
  });

  const { addCertification, updateCertification, deleteCertification, fetchProfile } = useStore(state => ({
    addCertification: state.addCertification,
    updateCertification: state.updateCertification,
    deleteCertification: state.deleteCertification,
    fetchProfile: state.fetchProfile
  }));

  const resetForm = () => {
    setFormData({
      name: '',
      institution: '',
      year_awarded: new Date().getFullYear(),
      credential_url: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (cert) => {
    setFormData({
      name: cert.name || '',
      institution: cert.institution || '',
      year_awarded: cert.year_awarded || new Date().getFullYear(),
      credential_url: cert.credential_url || ''
    });
    setEditingId(cert.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    setLoading(true);
    try {
      await deleteCertification(id);
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete certification');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        await updateCertification(editingId, formData);
      } else {
        await addCertification(formData);
      }
      
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Certifications
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Certification
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
              {editingId ? 'Edit Certification' : 'Add Certification'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="e.g. Amazon Web Services"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year Awarded <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year_awarded"
                  value={formData.year_awarded}
                  onChange={handleChange}
                  min="1950"
                  max={new Date().getFullYear()}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credential URL
                </label>
                <input
                  type="url"
                  name="credential_url"
                  value={formData.credential_url}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="https://credential-url.com"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Certifications List */}
      {certifications.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Award className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No certifications added yet.</p>
          <p className="text-sm mt-1">Add your professional certifications to showcase your expertise.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {cert.institution}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cert.year_awarded}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="p-1 text-gray-400 hover:text-[#0CCE68] transition-colors"
                    aria-label="Edit certification"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    disabled={loading}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete certification"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {cert.credential_url && (
                <div className="mt-3">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Credential
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