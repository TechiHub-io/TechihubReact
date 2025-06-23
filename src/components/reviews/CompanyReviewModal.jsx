// src/components/reviews/CompanyReviewModal.jsx
import React, { useState } from 'react';
import { useCompanyReviews } from '@/hooks/useCompanyReviews';
import StarRating from './StarRating';
import { X, Star, Send, Loader2, Building2 } from 'lucide-react';

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'current', label: 'Current Employee' },
  { value: 'former', label: 'Former Employee' },
  { value: 'interview', label: 'Interview Candidate' }
];

export default function CompanyReviewModal({ company, isOpen, onClose, onReviewSubmitted }) {
  const { submitReview, loading, error, clearError } = useCompanyReviews();
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: '',
    cons: '',
    employment_status: 'former',
    is_anonymous: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0 || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const reviewData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        pros: formData.pros.trim(),
        cons: formData.cons.trim()
      };

      await submitReview(company.id, reviewData);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  if (!isOpen) return null;

  const isFormValid = formData.rating > 0 && formData.title.trim() && formData.content.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Write a Review
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Company Info */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{company.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {company.industry} • {company.location}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overall Rating *
              </label>
              <StarRating
                rating={formData.rating}
                interactive={true}
                onChange={(rating) => handleChange('rating', rating)}
                size="lg"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Click stars to rate (1 = Poor, 5 = Excellent)
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Review *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Share your experience working at this company"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
            </div>

            {/* Pros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pros (Optional)
              </label>
              <textarea
                value={formData.pros}
                onChange={(e) => handleChange('pros', e.target.value)}
                placeholder="What did you like about working here?"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cons (Optional)
              </label>
              <textarea
                value={formData.cons}
                onChange={(e) => handleChange('cons', e.target.value)}
                placeholder="What could be improved?"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Status
              </label>
              <select
                value={formData.employment_status}
                onChange={(e) => handleChange('employment_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                {EMPLOYMENT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center">
              <input
                id="anonymous"
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={(e) => handleChange('is_anonymous', e.target.checked)}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Submit as anonymous review
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}