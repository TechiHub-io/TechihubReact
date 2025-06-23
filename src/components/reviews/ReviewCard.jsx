// src/components/reviews/ReviewCard.jsx
import React, { useState } from 'react';
import StarRating from './StarRating';
import { formatDate } from '@/lib/utils/date';
import { 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Calendar
} from 'lucide-react';

export default function ReviewCard({ review, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getEmploymentStatusBadge = (status) => {
    const statusConfig = {
      current: { label: 'Current Employee', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
      former: { label: 'Former Employee', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
      interview: { label: 'Interview Candidate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' }
    };

    const config = statusConfig[status] || statusConfig.former;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const isLongContent = review.content && review.content.length > 300;
  const displayContent = isExpanded || !isLongContent 
    ? review.content 
    : `${review.content.substring(0, 300)}...`;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {review.reviewer?.profile_picture ? (
              <img 
                src={review.reviewer.profile_picture} 
                alt={review.reviewer.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {review.is_anonymous ? 'Anonymous' : (review.reviewer?.name || 'Anonymous')}
              </p>
              {review.is_anonymous && (
                <Shield className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {review.rating}/5
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getEmploymentStatusBadge(review.employment_status)}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(review.created_at, 'short')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          title="Report review"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {review.title}
        </h4>
      )}

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {displayContent}
        </p>
        
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium flex items-center"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.pros && (
            <div>
              <div className="flex items-center mb-2">
                <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pros</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {review.pros}
              </p>
            </div>
          )}
          
          {review.cons && (
            <div>
              <div className="flex items-center mb-2">
                <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Cons</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {review.cons}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Report Modal - Simple placeholder for now */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Report Review</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Thank you for helping keep our community safe. This review has been reported for review.
            </p>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}