// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import { useStore } from './useZustandStore';

const SETTINGS_STORAGE_KEY = 'techhub-user-settings';

const DEFAULT_SETTINGS = {
  notifications: {
    applicationUpdates: true,
    jobRecommendations: true,
    emailNotifications: true,
    newMessages: true,
    marketingEmails: false,
  },
  privacy: {
    profileVisibility: true,
    dataUsage: true,
    showEmailToEmployers: false,
    showPhoneToEmployers: false,
  },
  preferences: {
    language: 'en',
    timezone: 'UTC',
    emailFrequency: 'immediate', // immediate, daily, weekly
  }
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isDarkMode, toggleDarkMode, setDarkMode } = useStore(state => ({
    isDarkMode: state.isDarkMode,
    toggleDarkMode: state.toggleDarkMode,
    setDarkMode: state.setDarkMode
  }));

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
      return false;
    }
  };

  // Update notification settings
  const updateNotificationSettings = (notificationSettings) => {
    return saveSettings({
      notifications: { ...settings.notifications, ...notificationSettings }
    });
  };

  // Update privacy settings
  const updatePrivacySettings = (privacySettings) => {
    return saveSettings({
      privacy: { ...settings.privacy, ...privacySettings }
    });
  };

  // Update preferences
  const updatePreferences = (preferences) => {
    return saveSettings({
      preferences: { ...settings.preferences, ...preferences }
    });
  };

  // Reset all settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  // Export settings data
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'techhub-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import settings data
  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          const isValid = validateSettingsStructure(importedSettings);
          
          if (isValid) {
            saveSettings(importedSettings);
            resolve(true);
          } else {
            reject(new Error('Invalid settings file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse settings file'));
        }
      };
      reader.readAsText(file);
    });
  };

  // Validate settings structure
  const validateSettingsStructure = (settingsToValidate) => {
    const requiredKeys = ['notifications', 'privacy', 'preferences'];
    return requiredKeys.every(key => settingsToValidate.hasOwnProperty(key));
  };

  const clearError = () => setError(null);

  return {
    settings,
    loading,
    error,
    isDarkMode,
    
    // Actions
    updateNotificationSettings,
    updatePrivacySettings,
    updatePreferences,
    toggleDarkMode,
    setDarkMode,
    resetSettings,
    exportSettings,
    importSettings,
    clearError
  };
}