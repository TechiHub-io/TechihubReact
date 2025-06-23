// src/components/ui/ErrorState.jsx - Enhanced error handling
import React from 'react';
import { AlertCircle, RefreshCw, Home, Search } from 'lucide-react';

export default function ErrorState({ 
  error = "Something went wrong", 
  onRetry,
  showHomeButton = false,
  showSearchButton = false,
  className = ""
}) {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return "An unexpected error occurred";
  };

  const getErrorSuggestion = (error) => {
    const message = getErrorMessage(error).toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return "Please check your internet connection and try again.";
    }
    if (message.includes('timeout')) {
      return "The request timed out. Please try again.";
    }
    if (message.includes('not found') || message.includes('404')) {
      return "The requested resource was not found.";
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return "Please log in to access this content.";
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return "You don't have permission to access this content.";
    }
    if (message.includes('server') || message.includes('500')) {
      return "Our servers are experiencing issues. Please try again later.";
    }
    
    return "Please try again or contact support if the problem persists.";
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {getErrorMessage(error)}
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          {getErrorSuggestion(error)}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] focus:bg-[#0BBE58] text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </button>
          )}
          
          {showSearchButton && (
            <button
              onClick={() => window.location.href = '/jobs'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}