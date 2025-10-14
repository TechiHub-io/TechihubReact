'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, FileText } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useStore } from '@/hooks/useZustandStore';

export default function ApplyButton({ job, className = "", size = "default" }) {
  const { submitExternalApplication, loading } = useApplications();
  const [isApplying, setIsApplying] = useState(false);
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));

  // Don't show apply button for employers or unauthenticated users
  if (!isAuthenticated || isEmployer) {
    return null;
  }

  const handleExternalApplication = async (method) => {
    setIsApplying(true);
    try {
      const result = await submitExternalApplication(job.id, {
        application_method: method.type
      });
      
      // Open external URL in new tab
      if (result.redirect_url) {
        window.open(result.redirect_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to track external application:', error);
      // Still open the external URL even if tracking fails
      if (method.url) {
        window.open(method.url, '_blank');
      } else if (method.email) {
        handleEmailApplication(method);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleEmailApplication = (method) => {
    const subject = encodeURIComponent(`Application for ${job.title}`);
    const body = encodeURIComponent(`Dear Hiring Manager,

I am interested in applying for the ${job.title} position at ${job.company?.name || 'your company'}.

Please find my resume attached.

Best regards`);
    
    window.location.href = `mailto:${method.email}?subject=${subject}&body=${body}`;
  };

  // Determine button styles based on size
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium transition-colors ${sizeClasses[size]} ${className}`;

  // Get application methods and determine priority
  const applicationMethods = job.application_methods || [];
  
  // Priority order: External URL → Email → Internal
  let primaryMethod = null;
  
  if (applicationMethods.length > 0) {
    primaryMethod = applicationMethods.find(m => m.type === 'external_url') ||
                   applicationMethods.find(m => m.type === 'email') ||
                   applicationMethods.find(m => m.type === 'internal');
  } else {
    // Legacy fallback - check job properties directly
    if (job.application_url) {
      primaryMethod = { type: 'external_url', url: job.application_url, label: 'Apply Now' };
    } else if (job.application_email) {
      primaryMethod = { type: 'email', email: job.application_email, label: 'Apply via Email' };
    } else {
      primaryMethod = { type: 'internal', label: 'Apply Now' };
    }
  }

  // Render based on primary method
  if (primaryMethod.type === 'internal') {
    return (
      <Link
        href={`/jobs/${job.id}/apply`}
        className={`${baseClasses} bg-[#0CCE68] text-white hover:bg-[#0BBE58]`}
      >
        <FileText className="w-4 h-4 mr-2" />
        {primaryMethod.label}
      </Link>
    );
  } else {
    return (
      <button
        onClick={() => handleExternalApplication(primaryMethod)}
        disabled={isApplying || loading}
        className={`${baseClasses} bg-[#0CCE68] text-white hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isApplying ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Applying...
          </>
        ) : (
          <>
            {primaryMethod.type === 'external_url' ? <ExternalLink className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
            {primaryMethod.label}
          </>
        )}
      </button>
    );
  }
}
