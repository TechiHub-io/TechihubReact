// src/components/jobs/AuthPrompt.jsx - Login prompt for public users
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, Send, User, UserPlus } from 'lucide-react';

export default function AuthPrompt({ 
  action = 'apply', // 'apply', 'save', 'contact'
  jobId = null,
  jobTitle = '',
  companyName = '',
  onClose = null,
  className = ""
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Action configurations
  const actionConfig = {
    apply: {
      icon: Send,
      title: 'Apply for this job',
      description: 'Create an account or sign in to apply for this position',
      primaryAction: 'Apply Now',
      benefits: [
        'Apply with one click using your profile',
        'Track your application status',
        'Get notified about similar jobs',
        'Build your professional profile'
      ]
    },
    save: {
      icon: Heart,
      title: 'Save this job',
      description: 'Create an account or sign in to save jobs for later',
      primaryAction: 'Save Job',
      benefits: [
        'Save unlimited jobs',
        'Get email alerts for saved jobs',
        'Organize jobs into collections',
        'Never lose track of opportunities'
      ]
    },
    contact: {
      icon: User,
      title: 'Contact employer',
      description: 'Create an account or sign in to contact the employer',
      primaryAction: 'Contact Now',
      benefits: [
        'Direct messaging with employers',
        'Professional profile showcase',
        'Build your network',
        'Get personalized job recommendations'
      ]
    }
  };

  const config = actionConfig[action] || actionConfig.apply;
  const Icon = config.icon;

  // Generate return URL
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '/jobs';
  const returnUrl = encodeURIComponent(currentUrl);

  // Handle modal toggle
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (onClose && !isModalOpen) {
      onClose();
    }
  };

  // Inline prompt component
  const InlinePrompt = () => (
    <div className={`bg-gradient-to-r from-[#0CCE68]/10 to-blue-500/10 border border-[#0CCE68]/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-[#0CCE68] rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {config.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {config.description}
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Link
              href={`/auth/login?return=${returnUrl}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0CCE68] hover:bg-[#0BBE58] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={`/auth/register?return=${returnUrl}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal component
  const Modal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={toggleModal}
        />

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={toggleModal}
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#0CCE68] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
              <Icon className="h-6 w-6 text-[#0CCE68]" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {config.title}
              </h3>
              {jobTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {jobTitle} {companyName && `at ${companyName}`}
                </p>
              )}
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Why create an account?
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {config.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#0CCE68] mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <Link
              href={`/auth/register?return=${returnUrl}`}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0CCE68] text-base font-medium text-white hover:bg-[#0BBE58] sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Link>
            <Link
              href={`/auth/login?return=${returnUrl}`}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <InlinePrompt />
      {isModalOpen && <Modal />}
    </>
  );
}