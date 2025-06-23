// src/components/jobs/JobListItem.jsx
import { useState } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { 
  Building, 
  MapPin, 
  CalendarClock, 
  Briefcase, 
  CreditCard,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export default function JobListItem({ 
  job, 
  isSaved = false, 
  onSave,
  onUnsave
}) {
  const [saved, setSaved] = useState(isSaved);
  
  // Format posted date
  const postedDate = job.created_at 
    ? formatDistance(new Date(job.created_at), new Date(), { addSuffix: true })
    : 'Recently';
  
  // Handle save/unsave
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (saved) {
      onUnsave();
      setSaved(false);
    } else {
      onSave();
      setSaved(true);
    }
  };
  
  return (
    <Link 
      href={`/jobs/${job.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            
            <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
              <Building className="h-4 w-4 mr-2" />
              <span>{job.company_name}</span>
            </div>
          </div>
          
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full ${
              saved 
                ? 'text-[#0CCE68] bg-[#0CCE68]/10 hover:bg-[#0CCE68]/20' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {job.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{job.location}</span>
              {job.is_remote && (
                <span className="ml-1">(Remote)</span>
              )}
            </div>
          )}
          
          {job.job_type && (
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{job.job_type_display || job.job_type}</span>
            </div>
          )}
          
          {(job.min_salary || job.max_salary) && job.is_salary_visible && (
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>
                {job.min_salary && job.max_salary 
                  ? `${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                  : job.min_salary 
                    ? `From ${job.min_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                    : `Up to ${job.max_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                }
              </span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <CalendarClock className="h-4 w-4 mr-2" />
            <span>Posted {postedDate}</span>
          </div>
        </div>
        
        {job.skills && job.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs"
              >
                {skill.name || skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0CCE68]/10 text-[#0CCE68]">
            Apply Now
          </span>
        </div>
      </div>
    </Link>
  );
}