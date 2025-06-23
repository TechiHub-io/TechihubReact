// src/components/dashboard/employer/ApplicationsOverview.jsx
import React from 'react';
import Link from 'next/link';
import { Clock, User } from 'lucide-react';

export default function ApplicationsOverview({ applications = [] }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No applications received yet</p>
      </div>
    );
  }

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'screening': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'interview': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'assessment': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'offer': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'withdrawn': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Link 
          href={`/applications/${application.id}`} 
          key={application.id}
          className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{application.job_title}</h3>
              
              <div className="mt-2 text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4 mr-2" />
                  <span>{application.applicant_name}</span>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Applied: {new Date(application.applied_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(application.status)}`}>
              {application.status_display}
            </span>
          </div>
        </Link>
      ))}
      
      <div className="pt-2 text-center">
        <Link 
          href="/dashboard/employer/applications" 
          className="text-sm text-[#0CCE68] hover:text-[#0BBE58]"
        >
          View All Applications
        </Link>
      </div>
    </div>
  );
}