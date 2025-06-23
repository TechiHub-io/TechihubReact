// src/components/jobs/ContactEmployerButton.jsx 
import React, { useState } from 'react';
import { MessageCircle, Mail, Loader2 } from 'lucide-react';
import JobInquiryModal from './JobInquiryModal';
import { useJobCommunication } from '@/hooks/useJobCommunication';

export default function ContactEmployerButton({ 
  job, 
  jobDetails = null, 
  variant = 'button',
  size = 'md',
  className = ""
}) {
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [fullJobDetails, setFullJobDetails] = useState(jobDetails);
  const { getJobDetails } = useJobCommunication();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If we don't have full job details, fetch them first
    if (!fullJobDetails) {
      setLoadingDetails(true);
      try {
        const details = await getJobDetails(job.id);
        setFullJobDetails(details);
        setShowModal(true);
      } catch (error) {
        console.error('Failed to load job details:', error);
        // You might want to show an error toast here
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const getButtonContent = () => {
    if (loadingDetails) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {variant !== 'icon' && <span className="ml-2">Loading...</span>}
        </>
      );
    }

    const icon = variant === 'icon' ? <MessageCircle className="h-4 w-4" /> : <Mail className="h-4 w-4 mr-2" />;
    const text = variant === 'icon' ? null : 'Contact Employer';
    
    return (
      <>
        {icon}
        {text}
      </>
    );
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:ring-offset-2";
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantStyles = {
      button: 'bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] font-medium disabled:opacity-50 disabled:cursor-not-allowed',
      icon: 'p-2 text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50',
      link: 'text-[#0CCE68] hover:text-[#0BBE58] font-medium disabled:opacity-50'
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loadingDetails}
        className={getButtonStyles()}
        title="Send a message to the employer about this job"
      >
        {getButtonContent()}
      </button>

      {showModal && fullJobDetails && (
        <JobInquiryModal
          job={job}
          jobDetails={fullJobDetails}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}