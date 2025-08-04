// src/components/layout/DashboardLayout.jsx - Fixed icons alignment and improved structure
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useMessages } from '@/hooks/useMessages';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Users,
  LayoutDashboard,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  Search,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Target,
  PlusCircle,
  UserCheck
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
      icon: LayoutDashboard
    },
    { 
      name: 'Find Talent', 
      href: '/dashboard/employer/talent-search', 
      icon: Target
    },
    { 
      name: 'Post a Job', 
      href: '/jobs/create', 
      icon: PlusCircle
    },
    { 
      name: 'My Jobs', 
      href: '/jobs/manage', 
      icon: Briefcase
    },
    { 
      name: 'Applications', 
      href: '/dashboard/employer/applications', 
      icon: UserCheck
    },
    { 
      name: 'Company Profile', 
      href: `/company/${company?.id || ''}`, 
      icon: Building2
    },
    { 
      name: 'Messages', 
      href: '/messages', 
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
    }, 
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings
    },
  ];
  
  const jobseekerLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard/jobseeker', 
      icon: LayoutDashboard
    },
    { 
      name: 'Find Jobs', 
      href: '/dashboard/jobseeker/jobs/search', 
      icon: Search
    },
    { 
      name: 'My Applications', 
      href: '/dashboard/jobseeker/applications', 
      icon: FileText
    },
    { 
      name: 'Saved Jobs', 
      href: '/dashboard/jobseeker/saved-jobs', 
      icon: Briefcase
    },
    { 
      name: 'Messages', 
      href: '/messages', 
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
    },
    { 
      name: 'My Profile', 
      href: '/dashboard/jobseeker/profile', 
      icon: User
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings
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
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0CCE68] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TechHub</span>
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
            <ul className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0CCE68] text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0CCE68] dark:hover:text-[#88FF99]'
                      }`}
                    >
                      <div className="flex items-center min-w-0">
                        <IconComponent 
                          className={`flex-shrink-0 h-5 w-5 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-gray-500 group-hover:text-[#0CCE68] dark:text-gray-400 dark:group-hover:text-[#88FF99]'
                          }`} 
                        />
                        <span className="ml-3 truncate">{link.name}</span>
                      </div>
                      {/* Badge for unread count */}
                      {link.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ml-2">
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
              className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
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
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden mr-4"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {isEmployer ? 'Employer Dashboard' : 'Job Seeker Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Help button */}
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </button>
                
                {/* Messages notification */}
                <Link
                  href="/messages"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
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
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {unreadMessagesCount > 0 && (
                          <Link
                            href="/messages"
                            className="block px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              You have {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Click to view</p>
                          </Link>
                        )}
                        
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Welcome to TechHub!</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Get started with your profile</p>
                        </div>
                      </div>
                      <div className="p-2 text-center">
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
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
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68]"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {user?.profile_picture ? (
                        <Image 
                          src={user.profile_picture} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full"
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
