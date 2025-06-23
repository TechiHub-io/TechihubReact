// Enhanced FeaturesSection with TechHub brand colors
'use client';

import { useEffect, useState } from 'react';
import { Rocket, Users, Star, Globe, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useStore } from '@/hooks/useZustandStore';

const FeaturesSection = () => {
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

  const features = [
    {
      id: 1,
      icon: Rocket,
      title: "Seamless Recruitment",
      description: "Your journey to finding the perfect tech talent starts right here, right now. At Techihub, we're not just another platform; Get ready to elevate your hiring game, connect with top-notch technologists, and shape the future of your team!",
      gradient: "from-[#0CCE68] to-[#88FF99]", // TechHub primary to accent
      bgColor: "bg-[#0CCE68]/10 dark:bg-[#0CCE68]/20",
      borderColor: "border-[#0CCE68]/30 dark:border-[#0CCE68]/40",
      iconColor: "text-[#0CCE68] dark:text-[#88FF99]"
    },
    {
      id: 2,
      icon: Users,
      title: "Project Staffing",
      description: "Embrace the agility of project-based staffing with our Project Contracting services. Whether you need a specialized skillset for a specific project or seek to augment your team's capabilities, our Staff on Demand solutions provide the flexibility you need.",
      gradient: "from-[#364187] to-[#0CCE68]", // TechHub secondary to primary
      bgColor: "bg-[#364187]/10 dark:bg-[#364187]/20",
      borderColor: "border-[#364187]/30 dark:border-[#364187]/40",
      iconColor: "text-[#364187] dark:text-[#364187]"
    },
    {
      id: 3,
      icon: Star,
      title: "Empowering Careers",
      description: "For job seekers, Techihub is not just a platform – it's a launchpad to elevate your career. Unleash your potential and turn your passion into a profession with our empowering opportunities.",
      gradient: "from-[#88FF99] to-[#0CCE68]", // TechHub accent to primary
      bgColor: "bg-[#88FF99]/10 dark:bg-[#88FF99]/20",
      borderColor: "border-[#88FF99]/30 dark:border-[#88FF99]/40",
      iconColor: "text-[#0CCE68] dark:text-[#88FF99]"
    },
    {
      id: 4,
      icon: Globe,
      title: "Largest Tech Network",
      description: "Our community is where tech enthusiasts and industry experts unite. For job seekers, it's a one-stop-shop for tech jobs, career advice, and a network of like-minded peers. For employers, it's a hub to discover talent, share insights, and stay ahead of innovation.",
      gradient: "from-[#364187] to-[#88FF99]", // TechHub secondary to accent
      bgColor: "bg-gradient-to-br from-[#364187]/5 to-[#0CCE68]/5 dark:from-[#364187]/10 dark:to-[#0CCE68]/10",
      borderColor: "border-[#0CCE68]/30 dark:border-[#88FF99]/40",
      iconColor: "text-[#364187] dark:text-[#0CCE68]"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-[#0CCE68]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0CCE68]/10"
      aria-labelledby="features-heading"
    >
      {/* Background Pattern with TechHub colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#88FF99]/10 dark:bg-[#88FF99]/5 rounded-full blur-3xl opacity-40" />
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
            <Star className="w-4 h-4 mr-2" />
            Why Choose TechHub
          </div>
          
          <h2 
            id="features-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Built for Modern 
            <span className="text-[#0CCE68] dark:text-[#88FF99]"> Tech Teams</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are ready to accelerate your vision, whether looking for an opportunity 
            or looking for great tech talent, we exist for you!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button className="group inline-flex items-center px-8 py-4 bg-[#0CCE68] hover:bg-[#0CCE68]/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0CCE68]/25 hover:-translate-y-0.5">
            Explore All Features
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border ${feature.borderColor} hover:shadow-xl hover:shadow-[#0CCE68]/10 dark:hover:shadow-[#88FF99]/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`,
        minHeight: '320px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* TechHub Gradient Background on Hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
      />
      
      {/* Icon */}
      <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-current border-opacity-20`}>
        <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#0CCE68] dark:group-hover:text-[#88FF99] transition-colors duration-300">
          {feature.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
      
      {/* Hover Arrow with TechHub colors */}
      <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
        isHovered ? 'translate-x-0' : 'translate-x-2'
      }`}>
        <ArrowRight className={`w-5 h-5 ${feature.iconColor}`} />
      </div>
      
      {/* Number Badge with TechHub accent */}
      <div className="absolute top-6 right-6 w-8 h-8 bg-[#88FF99]/20 dark:bg-[#0CCE68]/20 rounded-full flex items-center justify-center border border-[#0CCE68]/30">
        <span className="text-sm font-bold text-[#0CCE68] dark:text-[#88FF99]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default FeaturesSection;