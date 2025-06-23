// src/components/reviews/ReviewsList.jsx
import React, { useState, useEffect } from 'react';
import { useCompanyReviews } from '@/hooks/useCompanyReviews';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import CompanyReviewModal from './CompanyReviewModal';
import { 
  Star, 
  Plus, 
  Filter, 
  SortDesc, 
  MessageSquare,
  TrendingUp,
  Users
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' }
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'current', label: 'Current Employees' },
  { value: 'former', label: 'Former Employees' },
  { value: 'interview', label: 'Interview Candidates' }
];

export default function ReviewsList({ company, canWriteReview = true }) {
  const { getCompanyReviews, loading, error } = useCompanyReviews();
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await getCompanyReviews(company.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    if (company.id) {
      loadReviews();
    }
  }, [company.id, getCompanyReviews]);

  // Handle new review submission
  const handleReviewSubmitted = async () => {
    // Reload reviews after submission
    try {
      const reviewsData = await getCompanyReviews(company.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to reload reviews:', error);
    }
  };

  // Sort and filter reviews
  const processedReviews = React.useMemo(() => {
    let filtered = reviews;

    // Apply filter
    if (filterBy !== 'all') {
      filtered = reviews.filter(review => review.employment_status === filterBy);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, sortBy, filterBy]);

  // Calculate review statistics
  const reviewStats = React.useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, distribution: {} };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    
    const distribution = reviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, {});

    return { average, distribution };
  }, [reviews]);

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Employee Reviews
          </h2>
          
          {canWriteReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Review
            </button>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {reviewStats.average.toFixed(1)}
              </div>
              <StarRating rating={Math.round(reviewStats.average)} size="lg" className="justify-center mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviewStats.distribution[rating] || 0;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-3">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              {/* Icon with background */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">!</span>
                </div>
              </div>
              
              {/* Main heading */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No reviews yet
              </h3>
              
              {/* Description */}
              <div className="space-y-4 mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Help the community by sharing your experience at{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {company.name}
                  </span>
                </p>
                
                {/* Review process info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Review Process
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    All reviews undergo moderation to ensure authenticity and quality. 
                    Your review will be published within 24-48 hours after admin approval.
                  </p>
                </div>
              </div>
              
              {/* Action section */}
              {canWriteReview ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0CCE68] to-[#0BBE58] text-white rounded-xl hover:from-[#0BBE58] hover:to-[#0AAE48] transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Write the First Review
                  </button>
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <span>Anonymous option available</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span>Help others decide</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Review Eligibility
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reviews can be written by current employees, former employees, 
                    and interview candidates to ensure authentic feedback.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                >
                  {FILTER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SortDesc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {processedReviews.length} of {reviews.length} reviews
          </div>
        </div>
      )}

      {/* Reviews List */}
      {processedReviews.length > 0 && (
        <div className="space-y-4">
          {processedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <CompanyReviewModal
          company={company}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}