// src/components/profile/ProfileEditTabs.jsx
'use client';
import { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, FileText, Upload, Link } from 'lucide-react';
import { useProfileStrength } from '@/hooks/useProfileStrength';
import BasicInfoSection from './sections/BasicInfoSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import CertificationsSection from './sections/CertificationsSection';
import PortfolioSection from './sections/PortfolioSection';
import DocumentsSection from './sections/DocumentsSection';

const tabs = [
  { id: 'basic', name: 'Basic Info', icon: User },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Award },
  { id: 'certifications', name: 'Certifications', icon: FileText },
  { id: 'portfolio', name: 'Portfolio', icon: Link },
  { id: 'documents', name: 'Documents', icon: Upload },
];

export default function ProfileEditTabs({ profile }) {
  const [activeTab, setActiveTab] = useState('basic');
  const { profileStrength } = useProfileStrength();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoSection profile={profile} />;
      case 'experience':
        return <ExperienceSection experiences={profile?.experiences || []} />;
      case 'education':
        return <EducationSection education={profile?.education || []} />;
      case 'skills':
        return <SkillsSection skills={profile?.skills || []} />;
      case 'certifications':
        return <CertificationsSection certifications={profile?.certifications || []} />;
      case 'portfolio':
        return <PortfolioSection portfolioItems={profile?.portfolio_items || []} />;
      case 'documents':
        return <DocumentsSection />;
      default:
        return <BasicInfoSection profile={profile} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <div className="lg:w-64 lg:flex-shrink-0">
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          {/* Profile Strength */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Strength
              </span>
              <span className="text-sm font-bold text-[#0CCE68]">
                {profileStrength}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#0CCE68] h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileStrength}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Complete your profile to attract more employers
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#0CCE68] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
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
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}