// src/components/settings/ThemeSettings.jsx
import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

export default function ThemeSettings() {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useSettings();

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      description: 'Light theme for daytime use',
      icon: Sun,
      active: !isDarkMode
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Dark theme for low-light environments',
      icon: Moon,
      active: isDarkMode
    },
    {
      id: 'system',
      name: 'System',
      description: 'Follow your system preference',
      icon: Monitor,
      active: false // We'll implement this later
    }
  ];

  const handleThemeChange = (themeId) => {
    switch (themeId) {
      case 'light':
        setDarkMode(false);
        break;
      case 'dark':
        setDarkMode(true);
        break;
      case 'system':
        // Follow system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Theme Preferences
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose how TechHub looks to you
        </p>
      </div>

      {/* Theme Options */}
      <div className="space-y-3">
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              className={`w-full flex items-center p-4 border rounded-lg transition-colors ${
                option.active
                  ? 'border-[#0CCE68] bg-[#0CCE68]/5 dark:bg-[#0CCE68]/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                option.active
                  ? 'bg-[#0CCE68] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <IconComponent className="h-5 w-5" />
              </div>
              
              <div className="ml-4 flex-1 text-left">
                <h4 className={`text-sm font-medium ${
                  option.active
                    ? 'text-[#0CCE68]'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </p>
              </div>
              
              {option.active && (
                <div className="flex-shrink-0">
                  <div className="h-5 w-5 rounded-full bg-[#0CCE68] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Toggle */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Quick Toggle
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Switch between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-[#0CCE68]' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Preview
        </h4>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-[#0CCE68] rounded-full flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                TechHub Interface
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is how your interface will look
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}