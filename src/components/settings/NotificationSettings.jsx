// src/components/settings/NotificationSettings.jsx
import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Bell, Mail, MessageSquare, Briefcase, Star, AlertCircle } from 'lucide-react';

export default function NotificationSettings() {
  const { settings, updateNotificationSettings, updatePreferences } = useSettings();

  const notificationCategories = [
    {
      id: 'applicationUpdates',
      title: 'Application Updates',
      description: 'Get notified when your application status changes',
      icon: Briefcase,
      enabled: settings.notifications.applicationUpdates
    },
    {
      id: 'jobRecommendations',
      title: 'Job Recommendations',
      description: 'Receive personalized job recommendations based on your profile',
      icon: Star,
      enabled: settings.notifications.jobRecommendations
    },
    {
      id: 'newMessages',
      title: 'New Messages',
      description: 'Get notified when you receive new messages from employers',
      icon: MessageSquare,
      enabled: settings.notifications.newMessages
    },
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive important notifications via email',
      icon: Mail,
      enabled: settings.notifications.emailNotifications
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Emails',
      description: 'Receive newsletters and promotional content',
      icon: Bell,
      enabled: settings.notifications.marketingEmails
    }
  ];

  const handleToggle = (notificationId) => {
    updateNotificationSettings({
      [notificationId]: !settings.notifications[notificationId]
    });
  };

  const enableAll = () => {
    const allEnabled = {};
    notificationCategories.forEach(category => {
      allEnabled[category.id] = true;
    });
    updateNotificationSettings(allEnabled);
  };

  const disableAll = () => {
    const allDisabled = {};
    notificationCategories.forEach(category => {
      allDisabled[category.id] = false;
    });
    updateNotificationSettings(allDisabled);
  };

  const enabledCount = notificationCategories.filter(cat => cat.enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose what notifications you want to receive
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {enabledCount} of {notificationCategories.length} notifications enabled
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={enableAll}
            className="px-3 py-1 text-xs bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
          >
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Disable All
          </button>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-4">
        {notificationCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  category.enabled
                    ? 'bg-[#0CCE68]/10 text-[#0CCE68]'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(category.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  category.enabled ? 'bg-[#0CCE68]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    category.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Email Frequency Settings */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Email Frequency
        </h4>
        <div className="space-y-2">
          {['immediate', 'daily', 'weekly'].map((frequency) => (
            <label key={frequency} className="flex items-center">
              <input
                type="radio"
                name="emailFrequency"
                value={frequency}
                checked={settings.preferences.emailFrequency === frequency}
                onChange={(e) => updatePreferences({
                  emailFrequency: e.target.value
                })}
                className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                {frequency}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Important Notifications
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Some notifications like security alerts and account updates cannot be disabled for your safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}