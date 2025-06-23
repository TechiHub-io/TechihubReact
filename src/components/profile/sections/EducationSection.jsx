// src/components/profile/sections/EducationSection.jsx
'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Calendar, School, BookOpen, Edit, Trash, Plus, Save, X, AlertCircle } from 'lucide-react';

export default function EducationSection({ education = [] }) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });

  
  const degreeOptions = [
    { value: 'undergraduate', label: "Bachelor's Degree" },
    { value: 'postgraduate', label: "Bachelor's Degree Post graduate" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'other', label: 'Other' }
  ];

  const { addEducation, updateEducation, deleteEducation, fetchProfile } = useStore(state => ({
    addEducation: state.addEducation,
    updateEducation: state.updateEducation,
    deleteEducation: state.deleteEducation,
    fetchProfile: state.fetchProfile
  }));

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (edu) => {
    setFormData({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date || '',
      end_date: edu.end_date || '',
      current: edu.current || false,
      description: edu.description || ''
    });
    setEditingId(edu.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    
    setLoading(true);
    try {
      await deleteEducation(id);
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete education');
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
        end_date: formData.current ? null : formData.end_date
      };

      if (editingId) {
        await updateEducation(editingId, submitData);
      } else {
        await addEducation(submitData);
      }
      
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save education');
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
          Education
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
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
              {editingId ? 'Edit Education' : 'Add Education'}
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
                Institution <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <School className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                >
                  <option value="">Select degree</option>
                  {degreeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="field_of_study"
                    value={formData.field_of_study}
                    onChange={handleChange}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  End Date {!formData.current && <span className="text-red-500">*</span>}
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
                    disabled={formData.current}
                    className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] disabled:bg-gray-100 disabled:dark:bg-gray-800"
                    required={!formData.current}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="current"
                checked={formData.current}
                onChange={handleChange}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I am currently studying here
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
                placeholder="Describe your studies, achievements, or activities..."
              />
            </div>
          </form>
        </div>
      )}
    {/* Education List */}
  {education.length === 0 && !showForm ? (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <School className="h-12 w-12 mx-auto mb-3 text-gray-400" />
      <p>No education history added yet.</p>
      <p className="text-sm mt-1">Add your education to showcase your academic background.</p>
    </div>
  ) : (
    <div className="space-y-6">
      {education.map((edu) => (
        <div key={edu.id} className="border-l-4 border-[#0CCE68] pl-6 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {edu.degree_display || edu.degree} in {edu.field_of_study}
              </h3>
              <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                <School className="h-4 w-4 mr-2" />
                <span>{edu.institution}</span>
              </div>
              <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(edu.start_date)} - 
                  {edu.current ? ' Present' : ` ${formatDate(edu.end_date)}`}
                </span>
              </div>
              {edu.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {edu.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleEdit(edu)}
                className="p-1 text-gray-500 hover:text-[#0CCE68] transition-colors"
                aria-label="Edit education"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                aria-label="Delete education"
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