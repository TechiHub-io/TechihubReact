// src/components/admin/ApplicationMethodDemo.jsx
'use client';
import React, { useState } from 'react';
import { Save, RefreshCw, CheckCircle } from 'lucide-react';
import ApplicationMethodSelector, { APPLICATION_METHODS } from './ApplicationMethodSelector';
import ApplicationMethodPreview from './ApplicationMethodPreview';
import Button from '@/components/ui/Button';
import { 
  validateApplicationMethods, 
  formatApplicationMethodsForAPI,
  parseApplicationMethodsFromAPI 
} from '@/lib/utils/applicationMethodValidation';

export default function ApplicationMethodDemo() {
  const [selectedMethods, setSelectedMethods] = useState([APPLICATION_METHODS.INTERNAL]);
  const [applicationUrl, setApplicationUrl] = useState('');
  const [applicationEmail, setApplicationEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle method selection changes
  const handleMethodChange = (methods) => {
    setSelectedMethods(methods);
    // Clear errors when methods change
    setErrors({});
    setSaveSuccess(false);
  };

  // Handle URL changes
  const handleUrlChange = (url) => {
    setApplicationUrl(url);
    // Clear URL-specific errors
    if (errors.applicationUrl) {
      setErrors(prev => ({ ...prev, applicationUrl: undefined }));
    }
    setSaveSuccess(false);
  };

  // Handle email changes
  const handleEmailChange = (email) => {
    setApplicationEmail(email);
    // Clear email-specific errors
    if (errors.applicationEmail) {
      setErrors(prev => ({ ...prev, applicationEmail: undefined }));
    }
    setSaveSuccess(false);
  };

  // Validate and save configuration
  const handleSave = async () => {
    setIsLoading(true);
    setSaveSuccess(false);

    // Validate the configuration
    const validation = validateApplicationMethods(selectedMethods, applicationUrl, applicationEmail);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      // Format data for API
      const apiData = formatApplicationMethodsForAPI(selectedMethods, applicationUrl, applicationEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Application methods saved:', apiData);
      setSaveSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to save application methods. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default configuration
  const handleReset = () => {
    setSelectedMethods([APPLICATION_METHODS.INTERNAL]);
    setApplicationUrl('');
    setApplicationEmail('');
    setErrors({});
    setSaveSuccess(false);
  };

  // Load sample configuration
  const loadSampleConfig = () => {
    setSelectedMethods([
      APPLICATION_METHODS.INTERNAL,
      APPLICATION_METHODS.EXTERNAL_URL,
      APPLICATION_METHODS.EMAIL
    ]);
    setApplicationUrl('https://company.com/careers/apply');
    setApplicationEmail('jobs@company.com');
    setErrors({});
    setSaveSuccess(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Application Method Configuration Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure how job seekers can apply for positions. Multiple application methods can be enabled simultaneously.
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-green-700 dark:text-green-300 font-medium">
              Application methods saved successfully!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <ApplicationMethodSelector
              selectedMethods={selectedMethods}
              applicationUrl={applicationUrl}
              applicationEmail={applicationEmail}
              onMethodChange={handleMethodChange}
              onUrlChange={handleUrlChange}
              onEmailChange={handleEmailChange}
              errors={errors}
              allowMultiple={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || selectedMethods.length === 0}
              className="flex items-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset to Default
            </Button>

            <Button
              variant="ghost"
              onClick={loadSampleConfig}
              disabled={isLoading}
            >
              Load Sample Config
            </Button>
          </div>

          {/* Configuration Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Current Configuration
            </h4>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Methods:</span> {selectedMethods.length} selected
              </p>
              {selectedMethods.includes(APPLICATION_METHODS.INTERNAL) && (
                <p className="text-gray-600 dark:text-gray-400">
                  ✓ Internal TechHub system enabled
                </p>
              )}
              {selectedMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) && (
                <p className="text-gray-600 dark:text-gray-400">
                  ✓ External website: {applicationUrl || 'Not configured'}
                </p>
              )}
              {selectedMethods.includes(APPLICATION_METHODS.EMAIL) && (
                <p className="text-gray-600 dark:text-gray-400">
                  ✓ Email application: {applicationEmail || 'Not configured'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <ApplicationMethodPreview
            selectedMethods={selectedMethods}
            applicationUrl={applicationUrl}
            applicationEmail={applicationEmail}
          />
        </div>
      </div>

      {/* API Data Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Data Preview
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This is how the configuration will be formatted for the API:
        </p>
        <pre className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md p-4 text-sm overflow-x-auto">
          <code className="text-gray-800 dark:text-gray-200">
            {JSON.stringify(
              formatApplicationMethodsForAPI(selectedMethods, applicationUrl, applicationEmail),
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}