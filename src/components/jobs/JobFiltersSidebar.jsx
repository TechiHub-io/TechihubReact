// src/components/jobs/JobFiltersSidebar.jsx - Enhanced for both public & dashboard
import React, { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  Clock,
  GraduationCap,
  MapPin,
  DollarSign,
  Calendar,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Globe,
  Building2
} from 'lucide-react';
import SkillsFilter from './SkillsFilter';

export default function JobFiltersSidebar({ 
  filters = {}, 
  onFiltersChange,  // Updated to match PublicJobsList
  onClearFilters,
  expanded = true,   // Add collapsible support
  onToggleExpanded, // Add toggle handler
  className = "",
  showAdvancedFilters = true, // Hide some filters for simpler public view
  isAuthenticated = false,    // Show different options for auth users
}) {
  // Local state for filters
  const [localFilters, setLocalFilters] = useState({
    location: '',
    remote: false,
    job_type: '',
    experience_level: '',
    min_salary: '',
    max_salary: '',
    salary_currency: 'USD',
    skills: [],
    posted_within: '',
    education_level: '',
    company: '',
    category: '',
    ...filters
  });

  // Track if filters have been applied
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Check if any filters are active
  useEffect(() => {
    const isActive = localFilters.location ||
                    localFilters.remote ||
                    localFilters.job_type ||
                    localFilters.experience_level ||
                    localFilters.min_salary ||
                    localFilters.max_salary ||
                    localFilters.skills.length > 0 ||
                    localFilters.posted_within ||
                    localFilters.education_level ||
                    localFilters.company ||
                    localFilters.category;
    
    setHasActiveFilters(!!isActive);
  }, [localFilters]);

  // Handle filter changes - support both onFilterChange and onFiltersChange
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...localFilters, [filterName]: value };
    setLocalFilters(newFilters);
    
    // Support both callback patterns
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle skills change
  const handleSkillsChange = (skills) => {
    handleFilterChange('skills', skills);
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {
      location: '',
      remote: false,
      job_type: '',
      experience_level: '',
      min_salary: '',
      max_salary: '',
      salary_currency: 'USD',
      skills: [],
      posted_within: '',
      education_level: '',
      company: '',
      category: ''
    };
    
    setLocalFilters(clearedFilters);
    
    if (onClearFilters) {
      onClearFilters();
    } else if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    } else if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear All
            </button>
          )}
          {onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-6 ${!expanded ? 'hidden lg:block' : ''}`}>
        {/* Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Location
            </div>
          </label>
          <input
            type="text"
            value={localFilters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="City, state, or country"
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
        </div>

        {/* Remote Work */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="remote-work"
              type="checkbox"
              checked={localFilters.remote}
              onChange={(e) => handleFilterChange('remote', e.target.checked)}
              className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="remote-work" className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Globe className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              Remote Jobs Only
            </label>
          </div>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Job Type
            </div>
          </label>
          <select
            value={localFilters.job_type}
            onChange={(e) => handleFilterChange('job_type', e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white text-sm"
          >
            <option value="">All Types</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Experience Level
            </div>
          </label>
          <select
            value={localFilters.experience_level}
            onChange={(e) => handleFilterChange('experience_level', e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white text-sm"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Posted Within */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Posted Within
            </div>
          </label>
          <select
            value={localFilters.posted_within}
            onChange={(e) => handleFilterChange('posted_within', e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white text-sm"
          >
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last week</option>
            <option value="14">Last 2 weeks</option>
            <option value="30">Last month</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Salary Range
            </div>
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={localFilters.min_salary}
                onChange={(e) => handleFilterChange('min_salary', e.target.value)}
                placeholder="Min salary"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                value={localFilters.max_salary}
                onChange={(e) => handleFilterChange('max_salary', e.target.value)}
                placeholder="Max salary"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>
          </div>
          
          <select
            value={localFilters.salary_currency}
            onChange={(e) => handleFilterChange('salary_currency', e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white text-sm"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="KES">KES - Kenyan Shilling</option>
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="ZAR">ZAR - South African Rand</option>
          </select>
        </div>

        {/* Advanced Filters - Only show if enabled */}
        {showAdvancedFilters && (
          <>
            {/* Education Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Education Level
                </div>
              </label>
              <select
                value={localFilters.education_level}
                onChange={(e) => handleFilterChange('education_level', e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white text-sm"
              >
                <option value="">Any Education</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Company
                </div>
              </label>
              <input
                type="text"
                value={localFilters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Company name"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>
          </>
        )}

        {/* Skills */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Skills
          </label>
          <SkillsFilter 
            selectedSkills={localFilters.skills}
            onSkillsChange={handleSkillsChange}
          />
        </div>
      </div>
    </div>
  );
}