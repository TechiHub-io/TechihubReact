// src/app/auth/register/page.js
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, Building2 } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';

const RegisterPage = () => {
  const router = useRouter();
  return (
    <AuthLayout>
      <img
          onClick={() => router.push('/')}
          src="/images/homepage/whitelogo.svg"
          className="w-16 absolute top-[8px] z-50 left-[50%] translate-x-[-50%] mx-auto lg:w-20 cursor-pointer"
          alt="TechHub Logo"
        />
      <main className='min-h-screen bg-white dark:bg-gray-900 flex flex-col lg:flex-row'>
        {/* Job Seeker Section */}
       
        <section className='flex-1 bg-[#364187] dark:bg-[#2a3875] relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute inset-0 bg-[url(/images/blogs/bg.svg)] bg-center bg-no-repeat bg-cover'></div>
          </div>
          
          <div className='relative z-10 min-h-screen lg:min-h-[600px] flex flex-col justify-center items-center p-6 lg:p-12'>
            <div className='max-w-md w-full space-y-8 text-center'>
              {/* Icon */}
              <div className='flex justify-center'>
                <div className='relative w-32 h-32 lg:w-40 lg:h-40'>
                  <Image 
                    src="/images/blogs/icona.svg" 
                    alt="Job Seeker Icon"
                    fill
                    className='object-contain'
                    priority
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className='space-y-4'>
                <div className='inline-flex items-center justify-center w-12 h-12 bg-[#0CCE68] rounded-full mb-4'>
                  <Users className='w-6 h-6 text-white' />
                </div>
                
                <h2 className='text-2xl lg:text-3xl font-bold text-white leading-tight'>
                  Looking for Tech Jobs?
                </h2>
                
                <p className='text-blue-100 text-sm lg:text-base max-w-sm mx-auto'>
                  Join thousands of tech professionals finding their dream careers
                </p>
              </div>
              
              {/* CTA Button */}
              <Link 
                href='/auth/register/jobseeker' 
                className="inline-flex items-center justify-center w-full max-w-xs px-6 py-3 text-base font-semibold text-white bg-[#0CCE68] hover:bg-[#0bbf5e] rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#0CCE68]/30"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Employer Section */}
        <section className='flex-1 bg-white dark:bg-gray-800 relative overflow-hidden border-l-0 lg:border-l-4 lg:border-l-[#0CCE68]'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-5 dark:opacity-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#0CCE68]/10 to-[#364187]/10'></div>
          </div>
          
          <div className='relative z-10 min-h-screen lg:min-h-[600px] flex flex-col justify-center items-center p-6 lg:p-12'>
            <div className='max-w-md w-full space-y-8 text-center'>
              {/* Content */}
              <div className='space-y-4'>
                <div className='inline-flex items-center justify-center w-12 h-12 bg-[#364187] dark:bg-[#0CCE68] rounded-full mb-4'>
                  <Building2 className='w-6 h-6 text-white' />
                </div>
                
                <h2 className='text-2xl lg:text-3xl font-bold text-[#364187] dark:text-white leading-tight'>
                  Looking for Tech Talent?
                </h2>
                
                <p className='text-gray-600 dark:text-gray-300 text-sm lg:text-base max-w-sm mx-auto'>
                  Connect with skilled developers and tech professionals
                </p>
              </div>
              
              {/* CTA Button */}
              <Link 
                href='/auth/register/employer' 
                className="inline-flex items-center justify-center w-full max-w-xs px-6 py-3 text-base font-semibold text-white bg-[#364187] hover:bg-[#2a3875] dark:bg-[#0CCE68] dark:hover:bg-[#0bbf5e] rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#364187]/30 dark:focus:ring-[#0CCE68]/30"
              >
                Start Hiring
              </Link>
              
              {/* Icon */}
              <div className='flex justify-center pt-4'>
                <div className='relative w-32 h-32 lg:w-40 lg:h-40'>
                  <Image 
                    src="/images/blogs/iconb.webp" 
                    alt="Employer Icon"
                    fill
                    className='object-contain'
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthLayout>
  );
};

export default RegisterPage;