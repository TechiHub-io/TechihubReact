// src/components/reviews/WriteReviewButton.jsx
import React, { useState } from 'react';
import { Star, Edit } from 'lucide-react';
import CompanyReviewModal from './CompanyReviewModal';

export default function WriteReviewButton({ 
  company, 
  onReviewSubmitted,
  variant = 'button',
  size = 'md',
  className = ""
}) {
  const [showModal, setShowModal] = useState(false);

  const handleReviewSubmitted = () => {
    setShowModal(false);
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  const getButtonContent = () => {
    const icon = variant === 'icon' ? <Star className="h-4 w-4" /> : <Edit className="h-4 w-4 mr-2" />;
    const text = variant === 'icon' ? null : 'Write Review';
    
    return (
      <>
        {icon}
        {text}
      </>
    );
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-offset-2";
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantStyles = {
      button: 'bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] font-medium',
      outline: 'border border-[#0CCE68] text-[#0CCE68] rounded-md hover:bg-[#0CCE68] hover:text-white',
      icon: 'p-2 text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
      link: 'text-[#0CCE68] hover:text-[#0BBE58] font-medium'
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={getButtonStyles()}
        title="Write a review for this company"
      >
        {getButtonContent()}
      </button>

      {showModal && (
        <CompanyReviewModal
          company={company}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
}