// src/components/dashboard/employer/JobsOverview.jsx
import React from 'react';
import Link from 'next/link';
import { Calendar, Users, Clock } from 'lucide-react';

export default function JobsOverview({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No jobs posted yet</p>
        <Link 
          href="/jobs/create" 
          className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
        >
          Post Your First Job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div 
          key={job.id} 
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Link href={`/jobs/${job.id}`}>
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                job.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {job.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mt-2 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Posted: {new Date(job.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {job.application_deadline 
                    ? `Closes: ${new Date(job.application_deadline).toLocaleDateString()}`
                    : 'No deadline set'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  Applications: {job.application_count || 0}
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
              <Link 
                href={`/jobs/${job.id}/edit`}
                className="text-sm text-[#0CCE68] hover:text-[#0BBE58]"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              
              {/* <Link 
                href={`/applications/${job.id}`}
                className="text-sm text-[#0CCE68] hover:text-[#0BBE58]"
                onClick={(e) => e.stopPropagation()}
              >
                View Applicants
              </Link> */}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}