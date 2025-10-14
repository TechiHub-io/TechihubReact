'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
import {
  ExternalLink,
  Mail,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ApplicationMethodSelector({ job, onMethodSelect }) {
  const router = useRouter();
  const { submitExternalApplication, loading, error } = useApplications();
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!job?.application_methods || job.application_methods.length <= 1) {
    // If there's only one method, auto-select it
    const method = job.application_methods?.[0];
    if (method && !selectedMethod) {
      setSelectedMethod(method);
      onMethodSelect?.(method);
    }
    return null;
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    onMethodSelect?.(method);
  };

  const handleExternalApplication = async (method) => {
    try {
      const result = await submitExternalApplication(job.id, {
        application_method: method.type
      });
      
      // Redirect to external URL
      if (result.redirect_url) {
        window.open(result.redirect_url, '_blank');
      }
    } catch (err) {
      console.error('Error tracking external application:', err);
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'internal':
        return <FileText className="w-5 h-5" />;
      case 'external_url':
        return <ExternalLink className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getMethodDescription = (method) => {
    switch (method.type) {
      case 'internal':
        return 'Complete your application directly on TechHub with your saved documents and profile information.';
      case 'external_url':
        return 'Apply directly on the company\'s website. We\'ll track your application for you.';
      case 'email':
        return 'Send your application via email. We\'ll track that you applied.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Choose How to Apply
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        This job offers multiple ways to apply. Choose the method that works best for you.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {job.application_methods.map((method) => (
          <div
            key={method.type}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod?.type === method.type
                ? 'border-[#0CCE68] bg-green-50 dark:bg-green-900/10'
                : 'border-gray-200 dark:border-gray-600 hover:border-[#0CCE68] hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleMethodSelect(method)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedMethod?.type === method.type
                    ? 'bg-[#0CCE68] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {getMethodIcon(method.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </h4>
                    {method.primary && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getMethodDescription(method)}
                  </p>
                  
                  {method.url && method.type === 'external_url' && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">
                      {method.url}
                    </p>
                  )}
                  
                  {method.email && method.type === 'email' && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {method.email}
                    </p>
                  )}
                </div>
              </div>
              
              {selectedMethod?.type === method.type && (
                <CheckCircle className="w-5 h-5 text-[#0CCE68] flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedMethod(null)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Change Method
            </button>
            
            {selectedMethod.type === 'internal' ? (
              <button
                onClick={() => router.push(`/jobs/${job.id}/apply`)}
                className="px-6 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors flex items-center"
              >
                Continue Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => handleExternalApplication(selectedMethod)}
                disabled={loading}
                className="px-6 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
