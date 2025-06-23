// src/components/applications/QuickActions.jsx - Centralized quick actions component
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Eye, 
  Share2, 
  Download,
  Mail,
  Phone,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function QuickActions({ 
  application, 
  onShare,
  className = "" 
}) {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const applicant = application?.applicant;
  const job = application?.job;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        {/* Primary Actions */}
        <Link
          href={`/messages/new?application=${application.id}&applicant=${applicant?.id}`}
          className="block w-full px-4 py-2 bg-[#0CCE68] text-white text-center rounded-md hover:bg-[#0BBE58] transition-colors"
        >
          <MessageCircle className="inline-block w-4 h-4 mr-2" />
          Message Applicant
        </Link>
        
        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onShare}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <Share2 className="inline-block w-4 h-4 mr-1" />
            Share
          </button>
          
          {application.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Download className="inline-block w-4 h-4 mr-1" />
              Resume
            </a>
          )}
        </div>

        {/* Contact Options */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowContactOptions(!showContactOptions)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Contact Options
            <ExternalLink className="w-4 h-4" />
          </button>
          
          {showContactOptions && (
            <div className="mt-3 space-y-2">
              {applicant?.email && (
                <a
                  href={`mailto:${applicant.email}`}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {applicant.email}
                </a>
              )}
              
              {applicant?.phone && (
                <a
                  href={`tel:${applicant.phone}`}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {applicant.phone}
                </a>
              )}
              
              {applicant?.linkedin && (
                <a
                  href={applicant.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
              )}
            </div>
          )}
        </div>

        {/* Job Reference */}
        {job && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] transition-colors"
            >
              <span>View Job Posting</span>
              <Eye className="w-4 h-4" />
            </Link>
            
            <Link
              href={`/dashboard/employer/applications/job/${job.id}`}
              className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] transition-colors mt-2"
            >
              <span>All Applications for this Job</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}