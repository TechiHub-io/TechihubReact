// src/components/settings/PrivacySettings.jsx
import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useStore } from '@/hooks/useZustandStore';
import { Eye, EyeOff, Shield, Download, Trash2, AlertTriangle } from 'lucide-react';

export default function PrivacySettings() {
  const { settings, updatePrivacySettings, exportSettings } = useSettings();
  const { user, logout } = useStore(state => ({
    user: state.user,
    logout: state.logout
  }));

  const privacyOptions = [
    {
      id: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Allow employers to view your full profile and contact you',
      icon: Eye,
      enabled: settings.privacy.profileVisibility,
      important: true
    },
    {
      id: 'dataUsage',
      title: 'Data Usage for Recommendations',
      description: 'Allow us to use your profile data to provide better job recommendations',
      icon: Shield,
      enabled: settings.privacy.dataUsage,
      important: false
    },
    {
      id: 'showEmailToEmployers',
      title: 'Show Email to Employers',
      description: 'Display your email address on your public profile',
      icon: Eye,
      enabled: settings.privacy.showEmailToEmployers,
      important: false
    },
    {
      id: 'showPhoneToEmployers',
      title: 'Show Phone to Employers',
      description: 'Display your phone number on your public profile',
      icon: Eye,
      enabled: settings.privacy.showPhoneToEmployers,
      important: false
    }
  ];

  const handleToggle = (optionId) => {
    updatePrivacySettings({
      [optionId]: !settings.privacy[optionId]
    });
  };

  const handleDeleteAccount = () => {
    const confirmText = 'DELETE';
    const userInput = prompt(
      `This action cannot be undone. This will permanently delete your account and all associated data.\n\nType "${confirmText}" to confirm:`
    );
    
    if (userInput === confirmText) {
      // In a real app, this would call an API to delete the account
      alert('Account deletion would be processed here. This is a demo.');
      // logout();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Privacy & Data Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Control how your data is used and who can see your information
        </p>
      </div>

      {/* Privacy Options */}
      <div className="space-y-4">
        {privacyOptions.map((option) => {
          const IconComponent = option.enabled ? Eye : EyeOff;
          return (
            <div
              key={option.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  option.enabled
                    ? 'bg-[#0CCE68]/10 text-[#0CCE68]'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.title}
                    </h4>
                    {option.important && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(option.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  option.enabled ? 'bg-[#0CCE68]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    option.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Data Management */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Data Management
        </h4>
        
        <div className="space-y-3">
          {/* Export Data */}
          <button
            onClick={exportSettings}
            className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Download className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                  Export My Data
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Download a copy of your settings and preferences
                </p>
              </div>
            </div>
          </button>

          {/* Account Deletion */}
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-3 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h5 className="text-sm font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </h5>
                <p className="text-xs text-red-500 dark:text-red-400">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Privacy Notice
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              Disabling profile visibility may limit your job opportunities. Employers won't be able to find or contact you directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}