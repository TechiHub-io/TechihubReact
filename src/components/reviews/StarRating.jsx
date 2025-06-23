// src/components/reviews/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = 'md',
  interactive = false,
  onChange = null,
  className = ""
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${
              interactive 
                ? 'cursor-pointer hover:scale-110 transition-transform' 
                : 'cursor-default'
            } focus:outline-none`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 dark:text-gray-600'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}