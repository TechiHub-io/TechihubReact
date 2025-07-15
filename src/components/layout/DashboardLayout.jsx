// src/components/layout/DashboardLayout.jsx - Add messages and notifications
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useMessages } from '@/hooks/useMessages'; // Add this import
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Briefcase,
  Building,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  Search,
  HelpCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isEmployer, user, logout, company } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    user: state.user,
    logout: state.logout,
    company: state.company
  }));
  
  // Add messaging hook for unread count
  const { conversations, fetchConversations } = useMessages();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Calculate unread messages count
  const unreadMessagesCount = conversations.reduce((total, conv) => {
    return total + (conv.unread_count || 0);
  }, 0);
  
  // Fetch conversations on mount to get unread count
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);
  
  // Protected route check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Handle window resizing for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const employerLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard/employer', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Post a Job', 
      href: '/jobs/create', 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      name: 'My Jobs', 
      href: '/jobs/manage', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Applications', 
      href: '/dashboard/employer/applications', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Company Profile', 
      href: `/company/${company?.id || ''}`, 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      name: 'Messages', 
      href: '/messages', 
      icon: <MessageSquare className="h-5 w-5" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null // Add badge
    }, 
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
    
  ];
  
  const jobseekerLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard/jobseeker', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Find Jobs', 
      href: '/dashboard/jobseeker/jobs/search', 
      icon: <Search className="h-5 w-5" /> 
    },
    { 
      name: 'My Applications', 
      href: '/dashboard/jobseeker/applications', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Saved Jobs', 
      href: '/dashboard/jobseeker/saved-jobs', 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      name: 'Messages', // Add messages for job seekers
      href: '/messages', 
      icon: <MessageSquare className="h-5 w-5" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
    },
    { 
      name: 'My Profile', 
      href: '/dashboard/jobseeker/profile', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];
  
  const links = isEmployer ? employerLinks : jobseekerLinks;
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/shared/logoa.svg" alt="logo" className="h-8" />
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#0CCE68] text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        {link.icon}
                        <span className="ml-3">{link.name}</span>
                      </div>
                      {/* Badge for unread count */}
                      {link.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {link.badge > 99 ? '99+' : link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* <button
                  onClick={toggleSidebar}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {sidebarOpen ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button> */}
                
                <h1 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {isEmployer ? 'Employer Dashboard' : 'Job Seeker Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Help button */}
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <HelpCircle className="h-5 w-5" />
                </button>
                
                {/* Messages notification */}
                <Link
                  href="/messages"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
                  >
                    <Bell className="h-5 w-5" />
                    {/* Show notification indicator if there are unread messages */}
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {unreadMessagesCount > 0 && (
                          <Link
                            href="/messages"
                            className="block px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              You have {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Click to view</p>
                          </Link>
                        )}
                        
                        {/* Placeholder notifications */}
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Welcome to TechHub!</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Get started with your profile</p>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-[#0CCE68] hover:text-[#0BBE58]"
                        >
                          Close notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {user?.profile_picture ? (
                        <Image 
                          src={user.profile_picture} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {user?.first_name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.first_name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} TechHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}