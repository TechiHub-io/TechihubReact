// src/components/profile/modals/EducationModal.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { X, Save, Clock } from 'lucide-react';

const degreeOptions = [
  { value: 'undergraduate', label: "Bachelor's Degree" },
  { value: 'postgraduate', label: "Bachelor's Degree Post graduate" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'other', label: 'Other' }
];

export default function EducationModal({ education, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addEducation, updateEducation } = useStore(state => ({
    addEducation: state.addEducation,
    updateEducation: state.updateEducation
  }));

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || '',
        degree: education.degree || '',
        field_of_study: education.field_of_study || '',
        start_date: education.start_date || '',
        end_date: education.end_date || '',
        current: education.current || false,
        description: education.description || ''
      });
    }
  }, [education]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (education) {
        await updateEducation(education.id, formData);
      } else {
        await addEducation(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {education ? 'Edit Education' : 'Add Education'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
                placeholder="e.g. Harvard University"
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              >
                <option value="">Select degree</option>
                {degreeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                required
                placeholder="e.g. Computer Science, Business Administration"
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date {!formData.current && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={formData.current}
                required={!formData.current}
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="current"
              id="current"
              checked={formData.current}
              onChange={handleChange}
              className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="current" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I am currently studying here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your studies, achievements, or activities..."
              className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <Clock className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {education ? 'Update' : 'Add'} Education
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}