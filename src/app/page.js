// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import JourneySection from '@/components/homepage/JourneySection';
import CTASection from '@/components/homepage/CTASection';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const jobSeekerCTA = {
    title: 'Ready to Transform your Career? Join the Tribe!',
    description: 'Are you a techie ready to embark on a journey of endless possibilities? Join Techihub, where your skills meet unparalleled opportunities. Elevate your tech career with us!',
    link: '/jobs',
    buttonText: 'Explore Jobs',
    buttonVariant: 'primary'
  };

  const employerCTA = {
    title: 'Ready to Grow your Business?',
    description: 'Are you an employer seeking top-tier tech talent? We are glad that you are here. We bridge the talent and skills gaps in your organizations with a pool of ready to sprint skilled talent.',
    link: '/jobs',
    buttonText: 'Post Jobs',
    buttonVariant: 'secondary'
  };

  return (
    <div className={`flex flex-col min-h-screen ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Header />
      
      <main className="flex-grow relative">
        {/* Background gradient */}
        <div className="absolute top-[-200px] left-0 w-[749px] h-[673px] opacity-80 pointer-events-none">
          <Image
            src="/images/homepage/gradient.svg"
            fill
            alt="Background gradient"
            priority
          />
        </div>

        {/* Main content */}
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection title="Success Stories" />
        <JourneySection />
        <CTASection {...jobSeekerCTA} variant="default" />
        <CTASection {...employerCTA} variant="employer" />
      </main>
      
      <Footer />
    </div>
  );
}