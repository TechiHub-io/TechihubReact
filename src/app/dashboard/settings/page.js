// src/app/dashboard/settings/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Lock, Bell, UserCircle, Shield, Palette, Eye, Users, CreditCard } from 'lucide-react';

// Import common components
import PasswordChangeForm from '@/components/settings/PasswordChangeForm';
import ThemeSettings from '@/components/settings/ThemeSettings';

// Import job seeker components
import NotificationSettings from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';

// Import employer components
import EmployerNotificationSettings from '@/components/settings/EmployerNotificationSettings';
import EmployerPrivacySettings from '@/components/settings/EmployerPrivacySettings';
import TeamSettings from '@/components/settings/TeamSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import CompanySwitcher from '@/components/settings/CompanySwitcher';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, company } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    company: state.company
  }));
  
  const [activeTab, setActiveTab] = useState('passwordchange');
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Handle company change
  const handleCompanyChange = (companyId) => {
    // Force refresh of current tab by updating key
    setRefreshKey(prev => prev + 1);
  };

  // Define tabs based on user role
  const getTabsForRole = () => {
    const commonTabs = [
      {
        id: 'passwordchange',
        name: 'Password',
        icon: Lock,
        component: PasswordChangeForm
      },
      {
        id: 'appearance', 
        name: 'Appearance',
        icon: Palette,
        component: ThemeSettings
      }
    ];

    if (isEmployer) {
      return [
        ...commonTabs,
        {
          id: 'notifications',
          name: 'Notifications',
          icon: Bell,
          component: EmployerNotificationSettings
        },
        {
          id: 'privacy', 
          name: 'Privacy',
          icon: Eye,
          component: EmployerPrivacySettings
        },
        {
          id: 'team',
          name: 'Team',
          icon: Users,
          component: TeamSettings
        },
        // {
        //   id: 'billing',
        //   name: 'Billing',
        //   icon: CreditCard,
        //   component: BillingSettings
        // }
      ];
    } else {
      return [
        ...commonTabs,
        {
          id: 'notifications',
          name: 'Notifications',
          icon: Bell,
          component: NotificationSettings
        },
        {
          id: 'privacy', 
          name: 'Privacy',
          icon: Eye,
          component: PrivacySettings
        }
      ];
    }
  };

  const tabs = getTabsForRole();
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ThemeSettings;
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Company Switcher for Employers */}
        {isEmployer && (
          <div className="mb-6">
            <CompanySwitcher onCompanyChange={handleCompanyChange} />
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#0CCE68]/10 text-[#0CCE68] border border-[#0CCE68]/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 ${
                      activeTab === tab.id ? 'text-[#0CCE68]' : 'text-gray-400'
                    }`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mt-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <ActiveComponent key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}