// src/components/layout/Footer.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/hooks/useZustandStore';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useStore(state => ({ isDarkMode: state.isDarkMode }));

  return (
    <footer className="bg-[#364187] dark:bg-gray-900 text-white dark:text-gray-100 pt-12 pb-6 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative mr-3">
                <Image 
                  src="/images/blogs/logoa.webp"
                  alt="TechHub"
                  width={50}
                  height={50}
                  className="transition-transform hover:scale-105"
                />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#0CCE68] dark:text-[#88FF99] transition-colors">
                TechHub
              </h3>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-md text-base lg:text-lg leading-relaxed">
              Your gateway to professional opportunities in the tech industry. 
              Connect with top talent and leading companies to build your future.
            </p>
            <div className="flex space-x-5">
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors duration-300 hover:scale-110 transform" 
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors duration-300 hover:scale-110 transform" 
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.031 10.031 0 01-3.127 1.195 4.942 4.942 0 00-8.39 4.49A13.98 13.98 0 011.64 3.24a4.944 4.944 0 001.53 6.575 4.931 4.931 0 01-2.235-.617v.063a4.943 4.943 0 003.958 4.85 4.979 4.979 0 01-2.23.084 4.935 4.935 0 004.6 3.42 9.916 9.916 0 01-7.3 2.042 13.954 13.954 0 007.546 2.212c9.054 0 14.004-7.5 14.004-14.001 0-.21 0-.42-.015-.63A9.997 9.997 0 0024 4.59"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors duration-300 hover:scale-110 transform" 
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors duration-300 hover:scale-110 transform" 
                aria-label="Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1">
            <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-white dark:text-gray-100">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/jobs" 
                  className="text-gray-300 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] transition-colors duration-300 text-base"
                >
                  Find Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="sm:col-span-1">
            <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-white dark:text-gray-100">
              Support & Legal
            </h4>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600 dark:border-gray-700 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 dark:text-gray-500 text-sm lg:text-base text-center sm:text-left">
              © {currentYear} TechHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}