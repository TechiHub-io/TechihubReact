// src/components/settings/EmployerNotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Bell, Mail, Users, Briefcase, Clock, AlertCircle } from 'lucide-react';

export default function EmployerNotificationSettings() {
  const { company } = useStore(state => ({ company: state.company }));
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Global notifications (user-level)
    emailNotifications: true,
    inAppNotifications: true,
    securityAlerts: true,
    platformUpdates: true,
    
    // Company-specific notifications
    newApplications: true,
    teamActivities: true,
    jobExpiries: true,
    candidateMessages: true,
    applicationStatusUpdates: true
  });

  useEffect(() => {
    // Fetch notification preferences when component mounts or company changes
    if (company?.id) {
      fetchNotificationSettings();
    }
  }, [company?.id]);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_FRONT_URL}/notifications/preferences/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map API response to our state structure
        setSettings(prevSettings => ({
          ...prevSettings,
          emailNotifications: data.email_notifications ?? true,
          inAppNotifications: data.in_app_notifications ?? true,
          newApplications: data.new_application ?? true,
          candidateMessages: data.new_message ?? true,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    try {
      const token = localStorage.getItem('auth_token');
      
      // Map our state keys to API keys
      const apiKeyMap = {
        emailNotifications: 'email_notifications',
        inAppNotifications: 'in_app_notifications',
        newApplications: 'new_application',
        candidateMessages: 'new_message',
      };

      const apiKey = apiKeyMap[key] || key;
      
      await fetch(`${process.env.NEXT_PUBLIC_API_FRONT_URL}/notifications/preferences/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [apiKey]: value }),
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  const notificationCategories = [
    {
      id: 'newApplications',
      title: 'New Applications',
      description: 'Get notified when candidates apply to your job postings',
      icon: Briefcase,
      enabled: settings.newApplications,
      companySpecific: true
    },
    {
      id: 'candidateMessages',
      title: 'Candidate Messages',
      description: 'Receive notifications for messages from job applicants',
      icon: Mail,
      enabled: settings.candidateMessages,
      companySpecific: true
    },
    {
      id: 'teamActivities',
      title: 'Team Activities',
      description: 'Updates when team members join or leave your company',
      icon: Users,
      enabled: settings.teamActivities,
      companySpecific: true
    },
    {
      id: 'jobExpiries',
      title: 'Job Expiry Reminders',
      description: 'Get reminded before your job postings expire',
      icon: Clock,
      enabled: settings.jobExpiries,
      companySpecific: true
    },
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive important notifications via email',
      icon: Mail,
      enabled: settings.emailNotifications,
      companySpecific: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage how you receive updates about your company and candidates
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CCE68]"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Company-specific section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company: {company?.name}
            </h4>
            
            {notificationCategories.filter(cat => cat.companySpecific).map((category) => {
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
                  
                  <button
                    onClick={() => updateSettings(category.id, !category.enabled)}
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

          {/* Global notifications section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Global Settings
            </h4>
            
            {notificationCategories.filter(cat => !cat.companySpecific).map((category) => {
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
                  
                  <button
                    onClick={() => updateSettings(category.id, !category.enabled)}
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

          {/* Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Role-Based Delivery
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Notifications are delivered based on team member roles. Admins receive most notifications while recruiters only see job-related updates.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}