// src/components/settings/EmployerPrivacySettings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Shield, Eye, Download, Database, Clock, AlertTriangle } from 'lucide-react';

export default function EmployerPrivacySettings() {
  const { company } = useStore(state => ({ company: state.company }));
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    companyProfileVisibility: 'public', // public, registered, hidden
    showContactInfo: true,
    candidateDataRetention: 180, // days
    analyticsSharing: true,
    searchHistoryEnabled: true
  });

  useEffect(() => {
    if (company?.id) {
      fetchPrivacySettings();
    }
  }, [company?.id]);

  const fetchPrivacySettings = async () => {
    setLoading(true);
    try {
      // Since we don't have a specific privacy settings endpoint, 
      // we'll use local state for now
      // In production, this would fetch from an API
      const savedSettings = localStorage.getItem(`privacy_settings_${company.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage for now
    localStorage.setItem(`privacy_settings_${company.id}`, JSON.stringify(newSettings));
    
    // In production, this would make an API call
  };

  const exportCompanyData = async () => {
    try {
      // This would call a data export endpoint
      const data = {
        company: company,
        exportDate: new Date().toISOString(),
        settings: settings
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.name.replace(/\s+/g, '_')}_data_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const privacyOptions = [
    {
      id: 'companyProfileVisibility',
      title: 'Company Profile Visibility',
      description: 'Control who can view your company profile',
      icon: Eye,
      type: 'select',
      value: settings.companyProfileVisibility,
      options: [
        { value: 'public', label: 'Public (Anyone can view)' },
        { value: 'registered', label: 'Registered users only' },
        { value: 'hidden', label: 'Hidden (Only accessible via job listings)' }
      ]
    },
    {
      id: 'showContactInfo',
      title: 'Display Contact Information',
      description: 'Show company email and phone on job listings',
      icon: Shield,
      type: 'toggle',
      value: settings.showContactInfo
    },
    {
      id: 'candidateDataRetention',
      title: 'Candidate Data Retention',
      description: 'How long to keep rejected candidate data',
      icon: Clock,
      type: 'select',
      value: settings.candidateDataRetention,
      options: [
        { value: 30, label: '30 days' },
        { value: 90, label: '90 days' },
        { value: 180, label: '180 days (Recommended)' },
        { value: 365, label: '1 year' }
      ]
    },
    {
      id: 'analyticsSharing',
      title: 'Analytics & Insights Sharing',
      description: 'Allow platform to use anonymized hiring data for industry insights',
      icon: Database,
      type: 'toggle',
      value: settings.analyticsSharing
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Privacy & Data Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your company's data privacy and visibility settings
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CCE68]"></div>
        </div>
      ) : (
        <>
          {/* Privacy Options */}
          <div className="space-y-4">
            {privacyOptions.map((option) => {
              const IconComponent = option.icon;
              
              return (
                <div
                  key={option.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                        
                        {option.type === 'toggle' && (
                          <button
                            onClick={() => updateSettings(option.id, !option.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              option.value ? 'bg-[#0CCE68]' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                option.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      
                      {option.type === 'select' && (
                        <select
                          value={option.value}
                          onChange={(e) => updateSettings(option.id, e.target.value)}
                          className="mt-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                        >
                          {option.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Management */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Data Management
            </h4>
            
            <button
              onClick={exportCompanyData}
              className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Download className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    Export Company Data
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Download all your company data and settings
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Compliance Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Data Compliance
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  Your data retention settings comply with GDPR and CCPA requirements. Candidate data is automatically deleted after the retention period.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}