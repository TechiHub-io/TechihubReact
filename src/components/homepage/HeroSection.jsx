// src/components/homepage/HeroSection.jsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Star, Users, MapPin } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/hooks/useZustandStore';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useStore(state => ({ isDarkMode: state.isDarkMode }));
  
  const [sectionRef, isInViewport] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isInViewport) {
      const timer = setTimeout(() => setIsVisible(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isInViewport]);

  // Stats data that could be fetched from API
  const stats = [
    { icon: Users, label: 'Active Job Seekers', value: '50K+', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Star, label: 'Success Rate', value: '95%', color: 'text-yellow-600 dark:text-yellow-400' },
    { icon: MapPin, label: 'Countries', value: '15+', color: 'text-green-600 dark:text-green-400' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center py-12 md:py-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 max-w-8xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div 
            className={`space-y-8 text-center lg:text-left transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
              <Star className="w-4 h-4 mr-2" />
              Africa's Leading Tech Platform
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="text-green-500 dark:text-white">Connecting</span>{' '}
                <span className="text-green-500 dark:text-primary-400">Tech Talents</span>{' '}
                <span className="text-green-500 dark:text-white">with</span>{' '}
                <span className="relative">
                  <span className="text-green-500 dark:text-primary-400">Opportunities</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-green-500 dark:text-primary-800"
                    viewBox="0 0 100 12"
                    fill="currentColor"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,8 Q50,0 100,8 L100,12 L0,12 Z" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Techihub is a digital tech community connecting top talent with leading companies 
                across Africa and beyond to create innovative solutions for the world.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/jobs">
                <button className="group inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-green-500 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5">
                  Find Your Dream Job
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              
              <Link href="/auth/register?type=employer">
                <button className="group inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg">
                  <Play className="mr-2 w-5 h-5" />
                  Hire Top Talent
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`text-center transition-all duration-700 delay-${300 + index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 mb-2 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div 
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  src="/images/homepage/heroimg.svg"
                  width={583}
                  height={598}
                  alt="Tech professionals collaborating and connecting on TechHub platform"
                  priority
                  className="w-full h-auto max-w-lg mx-auto"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-bounce delay-1000">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">1,234</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">New matches today</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-bounce delay-2000">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">98% Success</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Placement rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;