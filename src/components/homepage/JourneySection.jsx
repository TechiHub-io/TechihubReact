// src/components/homepage/JourneySection.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Search, Users, Briefcase, ArrowRight, Check } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/hooks/useZustandStore';

const JourneyStepCard = ({ step, index, isVisible, isActive, onClick }) => {
  const icons = {
    1: User,
    2: Search,
    3: Users,
    4: Briefcase
  };
  
  const IconComponent = icons[step.numb];
  
  const gradients = {
    1: "from-[#0CCE68] to-[#88FF99]",
    2: "from-[#364187] to-[#0CCE68]", 
    3: "from-[#88FF99] to-[#0CCE68]",
    4: "from-[#364187] to-[#88FF99]"
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border-2 transition-all duration-500 cursor-pointer min-h-[400px] flex flex-col ${
        isActive 
          ? 'border-[#0CCE68] dark:border-[#88FF99] shadow-xl shadow-[#0CCE68]/20 dark:shadow-[#88FF99]/20 scale-105' 
          : 'border-gray-200 dark:border-gray-700 hover:border-[#0CCE68]/50 dark:hover:border-[#88FF99]/50 hover:shadow-lg'
      } ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onClick={onClick}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-4 left-6 z-20">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradients[step.numb]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
          {step.numb}
        </div>
      </div>

      {/* Main Icon */}
      <div className="flex justify-center mb-6">
        <div className={`relative w-24 h-24 rounded-full bg-gradient-to-r ${gradients[step.numb]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-12 h-12 text-white" />
          
          {/* Pulse animation for active card */}
          {isActive && (
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradients[step.numb]} animate-ping opacity-30`} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center space-y-4">
        <h3 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
          isActive 
            ? 'text-[#0CCE68] dark:text-[#88FF99]' 
            : 'text-gray-900 dark:text-white group-hover:text-[#0CCE68] dark:group-hover:text-[#88FF99]'
        }`}>
          {step.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
          {step.des}
        </p>
      </div>

      {/* Connect Line (for desktop) */}
      {step.numb < 4 && (
        <div className="hidden lg:block absolute top-12 -right-6 z-10">
          <ArrowRight className={`w-6 h-6 transition-colors duration-300 ${
            isActive ? 'text-[#0CCE68] dark:text-[#88FF99]' : 'text-gray-300 dark:text-gray-600'
          }`} />
        </div>
      )}

      {/* Completion Checkmark */}
      {index < step.numb - 1 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#0CCE68] dark:bg-[#88FF99] rounded-full flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

const JourneySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Auto-advance steps for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => prev >= 4 ? 1 : prev + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const journeySteps = [
    {
      id: 1,
      numb: 1,
      title: 'Create Profile',
      des: "For job seekers, build a standout profile showcasing your skills and experience. Employers, set up your company profile to start connecting with top-tier talent.",
    },
    {
      id: 2,
      numb: 2,
      title: 'Explore Opportunities',
      des: 'Browse through our dynamic job board or talent pool. Job seekers, find the perfect role. Employers, discover exceptional tech talent that aligns with your requirements.',
    },
    {
      id: 3,
      numb: 3,
      title: 'Engage with the Community',
      des: "Join discussions, share insights, and network with like-minded individuals on our vibrant community platform. TechHub is not just a platform; it's your tech community.",
    },
    {
      id: 4,
      numb: 4,
      title: 'Streamlined Recruitment Process',
      des: "For employers, post jobs effortlessly and manage applications through our seamless recruitment process. Job seekers, experience a user-friendly application process that brings opportunities close.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % journeySteps.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + journeySteps.length) % journeySteps.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-[#0CCE68]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0CCE68]/10"
      aria-labelledby="journey-heading"
    >
      {/* TechHub Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-[#88FF99]/10 dark:bg-[#88FF99]/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#364187]/5 dark:bg-[#364187]/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/20 text-[#0CCE68] dark:text-[#88FF99] rounded-full text-sm font-medium mb-6 border border-[#0CCE68]/20 dark:border-[#88FF99]/30">
            <Briefcase className="w-4 h-4 mr-2" />
            Your Journey
          </div>
          
          <h2 
            id="journey-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white mb-6"
          >
            Getting Started with 
            <span className="text-[#0CCE68] dark:text-[#88FF99]"> TechHub</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow these simple steps to unlock your potential and connect with the right opportunities
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-12">
          {journeySteps.map((step, index) => (
            <JourneyStepCard
              key={step.id}
              step={step}
              index={index}
              isVisible={isVisible}
              isActive={activeStep === step.numb}
              onClick={() => setActiveStep(step.numb)}
            />
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {journeySteps.map((step, index) => (
                <div key={step.id} className="w-full flex-shrink-0 px-4">
                  <JourneyStepCard
                    step={step}
                    index={index}
                    isVisible={isVisible}
                    isActive={true}
                    onClick={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-[#0CCE68] hover:bg-[#0CCE68]/90 text-white transition-colors duration-300 shadow-lg"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {journeySteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSlide === index 
                      ? 'bg-[#0CCE68] dark:bg-[#88FF99]' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-[#0CCE68] hover:bg-[#0CCE68]/90 text-white transition-colors duration-300 shadow-lg"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className={`mt-12 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-[#0CCE68] dark:text-[#88FF99]">
                Step {activeStep} of 4
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-[#0CCE68] to-[#88FF99] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(activeStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button className="group inline-flex items-center px-8 py-4 bg-[#0CCE68] hover:bg-[#0CCE68]/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0CCE68]/25 hover:-translate-y-0.5">
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;