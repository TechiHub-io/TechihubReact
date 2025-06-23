// src/components/layout/PublicLayout.jsx - Layout for public job pages
'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { 
  Search, 
  User, 
  UserPlus, 
  Menu, 
  X, 
  Briefcase,
  Building2,
  Home,
  Phone,
  Mail
} from 'lucide-react';
import { useState } from 'react';
import Footer from './Footer';
import Header from './Header';

export default function PublicLayout({ children, showBreadcrumbs = false, breadcrumbs = [] }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, isEmployer, user } = useStore(state => ({
    isAuthenticated: state.isAuthenticated || false,
    isEmployer: state.isEmployer || false,
    user: state.user
  }));

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'About', href: '/about', icon: Home },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-2 py-3 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
     <Footer />
    </div>
  );
}