// src/app/auth/verify/[token]/page.js
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/hooks/useZustandStore';

const TokenVerificationPage = ({ params }) => {
  const { verifyEmail, loading, error, clearError } = useStore(state => ({
    verifyEmail: state.verifyEmail,
    loading: state.loading,
    error: state.error,
    clearError: state.clearError
  }));
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email address...');
  const router = useRouter();
  const { token } = params;

  useEffect(() => {
    clearError();
    
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification token.');
        return;
      }
      
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. Please try again.');
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, router, clearError]);

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <img src="/images/blogs/logoa.webp" className='mx-auto w-[100px]' alt="TechHub Logo" />
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>Email Verification</h2>
          
          {status === 'verifying' && (
            <div className='mt-6'>
              <div className='flex justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68]'></div>
              </div>
              <p className='mt-4 text-md text-gray-600'>{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className='mt-6'>
              <div className='flex justify-center'>
                <div className='rounded-full h-16 w-16 flex items-center justify-center bg-green-100'>
                  <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <p className='mt-4 text-md text-gray-600'>{message}</p>
              <p className='mt-2 text-sm text-gray-500'>Redirecting to login page...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className='mt-6'>
              <div className='flex justify-center'>
                <div className='rounded-full h-16 w-16 flex items-center justify-center bg-red-100'>
                  <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              <p className='mt-4 text-md text-red-600'>{message}</p>
              <p className='mt-2 text-sm text-gray-500'>
                If you're having trouble verifying your email, please contact our support team.
              </p>
            </div>
          )}
        </div>
        
        {status === 'error' && (
          <div className='mt-6'>
            <Link 
              href='/auth/login'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#364187] transition-colors duration-200 ease-in-out'
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default TokenVerificationPage;