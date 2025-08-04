'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useAuthAxios } from '@/hooks/useAuthAxios';
import { useDebounce } from '@/hooks/useDebounce';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search,
  Filter,
  Save,
  Users,
  MapPin,
  Star,
  Calendar,
  Briefcase,
  Building,
  Eye,
  Heart,
  Mail,
  MoreVertical,
  ArrowRight,
  BookmarkPlus,
  Settings,
  Grid3x3,
  List,
  X
} from 'lucide-react';

export default function TalentSearchPage() {
  const router = useRouter();
  const authAxios = useAuthAxios();
  const { isAuthenticated, isEmployer } = useStore();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: '',
    min_experience: '',
    max_experience: '',
    job_title: '',
    country: '',
    salary_min: '',
    salary_max: '',
    education_level: ''
  });
  
  // Results state
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Saved searches state
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Helper function to get proper image URL
  const getProfileImageUrl = (profile) => {
    let imageUrl = profile.profile_picture || profile.social_avatar_url;
    
    if (!imageUrl) return null;
    
    // Fix Google profile image URLs
    if (imageUrl.includes('googleusercontent.com')) {
      // Remove size parameters and add proper size
      imageUrl = imageUrl.split('=')[0] + '=s200-c';
    }
    
    return imageUrl;
  };
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !isEmployer) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isEmployer, router]);
  
  // Search function
  const searchProfiles = useCallback(async (page = 1) => {
    if (!authAxios) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.min_experience) params.append('min_experience', filters.min_experience);
      if (filters.max_experience) params.append('max_experience', filters.max_experience);
      if (filters.job_title) params.append('job_title', filters.job_title);
      if (filters.country) params.append('country', filters.country);
      if (filters.salary_min) params.append('salary_min', filters.salary_min);
      if (filters.salary_max) params.append('salary_max', filters.salary_max);
      if (filters.education_level) params.append('education_level', filters.education_level);
      params.append('page', page.toString());
      
      const response = await authAxios.get(`profiles/?${params.toString()}`);
      
      if (page === 1) {
        setProfiles(response.data.results || []);
      } else {
        setProfiles(prev => [...prev, ...(response.data.results || [])]);
      }
      
      setTotalResults(response.data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search failed:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [authAxios, debouncedSearchTerm, filters]);
  
  // Load saved searches
  const loadSavedSearches = useCallback(async () => {
    if (!authAxios) return;
    
    try {
      const response = await authAxios.get('saved-searches/');
      setSavedSearches(response.data.results || []);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }, [authAxios]);
  
  // Save current search
  const saveCurrentSearch = async () => {
    if (!authAxios || !saveSearchName.trim()) {
      console.error('Missing authAxios or search name');
      return;
    }
    
    try {
      const searchParams = {
        search: debouncedSearchTerm,
        ...filters
      };
      
      // Remove empty parameters
      Object.keys(searchParams).forEach(key => {
        if (!searchParams[key] || searchParams[key] === '') {
          delete searchParams[key];
        }
      });
      
      console.log('Saving search with params:', { name: saveSearchName, search_params: searchParams });
      
      const response = await authAxios.post('saved-searches/', {
        name: saveSearchName,
        search_params: searchParams,
        email_alerts: false
      });
      
      console.log('Save search response:', response.data);
      
      setSaveSearchName('');
      setShowSaveModal(false);
      loadSavedSearches();
      
      // Show success message
      alert('Search saved successfully!');
    } catch (error) {
      console.error('Failed to save search:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to save search: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Execute saved search
  const executeSavedSearch = async (savedSearchId) => {
    if (!authAxios) return;
    
    try {
      const response = await authAxios.post(`saved-searches/${savedSearchId}/execute_search/`);
      setProfiles(response.data.results || []);
      setTotalResults(response.data.total_results || 0);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to execute saved search:', error);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      skills: '',
      min_experience: '',
      max_experience: '',
      job_title: '',
      country: '',
      salary_min: '',
      salary_max: '',
      education_level: ''
    });
  };
  
  // Initial load
  useEffect(() => {
    searchProfiles(1);
    loadSavedSearches();
  }, [debouncedSearchTerm, filters, searchProfiles, loadSavedSearches]);
  
  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  // Profile card component
  const ProfileCard = ({ profile }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {getProfileImageUrl(profile) ? (
              <img 
                src={getProfileImageUrl(profile)} 
                alt={profile.user_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Users className="w-8 h-8 text-gray-400" style={{display: getProfileImageUrl(profile) ? 'none' : 'block'}} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.user_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {profile.job_title || 'No title specified'}
            </p>
            {profile.user_email && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {profile.user_email}
              </p>
            )}
          </div>
        </div>
        {/* <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/profile/${profile.id}`)}
            className="p-2 text-gray-400 hover:text-[#0CCE68] transition-colors"
            title="View Profile"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Save Profile">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Contact">
            <Mail className="w-5 h-5" />
          </button>
        </div> */}
      </div>
      
      {profile.bio && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {profile.bio}
        </p>
      )}
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{profile.years_experience} years experience</span>
        </div>
        {profile.country && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{profile.country}</span>
          </div>
        )}
        {profile.recent_experience && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <Building className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div>Currently: {profile.recent_experience.job_title}</div>
              <div>at {profile.recent_experience.company_name}</div>
            </div>
          </div>
        )}
      </div>
      
      {profile.skills && profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#0CCE68]/10 text-[#0CCE68] text-xs rounded-full"
            >
              {skill.name}
            </span>
          ))}
          {profile.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{profile.skills.length - 4} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(profile.profile_strength / 20)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {profile.profile_strength}% complete
          </span>
        </div>
        <button
          onClick={() => router.push(`/profile/${profile.id}`)}
          className="text-[#0CCE68] hover:text-[#0BBE58] cursor-pointer text-sm font-medium flex items-center"
        >
          View Profile
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
  
  if (!isAuthenticated || !isEmployer) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Talent Search
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Discover and connect with talented professionals
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {(debouncedSearchTerm || Object.values(filters).some(v => v)) && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Search
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skills, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent"
            />
            {(searchTerm || Object.values(filters).some(v => v)) && (
              <button
                onClick={clearAllFilters}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Saved Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => executeSavedSearch(search.id)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {search.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Advanced Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Python, Design..."
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Developer, Designer..."
                  value={filters.job_title}
                  onChange={(e) => handleFilterChange('job_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Kenya, Uganda..."
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Education Level
                </label>
                <select
                  value={filters.education_level}
                  onChange={(e) => handleFilterChange('education_level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                >
                  <option value="">Any</option>
                  <option value="diploma">Diploma</option>
                  <option value="certificate">Certificate</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="masters">Masters</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.min_experience}
                  onChange={(e) => handleFilterChange('min_experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="20"
                  value={filters.max_experience}
                  onChange={(e) => handleFilterChange('max_experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Salary (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.salary_min}
                  onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Salary (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="200000"
                  value={filters.salary_max}
                  onChange={(e) => handleFilterChange('salary_max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {loading ? 'Searching...' : `${totalResults} candidates found`}
            </h2>
            {totalResults > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {profiles.length} of {totalResults} results
              </p>
            )}
          </div>
        </div>
        
        {/* Results */}
        {loading && profiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Searching for candidates...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or filters to find more candidates.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div 
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
        
        {/* Load More */}
        {profiles.length < totalResults && (
          <div className="text-center mt-8">
            <button
              onClick={() => searchProfiles(currentPage + 1)}
              disabled={loading}
              className="px-6 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
        
        {/* Save Search Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save Search
              </h3>
              <input
                type="text"
                placeholder="Enter search name..."
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#0CCE68] focus:border-[#0CCE68] mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCurrentSearch}
                  disabled={!saveSearchName.trim()}
                  className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
