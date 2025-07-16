// src/components/layout/Header.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/hooks/useZustandStore';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Settings, 
  User,
  Building2,
  LogOut,
  Briefcase,
  Heart,
  MessageSquare,
  Shield
} from 'lucide-react';

export default function Header() {
  const { 
    isAuthenticated, 
    user, 
    company, 
    logout, 
    isDarkMode, 
    toggleDarkMode,
    notifications 
  } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    company: state.company,
    logout: state.logout,
    isDarkMode: state.isDarkMode,
    toggleDarkMode: state.toggleDarkMode,
    notifications: state.notifications || []
  }));
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Generate profile URL based on user role
  const getProfileUrl = () => {
    if (!user) return '/profile';
    
    if (user.is_employer) {
      if (company?.id) {
        return `/company/${company.id}`;
      } else {
        return '/dashboard/employer';
      }
    } else {
      return '/profile';
    }
  };

  // Generate dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/dashboard';
    return user.is_employer ? '/dashboard/employer' : '/dashboard/jobseeker';
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200 dark:border-gray-700 py-2' 
        : 'bg-white/80 dark:bg-gray-900/80 py-4'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image 
                src="/images/blogs/logoa.webp"
                alt="TechHub"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#0CCE68]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
            <span className="text-2xl font-bold text-[#0CCE68] dark:text-[#88FF99] group-hover:text-[#0BBB5C] dark:group-hover:text-[#0CCE68] transition-colors">
              TechHub
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className={`relative transition-all duration-300 ${
                searchFocused ? 'transform scale-105' : ''
              }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] dark:focus:ring-[#88FF99] focus:border-transparent transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/jobs" 
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors font-medium"
              >
                <Briefcase className="h-4 w-4" />
                <span>Find Jobs</span>
              </Link>
              
            
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                    className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-all duration-300"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#0CCE68] dark:bg-[#88FF99] text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 5).map((notification, index) => (
                            <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            No notifications
                          </div>
                        )}
                      </div>
                     
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68] dark:focus:ring-[#88FF99]"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-r from-[#0CCE68] to-[#88FF99] flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                      {user?.profile_picture ? (
                        <Image 
                          src={user.profile_picture} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-white">
                          {user?.first_name?.charAt(0) || 'U'}
                        </span>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#0CCE68] dark:bg-[#88FF99] rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.first_name || 'Account'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.is_employer ? 'Employer' : 'Job Seeker'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          href={getDashboardUrl()} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 mr-3" />
                          Dashboard
                        </Link>
                        <Link 
                          href={getProfileUrl()} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          {user?.is_employer ? (
                            <Building2 className="h-4 w-4 mr-3" />
                          ) : (
                            <User className="h-4 w-4 mr-3" />
                          )}
                          {user?.is_employer ? 'Company Profile' : 'Profile'}
                        </Link>
                        
                        {!user?.is_employer && (
                          <>
                            <Link 
                              href="/dashboard/jobseeker/saved-jobs" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Heart className="h-4 w-4 mr-3" />
                              Saved Jobs
                            </Link>
                            <Link 
                              href="/applications" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Briefcase className="h-4 w-4 mr-3" />
                              My Applications
                            </Link>
                          </>
                        )}
                        
                        <Link 
                          href="/messages" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <MessageSquare className="h-4 w-4 mr-3" />
                          Messages
                        </Link>
                        <Link 
                          href="/settings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors font-medium"
                >
                  Log in
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-gradient-to-r from-[#0CCE68] to-[#88FF99] text-white px-6 py-2.5 rounded-lg hover:from-[#0BBB5C] hover:to-[#0CCE68] transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] dark:focus:ring-[#88FF99] focus:border-transparent"
              />
            </form>

            {/* Mobile Links */}
            <Link 
              href="/jobs" 
              className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              <span>Find Jobs</span>
            </Link>

            {/* Theme Toggle Mobile */}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors font-medium w-full"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center space-x-3 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0CCE68] to-[#88FF99] flex items-center justify-center">
                    {user?.profile_picture ? (
                      <Image 
                        src={user.profile_picture} 
                        alt="Profile" 
                        width={36} 
                        height={36} 
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {user?.first_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.is_employer ? 'Employer' : 'Job Seeker'}
                    </p>
                  </div>
                </div>

                <Link 
                  href={getDashboardUrl()} 
                  className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href={getProfileUrl()} 
                  className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user?.is_employer ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span>{user?.is_employer ? 'Company Profile' : 'Profile'}</span>
                </Link>
                <Link 
                  href="/settings" 
                  className="flex items-center space-x-2 py-3 text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/auth/login" 
                  className="block w-full py-3 text-center text-gray-700 dark:text-gray-300 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block w-full py-3 text-center bg-gradient-to-r from-[#0CCE68] to-[#88FF99] text-white rounded-lg hover:from-[#0BBB5C] hover:to-[#0CCE68] transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}