// src/components/layout/AdminDashboardLayout.jsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Users,
  LayoutDashboard,
  Briefcase,
  Building2,
  Settings,
  HelpCircle,
  Shield,
  BarChart3
} from 'lucide-react';

function AdminDashboardLayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin } = useAdminAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Protected route check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated && !isAdmin) {
      // Redirect non-admin users to appropriate dashboard
      router.push('/dashboard/employer');
    }
  }, [isAuthenticated, isAdmin, router]);

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
  
  const adminLinks = [
    { 
      name: 'Overview', 
      href: '/dashboard/admin', 
      icon: LayoutDashboard
    },
    { 
      name: 'Job Management', 
      href: '/dashboard/admin?tab=jobs', 
      icon: Briefcase
    },
    { 
      name: 'Companies', 
      href: '/dashboard/admin?tab=companies', 
      icon: Building2
    },
    { 
      name: 'Users', 
      href: '/dashboard/admin?tab=users', 
      icon: Users
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/admin?tab=analytics', 
      icon: BarChart3
    },
    { 
      name: 'System Settings', 
      href: '/dashboard/admin?tab=settings', 
      icon: Settings
    },
  ];
 
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Loading Admin Dashboard...
          </h2>
        </div>
      </div>
    );
  }

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
               <Image 
                src="/images/blogs/logoa.webp"
                alt="TechHub"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">TechHub</span>
                <span className="text-xs text-[#0CCE68] font-medium">Admin Panel</span>
              </div>
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
              {adminLinks.map((link) => {
                let isActive = false;
                const currentTab = searchParams.get('tab');
                
                if (link.href === '/dashboard/admin') {
                  // Overview tab - active when no tab parameter or tab=overview
                  isActive = !currentTab || currentTab === 'overview';
                } else if (link.href.includes('?tab=')) {
                  // Other tabs - check if current URL matches the tab parameter
                  const tabName = link.href.split('?tab=')[1];
                  isActive = currentTab === tabName;
                } else {
                  isActive = pathname === link.href;
                }
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
                
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-[#0CCE68]" />
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Help button */}
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </button>
                
                {/* User profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0CCE68] flex items-center justify-center overflow-hidden">
                      {user?.profile_picture ? (
                        <Image 
                          src={user.profile_picture} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full"
                        />
                      ) : (
                        <Shield className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.first_name || 'Admin'}
                      </div>
                      <div className="text-xs text-[#0CCE68] font-medium">
                        Super Admin
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.email || 'admin@techihub.io'}
                        </p>
                        <p className="text-xs text-[#0CCE68] font-medium">Super Administrator</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/dashboard/admin?tab=settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Admin Settings
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

export default function AdminDashboardLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Loading Admin Dashboard...
          </h2>
        </div>
      </div>
    }>
      <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>
    </Suspense>
  );
}