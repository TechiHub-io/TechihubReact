// src/components/homepage/TestimonialsSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, Quote, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/hooks/useZustandStore';

const TestimonialCard = ({ rating, name, role, testimonial, avatar, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert star rating to number for proper star display
  const starCount = rating.split('⭐').length - 1;
  
  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-[#0CCE68]/10 dark:hover:shadow-[#88FF99]/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer min-h-[320px] flex flex-col justify-between ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* TechHub gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0CCE68]/5 to-[#88FF99]/5 dark:from-[#0CCE68]/10 dark:to-[#88FF99]/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
      
      {/* Quote icon */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Quote className="w-8 h-8 text-[#0CCE68] dark:text-[#88FF99]" />
      </div>
      
      <div className="relative z-10 space-y-6">
        {/* Star Rating */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < starCount
                  ? 'text-[#0CCE68] fill-current dark:text-[#88FF99]'
                  : 'text-gray-300 dark:text-gray-600'
              } transition-colors duration-300`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            ({starCount}/5)
          </span>
        </div>
        
        {/* Testimonial Text */}
        <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
          "{testimonial}"
        </blockquote>
      </div>
      
      {/* Author Info */}
      <div className="relative z-10 flex items-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Image
            src={avatar}
            width={48}
            height={48}
            alt={`${name} - ${role}`}
            className="rounded-full ring-2 ring-[#0CCE68]/20 dark:ring-[#88FF99]/30 group-hover:ring-[#0CCE68]/40 dark:group-hover:ring-[#88FF99]/50 transition-all duration-300"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0CCE68] dark:bg-[#88FF99] rounded-full border-2 border-white dark:border-gray-800" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#0CCE68] dark:group-hover:text-[#88FF99] transition-colors duration-300">
            {name}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">{role}</p>
        </div>
        
        {/* Hover arrow */}
        <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
          isHovered ? 'translate-x-0' : 'translate-x-2'
        }`}>
          <ArrowRight className="w-5 h-5 text-[#0CCE68] dark:text-[#88FF99]" />
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = ({ title = "Success Stories" }) => {
  const [isVisible, setIsVisible] = useState(false);
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

  const testimonials = [
    {
      id: 1,
      rating: "⭐⭐⭐⭐",
      name: "Emma Mutuku",
      avatar: "/images/homepage/person.svg",
      role: "People Operations Manager at SnappyCX",
      testimonial: "I had an outstanding experience hiring a software developer through Techihub. The process was smooth, the candidates were top-notch, and the customer support was excellent."
    },
    {
      id: 2,
      rating: "⭐⭐⭐⭐⭐",
      name: "John Njoroge",
      avatar: "/images/homepage/person.svg",
      role: "Chief Technology Officer",
      testimonial: "Techihubs job board not only exposed our openings to a wider pool of talent than traditional methods but also helped on a faster expansion and presence in a new market region."
    },
    {
      id: 3,
      rating: "⭐⭐⭐⭐",
      name: "Angel Keza",
      avatar: "/images/homepage/person.svg",
      role: "Product Designer",
      testimonial: "Techihub streamlined my job search. The platform is user-friendly with smart filters that helped me find my perfect remote role."
    },
  ];

  // Calculate stats from testimonials
  const totalReviews = testimonials.length;
  const averageRating = testimonials.reduce((acc, t) => acc + (t.rating.split('⭐').length - 1), 0) / totalReviews;

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-[#0CCE68]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0CCE68]/10"
      aria-labelledby="testimonials-heading"
    >
      {/* TechHub Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Updated gradient with TechHub colors */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#0CCE68]/10 via-[#88FF99]/10 to-[#364187]/10 dark:from-[#0CCE68]/5 dark:via-[#88FF99]/5 dark:to-[#364187]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#88FF99]/10 dark:bg-[#88FF99]/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#364187]/5 dark:bg-[#364187]/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/20 text-[#0CCE68] dark:text-[#88FF99] rounded-full text-sm font-medium mb-6 border border-[#0CCE68]/20 dark:border-[#88FF99]/30">
            <Users className="w-4 h-4 mr-2" />
            Client Testimonials
          </div>
          
          <h2 
            id="testimonials-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white mb-6"
          >
            {title}
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Don't just take our word for it. Here's what our community has to say about their TechHub experience.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-center">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-[#0CCE68] fill-current dark:text-[#88FF99]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Based on {totalReviews}+ reviews
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              rating={testimonial.rating}
              name={testimonial.name}
              role={testimonial.role}
              testimonial={testimonial.testimonial}
              avatar={testimonial.avatar}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to join our success stories?
          </p>
          <button className="group inline-flex items-center px-6 py-3 bg-[#0CCE68] hover:bg-[#0CCE68]/90 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0CCE68]/25 hover:-translate-y-0.5">
            Share Your Story
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;