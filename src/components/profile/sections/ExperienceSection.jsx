// src/components/profile/sections/ExperienceSection.jsx
'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Calendar, Building, MapPin, Edit, Trash, Plus, Save, X, AlertCircle, Briefcase, Link2 } from 'lucide-react';

export default function ExperienceSection({ experiences = [] }) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    location: '',
    start_date: '',
    end_date: '',
    current_job: false,
    description: '',
    portfolio_link: ''
  });

  const { addExperience, updateExperience, deleteExperience, fetchProfile } = useStore(state => ({
    addExperience: state.addExperience,
    updateExperience: state.updateExperience,
    deleteExperience: state.deleteExperience,
    fetchProfile: state.fetchProfile
  }));

  const resetForm = () => {
    setFormData({
      company_name: '',
      job_title: '',
      location: '',
      start_date: '',
      end_date: '',
      current_job: false,
      description: '',
      portfolio_link: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (experience) => {
    setFormData({
      company_name: experience.company_name || '',
      job_title: experience.job_title || '',
      location: experience.location || '',
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      current_job: experience.current_job || false,
      description: experience.description || '',
      portfolio_link: experience.portfolio_link || ''
    });
    setEditingId(experience.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    setLoading(true);
    try {
      await deleteExperience(id);
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        end_date: formData.current_job ? null : formData.end_date
      };

      if (editingId) {
        await updateExperience(editingId, submitData);
      } else {
        await addExperience(submitData);
      }
      
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save experience');
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
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
              {editingId ? 'Edit Experience' : 'Add Experience'}
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
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
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
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    placeholder="e.g. New York, Remote"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="portfolio_link"
                    value={formData.portfolio_link}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    placeholder="https://example.com/project"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date {!formData.current_job && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={formData.current_job}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] disabled:bg-gray-100 disabled:dark:bg-gray-800"
                    required={!formData.current_job}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="current_job"
                checked={formData.current_job}
                onChange={handleChange}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </form>
        </div>
      )}

      {/* Experience List */}
      {experiences.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No work experience added yet.</p>
          <p className="text-sm mt-1">Add your work experience to showcase your background.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="border-l-4 border-[#0CCE68] pl-6 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {experience.job_title}
                  </h3>
                  <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{experience.company_name}</span>
                  </div>
                  {experience.location && (
                    <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDate(experience.start_date)} - 
                      {experience.current_job ? ' Present' : ` ${formatDate(experience.end_date)}`}
                    </span>
                  </div>
                  {experience.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {experience.description}
                    </p>
                  )}
                  {experience.portfolio_link && (
                    <div className="mt-2">
                      <a
                        href={experience.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                      >
                        <Link2 className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-1 text-gray-500 hover:text-[#0CCE68] transition-colors"
                    aria-label="Edit experience"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    disabled={loading}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete experience"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}