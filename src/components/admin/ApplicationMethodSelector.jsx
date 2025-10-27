// src/components/admin/ApplicationMethodSelector.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Mail, 
  AlertCircle,
  Check,
  Info
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { 
  validateUrl, 
  validateEmail, 
  validateApplicationMethodField 
} from '@/lib/utils/applicationMethodValidation';

const APPLICATION_METHODS = {
  INTERNAL: 'internal',
  EXTERNAL_URL: 'external_url',
  EMAIL: 'email'
};

const METHOD_CONFIGS = {
  [APPLICATION_METHODS.INTERNAL]: {
    label: 'Internal TechHub System',
    description: 'Applicants apply directly through TechHub with their saved documents and profile information.',
    icon: FileText,
    color: 'blue'
  },
  [APPLICATION_METHODS.EXTERNAL_URL]: {
    label: 'External Website',
    description: 'Redirect applicants to the company\'s website or external application portal.',
    icon: ExternalLink,
    color: 'green'
  },
  [APPLICATION_METHODS.EMAIL]: {
    label: 'Email Application',
    description: 'Applicants send their application via email to a specified address.',
    icon: Mail,
    color: 'purple'
  }
};

export default function ApplicationMethodSelector({
  selectedMethods = [],
  applicationUrl = '',
  applicationEmail = '',
  onMethodChange,
  onUrlChange,
  onEmailChange,
  errors = {},
  disabled = false,
  allowMultiple = true
}) {
  const [localSelectedMethods, setLocalSelectedMethods] = useState(selectedMethods);
  const [localApplicationUrl, setLocalApplicationUrl] = useState(applicationUrl);
  const [localApplicationEmail, setLocalApplicationEmail] = useState(applicationEmail);

  // Update local state when props change
  useEffect(() => {
    setLocalSelectedMethods(selectedMethods);
  }, [selectedMethods]);

  useEffect(() => {
    setLocalApplicationUrl(applicationUrl);
  }, [applicationUrl]);

  useEffect(() => {
    setLocalApplicationEmail(applicationEmail);
  }, [applicationEmail]);

  // Handle method selection
  const handleMethodToggle = (method) => {
    if (disabled) return;

    let newMethods;
    
    if (allowMultiple) {
      // Multiple selection mode
      if (localSelectedMethods.includes(method)) {
        newMethods = localSelectedMethods.filter(m => m !== method);
      } else {
        newMethods = [...localSelectedMethods, method];
      }
    } else {
      // Single selection mode
      newMethods = localSelectedMethods.includes(method) ? [] : [method];
    }

    setLocalSelectedMethods(newMethods);
    onMethodChange?.(newMethods);
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setLocalApplicationUrl(value);
    onUrlChange?.(value);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setLocalApplicationEmail(value);
    onEmailChange?.(value);
  };

  // Real-time validation for fields
  const getFieldError = (fieldName, value) => {
    return validateApplicationMethodField(fieldName, value, localSelectedMethods);
  };

  // Get method icon with styling
  const getMethodIcon = (method, isSelected) => {
    const IconComponent = METHOD_CONFIGS[method].icon;
    const colorClass = isSelected 
      ? 'text-white' 
      : `text-${METHOD_CONFIGS[method].color}-600 dark:text-${METHOD_CONFIGS[method].color}-400`;
    
    return <IconComponent className={`w-5 h-5 ${colorClass}`} />;
  };

  // Get method card styling
  const getMethodCardClass = (method) => {
    const isSelected = localSelectedMethods.includes(method);
    const baseClass = 'border rounded-lg p-4 cursor-pointer transition-all';
    
    if (disabled) {
      return `${baseClass} border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-50`;
    }
    
    if (isSelected) {
      return `${baseClass} border-[#0CCE68] bg-green-50 dark:bg-green-900/10`;
    }
    
    return `${baseClass} border-gray-200 dark:border-gray-600 hover:border-[#0CCE68] hover:bg-gray-50 dark:hover:bg-gray-700`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Application Methods
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {allowMultiple 
            ? 'Select one or more ways applicants can apply for this job.'
            : 'Select how applicants can apply for this job.'
          }
        </p>
      </div>

      {/* Method Selection Cards */}
      <div className="space-y-4">
        {Object.values(APPLICATION_METHODS).map((method) => {
          const config = METHOD_CONFIGS[method];
          const isSelected = localSelectedMethods.includes(method);
          
          return (
            <div
              key={method}
              className={getMethodCardClass(method)}
              onClick={() => handleMethodToggle(method)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-[#0CCE68] text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {getMethodIcon(method, isSelected)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {config.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="w-5 h-5 text-[#0CCE68] flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Fields */}
      {localSelectedMethods.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Method Configuration
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* External URL Configuration */}
            {localSelectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) && (
              <div className="lg:col-span-2">
                <label htmlFor="application_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application URL *
                </label>
                <input
                  id="application_url"
                  type="url"
                  value={localApplicationUrl}
                  onChange={handleUrlChange}
                  disabled={disabled}
                  placeholder="https://company.com/careers/apply"
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    errors.applicationUrl ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              {errors.applicationUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.applicationUrl}
                </p>
              )}
              {localApplicationUrl && !errors.applicationUrl && getFieldError('applicationUrl', localApplicationUrl) && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('applicationUrl', localApplicationUrl)}
                </p>
              )}
            </div>
          )}

            {/* Email Configuration */}
            {localSelectedMethods.includes(APPLICATION_METHODS.EMAIL) && (
              <div className="lg:col-span-2">
                <label htmlFor="application_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Email *
                </label>
                <input
                  id="application_email"
                  type="email"
                  value={localApplicationEmail}
                  onChange={handleEmailChange}
                  disabled={disabled}
                  placeholder="jobs@company.com"
                  className={`w-full bg-white dark:bg-gray-800 border rounded-md py-2 px-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    errors.applicationEmail ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              {errors.applicationEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.applicationEmail}
                </p>
              )}
              {localApplicationEmail && !errors.applicationEmail && getFieldError('applicationEmail', localApplicationEmail) && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('applicationEmail', localApplicationEmail)}
                </p>
              )}
            </div>
          )}

            {/* Internal System Info */}
            {localSelectedMethods.includes(APPLICATION_METHODS.INTERNAL) && (
              <div className="lg:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Internal Application System
                    </h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Applicants will use TechHub's built-in application system. No additional configuration required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Summary */}
      {localSelectedMethods.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                No Application Method Selected
              </h5>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                Please select at least one application method for job seekers to apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Errors */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the APPLICATION_METHODS constant for use in other components
export { APPLICATION_METHODS };