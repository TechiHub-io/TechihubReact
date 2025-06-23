// src/components/homepage/CTASection.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Briefcase, Zap, Star, Heart } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/hooks/useZustandStore';

const CTASection = ({ title, description, link, buttonText, buttonVariant, variant = 'default' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isDarkMode } = useStore(state => ({ isDarkMode: state.isDarkMode }));
  
  const [sectionRef, isInViewport] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isInViewport) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInViewport]);

  // Different variant styles for different CTAs
  const variants = {
    default: {
      background: 'bg-gradient-to-br from-[#0CCE68]/10 via-white to-[#88FF99]/10 dark:from-[#0CCE68]/10 dark:via-gray-900 dark:to-[#88FF99]/10',
      cardBg: 'bg-white dark:bg-gray-800',
      iconColor: 'text-[#0CCE68] dark:text-[#88FF99]',
      borderColor: 'border-[#0CCE68]/20 dark:border-[#88FF99]/30'
    },
    employer: {
      background: 'bg-gradient-to-br from-[#364187]/10 via-white to-[#0CCE68]/10 dark:from-[#364187]/10 dark:via-gray-900 dark:to-[#0CCE68]/10',
      cardBg: 'bg-white dark:bg-gray-800',
      iconColor: 'text-[#364187] dark:text-[#0CCE68]',
      borderColor: 'border-[#364187]/20 dark:border-[#0CCE68]/30'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  // Button icons based on button text/variant
  const getButtonIcon = () => {
    if (buttonText?.toLowerCase().includes('job')) return Briefcase;
    if (buttonText?.toLowerCase().includes('talent') || buttonText?.toLowerCase().includes('hire')) return Users;
    return ArrowRight;
  };

  const ButtonIcon = getButtonIcon();

  return (
    <section 
      ref={sectionRef}
      className={`relative py-16 md:py-20 ${currentVariant.background}`}
      aria-labelledby="cta-heading"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/5 rounded-full blur-2xl opacity-60 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-[#88FF99]/10 dark:bg-[#88FF99]/5 rounded-full blur-2xl opacity-40 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#364187]/5 dark:bg-[#364187]/10 rounded-full blur-xl opacity-30 animate-pulse delay-2000" />
        
        {/* Decorative Icons */}
        <div className="absolute top-12 left-12 opacity-10 dark:opacity-5">
          <Sparkles className="w-8 h-8 text-[#0CCE68] animate-pulse" />
        </div>
        <div className="absolute bottom-12 right-12 opacity-10 dark:opacity-5">
          <Zap className="w-6 h-6 text-[#88FF99] animate-pulse delay-1000" />
        </div>
        <div className="absolute top-20 right-20 opacity-10 dark:opacity-5">
          <Star className="w-5 h-5 text-[#364187] animate-pulse delay-500" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main CTA Card */}
          <div 
            className={`relative ${currentVariant.cardBg} rounded-3xl p-8 lg:p-12 border ${currentVariant.borderColor} shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Gradient Overlay on Hover */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-[#0CCE68]/5 to-[#88FF99]/5 dark:from-[#0CCE68]/10 dark:to-[#88FF99]/10 opacity-0 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : ''
              }`}
            />
            
            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              {/* Icon Badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0CCE68] to-[#88FF99] rounded-2xl mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>

              {/* Main Heading */}
              <h2 
                id="cta-heading"
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                {title}
              </h2>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={link} className="group">
                  <button 
                    className={`inline-flex items-center px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      buttonVariant === 'primary'
                        ? 'bg-white border-2 border-[#0CCE68] text-[#0CCE68] hover:bg-[#0CCE68] hover:text-white hover:shadow-[#0CCE68]/25'
                        : buttonVariant === 'secondary'
                        ? 'bg-[#0CCE68] text-white hover:bg-[#0CCE68]/90 hover:shadow-[#0CCE68]/25'
                        : 'bg-gradient-to-r from-[#0CCE68] to-[#88FF99] text-white hover:from-[#0CCE68]/90 hover:to-[#88FF99]/90 hover:shadow-[#0CCE68]/25'
                    }`}
                  >
                    <ButtonIcon className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    {buttonText}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>

                {/* Secondary Action */}
                <Link href="/about" className="group">
                  <button className="inline-flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#88FF99] font-medium transition-colors duration-300">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>

              {/* Stats/Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                {[
                  { icon: Users, label: 'Active Users', value: '50K+' },
                  { icon: Briefcase, label: 'Jobs Posted', value: '10K+' },
                  { icon: Star, label: 'Success Rate', value: '95%' },
                  { icon: Zap, label: 'Avg. Hire Time', value: '7 Days' }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className={`text-center transition-all duration-700 delay-${200 + index * 100} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-[#0CCE68]/10 to-[#88FF99]/10 mb-2 ${currentVariant.iconColor}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0CCE68]/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#88FF99]/10 to-transparent rounded-tr-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Combined CTA Section for multiple CTAs
export const DualCTASection = ({ ctaData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useStore(state => ({ isDarkMode: state.isDarkMode }));
  
  const [sectionRef, isInViewport] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isInViewport) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInViewport]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-[#0CCE68]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0CCE68]/10"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-[#0CCE68]/5 dark:bg-[#0CCE68]/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-[#88FF99]/5 dark:bg-[#88FF99]/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to 
            <span className="text-[#0CCE68] dark:text-[#88FF99]"> Transform</span> Your Future?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who have already discovered their dream opportunities through TechHub
          </p>
        </div>

        {/* Dual CTA Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {ctaData.map((cta, index) => (
            <div 
              key={index}
              className={`group transition-all duration-700 delay-${index * 200} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-[#0CCE68]/10 dark:hover:shadow-[#88FF99]/10 transition-all duration-500 hover:-translate-y-2 h-full">
                {/* Card Content */}
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#0CCE68] to-[#88FF99] rounded-xl shadow-lg">
                    {cta.buttonText?.includes('Jobs') ? (
                      <Briefcase className="w-7 h-7 text-white" />
                    ) : (
                      <Users className="w-7 h-7 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#0CCE68] dark:group-hover:text-[#88FF99] transition-colors duration-300">
                      {cta.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {cta.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link href={cta.link}>
                    <button className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                      cta.buttonVariant === 'primary'
                        ? 'bg-white border-2 border-[#0CCE68] text-[#0CCE68] hover:bg-[#0CCE68] hover:text-white'
                        : 'bg-[#0CCE68] text-white hover:bg-[#0CCE68]/90'
                    }`}>
                      {cta.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#0CCE68]/10 to-transparent rounded-bl-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;