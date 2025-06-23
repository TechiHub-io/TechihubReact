// src/components/jobs/JobListItem.jsx - Role-based actions
import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { 
  Briefcase,
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Globe,
  Building2,
  Edit,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import SaveJobButton from './SaveJobButton';
import StarRating from '@/components/reviews/StarRating';
import ContactEmployerButton from './ContactEmployerButton';
import CompanyProfileLink from './CompanyProfileLink';

export default function JobListItem({ 
  job, 
  isSaved = false,
  onSave,
  onUnsave,
  onDelete,
  showActions = true,
  isEmployer = false,
  isOwner = false // Whether the employer owns this job
}) {
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

  // Status badge colors (for employer view)
  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const salaryDisplay = formatSalary();

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the job "${job.title}"? This action cannot be undone.`)) {
      if (onDelete) {
        onDelete(job.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-grow min-w-0 pr-4">
          {/* Job Title and Company */}
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-grow">
              <Link 
                href={`/jobs/${job.id}`} 
                className="block group"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#0CCE68] dark:group-hover:text-[#0CCE68] transition-colors truncate">
                  {job.title}
                </h3>
              </Link>
              
              <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                {!isEmployer ? (
                  <CompanyProfileLink 
                    job={job}
                    className="text-sm truncate hover:text-[#0CCE68] transition-colors"
                  >
                    {job.company_name}
                  </CompanyProfileLink>
                ) : (
                  <span className="text-sm truncate">{job.company_name}</span>
                )}
              </div>
              {job.company?.average_rating && (
                <div className="flex items-center mt-1">
                  <StarRating rating={Math.round(job.company.average_rating)} size="sm" />
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({job.company.review_count})
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Save Button for Job Seekers */}
              {!isEmployer && (
                <SaveJobButton
                  jobId={job.id}
                  isSaved={isSaved}
                  onSave={onSave}
                  onUnsave={onUnsave}
                  size="md"
                />
              )}

              {/* Status Badge for Employers */}
              {isEmployer && (
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(job.is_active)}`}
                >
                  {job.is_active ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              )}

              {/* Edit/Delete buttons for job owners */}
              {isEmployer && isOwner && (
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="p-2 text-gray-400 hover:text-[#0CCE68] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Edit job"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
            {/* Job Type */}
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{job.job_type_display || job.job_type}</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">
                {job.location || 'Location not specified'}
                {job.is_remote && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs">
                    Remote
                  </span>
                )}
              </span>
            </div>
            
            {/* Posted Date */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>Posted {formatDate(job.created_at, 'short')}</span>
            </div>
          </div>

          {/* Salary and Additional Info */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm">
            {/* Salary */}
            {salaryDisplay && (
              <div className="flex items-center text-[#0CCE68] font-medium">
                <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{salaryDisplay}</span>
              </div>
            )}

            {!isEmployer && (
              <>
              
                
                <ContactEmployerButton 
                  job={job}
                  variant="link"
                  size="sm"
                />
              </>
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

            {/* Applications Count (for employers) */}
            {isEmployer && (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{job.application_count || 0} applications</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {job.required_skills.slice(0, 4).map((skillObj, index) => (
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
              {job.required_skills.length > 4 && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  +{job.required_skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {/* Common Actions */}
            <Link 
              href={`/jobs/${job.id}`}
              className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Link>
            
            {/* Job Seeker Actions */}
            {!isEmployer && (
              <Link 
                href={`/jobs/${job.id}/apply`}
                className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                Apply Now
              </Link>
            )}
            
            {/* Employer Actions */}
            {isEmployer && (
              <>
                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <Link 
                      href={`/jobs/${job.id}/edit`}
                      className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Job
                    </Link>
                    
                    <Link 
                      href={`/applications/job/${job.id}`}
                      className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Applications ({job.application_count || 0})
                    </Link>
                  </>
                )}
                
                {/* Non-owner employer actions */}
                {!isOwner && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Posted by {job.company_name}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}