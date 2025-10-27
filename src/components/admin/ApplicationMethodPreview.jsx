// src/components/admin/ApplicationMethodPreview.jsx
'use client';
import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  Mail, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { APPLICATION_METHODS } from './ApplicationMethodSelector';

const METHOD_CONFIGS = {
  [APPLICATION_METHODS.INTERNAL]: {
    label: 'Apply on TechHub',
    description: 'Complete your application directly on TechHub',
    icon: FileText,
    color: 'blue',
    buttonText: 'Apply Now'
  },
  [APPLICATION_METHODS.EXTERNAL_URL]: {
    label: 'Apply on Company Website',
    description: 'Apply directly on the company\'s website',
    icon: ExternalLink,
    color: 'green',
    buttonText: 'Visit Website'
  },
  [APPLICATION_METHODS.EMAIL]: {
    label: 'Apply via Email',
    description: 'Send your application via email',
    icon: Mail,
    color: 'purple',
    buttonText: 'Send Email'
  }
};

export default function ApplicationMethodPreview({
  selectedMethods = [],
  applicationUrl = '',
  applicationEmail = '',
  className = ''
}) {
  if (selectedMethods.length === 0) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Select application methods to see preview
          </p>
        </div>
      </div>
    );
  }

  const getMethodIcon = (method) => {
    const IconComponent = METHOD_CONFIGS[method].icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getMethodDetails = (method) => {
    switch (method) {
      case APPLICATION_METHODS.EXTERNAL_URL:
        return applicationUrl ? { url: applicationUrl } : null;
      case APPLICATION_METHODS.EMAIL:
        return applicationEmail ? { email: applicationEmail } : null;
      default:
        return {};
    }
  };

  const renderMethodCard = (method, index) => {
    const config = METHOD_CONFIGS[method];
    const details = getMethodDetails(method);
    const isPrimary = method === APPLICATION_METHODS.INTERNAL;
    
    // Skip rendering if required details are missing
    if ((method === APPLICATION_METHODS.EXTERNAL_URL && !applicationUrl) ||
        (method === APPLICATION_METHODS.EMAIL && !applicationEmail)) {
      return null;
    }

    return (
      <div
        key={method}
        className={`border rounded-lg p-4 transition-all hover:shadow-md ${
          isPrimary 
            ? 'border-[#0CCE68] bg-green-50 dark:bg-green-900/10' 
            : 'border-gray-200 dark:border-gray-600 hover:border-[#0CCE68]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              isPrimary
                ? 'bg-[#0CCE68] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {getMethodIcon(method)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {config.label}
                </h4>
                {isPrimary && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                    Recommended
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {config.description}
              </p>
              
              {details?.url && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                  {details.url}
                </p>
              )}
              
              {details?.email && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {details.email}
                </p>
              )}
            </div>
          </div>
          
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
              isPrimary
                ? 'bg-[#0CCE68] text-white hover:bg-[#0BBE58]'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {config.buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  const validMethods = selectedMethods.filter(method => {
    if (method === APPLICATION_METHODS.EXTERNAL_URL) return applicationUrl;
    if (method === APPLICATION_METHODS.EMAIL) return applicationEmail;
    return true;
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Application Methods Preview
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {validMethods.length} method{validMethods.length !== 1 ? 's' : ''} available
        </span>
      </div>
      
      {validMethods.length > 1 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Job seekers can choose from multiple application methods below:
        </p>
      )}

      <div className="space-y-4">
        {validMethods.map((method, index) => renderMethodCard(method, index))}
      </div>

      {validMethods.length === 0 && (
        <div className="text-center py-8">
          <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Configure application methods to see how they'll appear to job seekers
          </p>
        </div>
      )}
    </div>
  );
}