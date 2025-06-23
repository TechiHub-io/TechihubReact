// src/components/applications/ApplicationFilters.jsx
import React, { useState, useEffect } from 'react';
import { useApplicationStages } from '@/hooks/useApplicationStages';
import { 
  Filter, 
  X, 
  Search, 
  Calendar,
  Users,
  Briefcase,
  MapPin,
  Clock
} from 'lucide-react';

export default function ApplicationFilters({ 
  filters = {}, 
  onFiltersChange, 
  jobsList = [],
  className = "" 
}) {
  const { stages } = useApplicationStages();
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: '',
    stage_id: '',
    job_id: '',
    date_range: '',
    experience_level: '',
    location: '',
    ...filters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' }
  ];

  // Experience level options
  const experienceLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    
    if (onFiltersChange) {
      onFiltersChange(cleanFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters = {
      search: '',
      status: '',
      stage_id: '',
      job_id: '',
      date_range: '',
      experience_level: '',
      location: ''
    };
    setLocalFilters(emptyFilters);
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  // Count active filters
  const activeFiltersCount = Object.values(localFilters).filter(
    value => value && value !== ''
  ).length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filter Applications
            </h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-[#0CCE68] text-white rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium transition-colors"
            >
              {showAdvanced ? 'Less Filters' : 'More Filters'}
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search applicants..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
           />
         </div>

         {/* Status */}
         <div>
           <select
             value={localFilters.status}
             onChange={(e) => handleFilterChange('status', e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
           >
             {statusOptions.map(option => (
               <option key={option.value} value={option.value}>
                 {option.label}
               </option>
             ))}
           </select>
         </div>

         {/* Stage */}
         {stages.length > 0 && (
           <div>
             <select
               value={localFilters.stage_id}
               onChange={(e) => handleFilterChange('stage_id', e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
             >
               <option value="">All Stages</option>
               {stages.filter(stage => stage.is_active).map(stage => (
                 <option key={stage.id} value={stage.id}>
                   {stage.name}
                 </option>
               ))}
             </select>
           </div>
         )}

         {/* Date Range */}
         <div>
           <select
             value={localFilters.date_range}
             onChange={(e) => handleFilterChange('date_range', e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
           >
             {dateRangeOptions.map(option => (
               <option key={option.value} value={option.value}>
                 {option.label}
               </option>
             ))}
           </select>
         </div>
       </div>

       {/* Advanced Filters */}
       {showAdvanced && (
         <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Job Filter */}
             {jobsList.length > 0 && (
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   <Briefcase className="w-4 h-4 inline mr-1" />
                   Job Position
                 </label>
                 <select
                   value={localFilters.job_id}
                   onChange={(e) => handleFilterChange('job_id', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
                 >
                   <option value="">All Jobs</option>
                   {jobsList.map(job => (
                     <option key={job.id} value={job.id}>
                       {job.title}
                     </option>
                   ))}
                 </select>
               </div>
             )}

             {/* Experience Level */}
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 <Users className="w-4 h-4 inline mr-1" />
                 Experience Level
               </label>
               <select
                 value={localFilters.experience_level}
                 onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
               >
                 {experienceLevelOptions.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>

             {/* Location */}
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 <MapPin className="w-4 h-4 inline mr-1" />
                 Location
               </label>
               <input
                 type="text"
                 value={localFilters.location}
                 onChange={(e) => handleFilterChange('location', e.target.value)}
                 placeholder="City, country..."
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] text-sm"
               />
             </div>
           </div>
         </div>
       )}

       {/* Active Filters Display */}
       {activeFiltersCount > 0 && (
         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
           <div className="flex items-center space-x-2 text-sm">
             <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
             <div className="flex flex-wrap gap-2">
               {Object.entries(localFilters).map(([key, value]) => {
                 if (!value) return null;
                 
                 let displayValue = value;
                 let displayKey = key;

                 // Format display values
                 if (key === 'status') {
                   const option = statusOptions.find(opt => opt.value === value);
                   displayValue = option?.label || value;
                   displayKey = 'Status';
                 } else if (key === 'stage_id') {
                   const stage = stages.find(s => s.id === value);
                   displayValue = stage?.name || value;
                   displayKey = 'Stage';
                 } else if (key === 'date_range') {
                   const option = dateRangeOptions.find(opt => opt.value === value);
                   displayValue = option?.label || value;
                   displayKey = 'Date';
                 } else if (key === 'job_id') {
                   const job = jobsList.find(j => j.id === value);
                   displayValue = job?.title || value;
                   displayKey = 'Job';
                 } else if (key === 'experience_level') {
                   const option = experienceLevelOptions.find(opt => opt.value === value);
                   displayValue = option?.label || value;
                   displayKey = 'Experience';
                 } else if (key === 'search') {
                   displayKey = 'Search';
                 } else if (key === 'location') {
                   displayKey = 'Location';
                 }

                 return (
                   <span
                     key={key}
                     className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#0CCE68] bg-opacity-10 text-[#0CCE68] border border-[#0CCE68] border-opacity-20"
                   >
                     <span className="font-medium">{displayKey}:</span>
                     <span className="ml-1">{displayValue}</span>
                     <button
                       onClick={() => handleFilterChange(key, '')}
                       className="ml-2 hover:text-red-500 transition-colors"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 );
               })}
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}