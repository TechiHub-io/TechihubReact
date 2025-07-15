// src/app/auth/login/page.js
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/hooks/useZustandStore';
import Cookies from 'js-cookie';
import Image from 'next/image';
import AuthLayout from '@/components/layout/AuthLayout';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';

const LoginPage = () => {
  const { login, loading, error, clearError } = useStore(state => ({
    login: state.login,
    loading: state.loading,
    error: state.error,
    clearError: state.clearError
  }));
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();
  
  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    
    // Check if already authenticated via cookies
    const token = Cookies.get('auth_token');
    if (token) {
      // Let middleware handle the redirect
      router.refresh();
    }
  }, [clearError, router]);

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear global error when user types
    if (error) {
      clearError();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Normalize email to lowercase before sending
      const normalizedFormData = {
        ...formData,
        email: formData.email.toLowerCase()
      };
      
      const result = await login(normalizedFormData);
      
      // Check for pending invitations in the response
      if (result?.has_pending_invitations) {
        router.push('/dashboard/invitations');
        return;
      }
      
      // Normal login flow - check cookies to determine redirect
      const hasCompany = Cookies.get('has_company') === 'true';
      const hasMultipleCompanies = Cookies.get('has_multiple_companies') === 'true';
      const isEmployerRole = Cookies.get('user_role') === 'employer';
      
      if (isEmployerRole) {
        if (hasCompany) {
          if (hasMultipleCompanies) {
            window.location.href = '/companies/select';
          } else {
            window.location.href = '/dashboard/employer';
          }
        } else {
          window.location.href = '/company/setup';
        }
      } else {
        window.location.href = '/dashboard/jobseeker';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSocialSuccess = () => {
    // Social login success is handled in the hook
  };

  const handleSocialError = (error) => {
    console.error('Social login error:', error);
  };
  
  return (
    <AuthLayout>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full'>
          {/* Logo */}
          <div onClick={() =>  router.push('/')} className='text-center cursor-pointer mb-8 pb-8'>
            <img 
              width={80} 
              height={80} 
              src="/images/blogs/logoa.webp" 
              className='mx-auto w-20 h-20 object-contain' 
              alt="TechHub Logo" 
            />
          </div>

          {/* Form Container */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
                Welcome back!
              </h2>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Enter your credentials to access your account
              </p>
            </div>
            
            {/* Error Alert */}
            {error && (
              <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <p className='text-red-700 dark:text-red-400 text-sm'>{error}</p>
              </div>
            )}
            
            {/* Form */}
            <form className='space-y-6' onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Email address
                </label>
                <input
                  id='email'
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete='email'
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    validationErrors.email 
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-[#0CCE68] focus:border-[#0CCE68]'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  placeholder='Enter your email'
                />
                {validationErrors.email && (
                  <p className='mt-2 text-sm text-red-600 dark:text-red-400'>{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Password
                  </label>
                  <Link
                    href='/auth/forgot-password'
                    className='text-sm font-medium text-[#0CCE68] hover:text-[#364187] dark:hover:text-[#0CCE68] transition-colors duration-200'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete='current-password'
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 ${
                      validationErrors.password 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-[#0CCE68] focus:border-[#0CCE68]'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className='mt-2 text-sm text-red-600 dark:text-red-400'>{validationErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full flex justify-center items-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#364187] focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
              >
                {loading ? (
                  <>
                    <svg className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className='mt-8 mb-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Social Auth */}
            <SocialAuthButtons 
              onSuccess={handleSocialSuccess}
              onError={handleSocialError}
            />
            
            {/* Sign Up Link */}
            <div className='mt-8 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link 
                  href='/auth/register' 
                  className='font-medium text-[#0CCE68] hover:text-[#364187] dark:hover:text-[#0CCE68] transition-colors duration-200'
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;