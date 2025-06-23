// src/components/jobs/PublicJobCard.jsx - Public job card component
import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { generateJobSlug } from '@/lib/utils/urlParser';
import { 
  MapPin, 
  Calendar, 
  DollarSign,
  Building2,
  Globe,
  Clock,
  Users,
  Bookmark,
  Send
} from 'lucide-react';
import AuthPrompt from './AuthPrompt';

export default function PublicJobCard({ 
  job, 
  isAuthenticated = false,
  showSaveButton = true,
  showApplyButton = true,
  compact = false,
  className = ""
}) {
  // Generate job URL
  const companySlug = job.company_name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'company';
  const jobSlug = generateJobSlug(job);
  const jobUrl = `/jobs/${companySlug}/${jobSlug}/${job.id}`;

  // Format salary display
  const formatSalary = () => {
    if (!job.is_salary_visible || (!job.min_salary && !job.max_salary)) {
      return null;
    }

    const currency = job.salary_currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (job.min_salary && job.max_salary) {
      return `${formatter.format(job.min_salary)} - ${formatter.format(job.max_salary)}`;
    } else if (job.min_salary) {
      return `From ${formatter.format(job.min_salary)}`;
    } else if (job.max_salary) {
      return `Up to ${formatter.format(job.max_salary)}`;
    }
  };

  const salaryDisplay = formatSalary();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow min-w-0 pr-4">
            {/* Job Title and Company */}
            <div className="mb-3">
              <Link 
                href={jobUrl}
                className="block group/link"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover/link:text-[#0CCE68] dark:group-hover/link:text-[#0CCE68] transition-colors line-clamp-2">
                  {job.title}
                </h3>
              </Link>
              
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                {job.company_logo && (
                  <img 
                    src={job.company_logo} 
                    alt={`${job.company_name} logo`}
                    className="h-5 w-5 rounded mr-2 flex-shrink-0"
                  />
                )}
                <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{job.company_name}</span>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
              {/* Location */}
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  {job.location || 'Location not specified'}
                </span>
              </div>
              
              {/* Remote Badge */}
              {job.is_remote && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                    Remote
                  </span>
                </div>
              )}
              
              {/* Job Type */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>{job.job_type_display || job.job_type}</span>
              </div>
              
              {/* Posted Date */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>Posted {formatDate(job.created_at, 'relative')}</span>
              </div>
            </div>

            {/* Salary and Application Deadline */}
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              {/* Salary */}
              {salaryDisplay && (
                <div className="flex items-center text-[#0CCE68] font-medium">
                  <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{salaryDisplay}</span>
                </div>
              )}

              {/* Application Deadline */}
              {job.application_deadline && (
                <div className="flex items-center text-orange-600 dark:text-orange-400">
                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>
                    Closes {formatDate(job.application_deadline, 'short')}
                  </span>
                </div>
              )}

              {/* Application Count */}
              {job.application_count && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{job.application_count} applications</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {job.required_skills && job.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills.slice(0, compact ? 3 : 5).map((skillObj, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      skillObj.is_required
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {skillObj.skill}
                    {skillObj.is_required && <span className="ml-1">*</span>}
                  </span>
                ))}
                {job.required_skills.length > (compact ? 3 : 5) && (
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    +{job.required_skills.length - (compact ? 3 : 5)} more
                  </span>
                )}
              </div>
            )}

            {/* Job Description Preview */}
            {!compact && job.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {job.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href={jobUrl}
            className="flex-1 text-center py-2 px-4 text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors hover:bg-[#0CCE68]/5 rounded-md"
          >
            View Details
          </Link>
          
          {isAuthenticated ? (
            /* Authenticated user actions */
            <div className="flex gap-2">
              {showSaveButton && (
                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
              
              {showApplyButton && (
                <Link
                  href={`${jobUrl}/apply`}
                  className="flex items-center justify-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Apply
                </Link>
              )}
            </div>
          ) : (
            /* Non-authenticated user actions */
            <div className="flex gap-2">
              {showSaveButton && (
                <AuthPrompt
                  action="save"
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.company_name}
                  className="flex-shrink-0"
                />
              )}
              
              {showApplyButton && (
                <AuthPrompt
                  action="apply"
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.company_name}
                  className="flex-1"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured Badge */}
      {job.is_featured && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Featured
          </span>
        </div>
      )}
    </div>
  );
}