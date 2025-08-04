'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useAuthAxios } from '@/hooks/useAuthAxios';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Search,
  User,
  Users,
  Briefcase,
  X,
  ArrowRight,
  Clock,
  Mail,
  MapPin
} from 'lucide-react';

export default function QuickSearchHeader() {
  const router = useRouter();
  const authAxios = useAuthAxios();
  const { isAuthenticated, isEmployer } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({
    profiles: [],
    applications: []
  });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Helper function to get proper image URL
  const getProfileImageUrl = (profile) => {
    let imageUrl = profile?.profile_picture || profile?.social_avatar_url;
    
    if (!imageUrl) return null;
    
    // Fix Google profile image URLs
    if (imageUrl.includes('googleusercontent.com')) {
      // Remove size parameters and add proper size
      imageUrl = imageUrl.split('=')[0] + '=s96-c';
    }
    
    return imageUrl;
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Load recent searches from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse recent searches:', error);
        }
      }
    }
  }, []);
  
  // Save recent search
  const saveRecentSearch = (term) => {
    if (!term.trim() || typeof window === 'undefined') return;
    
    const updated = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };
  
  // Search function
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim() || !authAxios || !isEmployer) {
        setResults({ profiles: [], applications: [] });
        return;
      }
      
      setLoading(true);
      try {
        // Search profiles and applications concurrently
        const [profilesResponse, applicationsResponse] = await Promise.all([
          authAxios.get(`profiles/?search=${encodeURIComponent(debouncedSearchTerm)}&page_size=5`),
          authAxios.get(`applications/?search=${encodeURIComponent(debouncedSearchTerm)}&page_size=5`)
        ]);
        
        setResults({
          profiles: profilesResponse.data.results || [],
          applications: applicationsResponse.data.results || []
        });
      } catch (error) {
        console.error('Search failed:', error);
        setResults({ profiles: [], applications: [] });
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchTerm, authAxios, isEmployer]);
  
  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      router.push(`/dashboard/employer/talent-search?search=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };
  
  // Navigate to profile
  const navigateToProfile = (profileId) => {
    router.push(`/profile/${profileId}`);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  // Navigate to application
  const navigateToApplication = (applicationId) => {
    router.push(`/applications/${applicationId}`);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  // Use recent search
  const useRecentSearch = (term) => {
    setSearchTerm(term);
    setIsOpen(true);
  };
  
  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };
  
  // Don't render for job seekers or unauthenticated users
  if (!isAuthenticated || !isEmployer) {
    return null;
  }
  
  const hasResults = results.profiles.length > 0 || results.applications.length > 0;
  const showRecentSearches = !debouncedSearchTerm && recentSearches.length > 0;
  
  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search candidates or applications..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-colors"
            style={{ minWidth: '300px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0CCE68] mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : debouncedSearchTerm && !hasResults ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">No results found</p>
              <button
                onClick={handleSearchSubmit}
                className="mt-2 text-sm text-[#0CCE68] hover:text-[#0BBE58] flex items-center justify-center mx-auto"
              >
                Search in talent directory
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ) : (
            <div className="py-2">
              {/* Recent Searches */}
              {showRecentSearches && (
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => useRecentSearch(term)}
                      className="flex items-center w-full px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Clock className="w-4 h-4 mr-3 text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Candidate Results */}
              {results.profiles.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Candidates ({results.profiles.length})
                  </h3>
                  {results.profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => navigateToProfile(profile.id)}
                      className="flex items-center w-full px-2 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden mr-3">
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
                        <User className="w-4 h-4 text-gray-400" style={{display: getProfileImageUrl(profile) ? 'none' : 'block'}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {profile.user_name}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          {profile.job_title && (
                            <>
                              <Briefcase className="w-3 h-3 mr-1" />
                              <span className="truncate">{profile.job_title}</span>
                            </>
                          )}
                          {profile.job_title && profile.country && (
                            <span className="mx-1">•</span>
                          )}
                          {profile.country && (
                            <>
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{profile.country}</span>
                            </>
                          )}
                        </div>
                        {profile.user_email && (
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            <span className="truncate">{profile.user_email}</span>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Application Results */}
              {results.applications.length > 0 && (
                <div className="px-4 py-2">
                  {results.profiles.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  )}
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Applications ({results.applications.length})
                  </h3>
                  {results.applications.map((application) => (
                    <button
                      key={application.id}
                      onClick={() => navigateToApplication(application.id)}
                      className="flex items-center w-full px-2 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {application.applicant_name || 'Unknown Applicant'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Applied for: {application.job_title || application.job?.title || 'Unknown Position'}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'applied' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            application.status === 'screening' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            application.status === 'interview' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                            application.status === 'offer' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            application.status === 'hired' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}>
                            {application.status_display || application.status}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* View All Results */}
              {debouncedSearchTerm && hasResults && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="flex items-center justify-center w-full py-2 text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium"
                  >
                    View all results for "{debouncedSearchTerm}"
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
