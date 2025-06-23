// src/components/profile/modals/ExperienceModal.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { X, Save, Clock } from 'lucide-react';

export default function ExperienceModal({ experience, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addExperience, updateExperience } = useStore(state => ({
    addExperience: state.addExperience,
    updateExperience: state.updateExperience
  }));

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

  useEffect(() => {
    if (experience) {
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
    }
  }, [experience]);

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
      if (experience) {
        await updateExperience(experience.id, formData);
      } else {
        await addExperience(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {experience ? 'Edit Experience' : 'Add Experience'}
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
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, Remote"
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Portfolio Link
              </label>
              <input
                type="url"
                name="portfolio_link"
                value={formData.portfolio_link}
                onChange={handleChange}
                placeholder="https://example.com/project"
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
                End Date {!formData.current_job && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={formData.current_job}
                required={!formData.current_job}
                className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="current_job"
              id="current_job"
              checked={formData.current_job}
              onChange={handleChange}
              className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="current_job" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I currently work here
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
              placeholder="Describe your responsibilities and achievements..."
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
                  {experience ? 'Update' : 'Add'} Experience
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}