// src/components/jobs/PublicJobDetail.jsx - Individual job detail page
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicJobs } from '@/hooks/usePublicJobs';
import { useStore } from '@/hooks/useZustandStore';
import { generateJobMetaTags, generateBreadcrumbs } from '@/lib/utils/urlParser';
import { formatDate } from '@/lib/utils/date';
import PublicJobCard from './PublicJobCard';
import AuthPrompt from './AuthPrompt';
import { 
  MapPin, 
  Calendar, 
  DollarSign,
  Building2,
  Globe,
  Clock,
  Users,
  Bookmark,
  Send,
  Share2,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

export default function PublicJobDetail({ jobId, companySlug, jobSlug }) {
  const router = useRouter();
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Get authentication status
  const { isAuthenticated } = useStore(state => ({
    isAuthenticated: state.isAuthenticated || false
  }));
  
  // Job hooks
  const {
    currentJob: job,
    loading,
    error,
    fetchJobById,
    fetchRelatedJobs,
    clearError
  } = usePublicJobs();

  // Load job data
  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    }
  }, [jobId, fetchJobById]);

  // Load related jobs
  useEffect(() => {
    if (job?.id) {
      fetchRelatedJobs(job.id, 4).then(setRelatedJobs);
    }
  }, [job?.id, fetchRelatedJobs]);

  // Format salary display
  const formatSalary = () => {
    if (!job?.is_salary_visible || (!job.min_salary && !job.max_salary)) {
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

  // Share job
  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company_name}`,
        text: job.description?.substring(0, 100) || `Check out this job opportunity at ${job.company_name}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
    }
  };

  // Generate breadcrumbs
  const breadcrumbs = job ? generateBreadcrumbs([], job) : [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Loading...', href: null }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="flex space-x-4 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="max-w-md mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
             <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
           </div>
           <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
             Job Not Found
           </h2>
           <p className="text-gray-600 dark:text-gray-400 mb-6">
             {error || "The job you're looking for doesn't exist or has been removed."}
           </p>
           <div className="flex flex-col sm:flex-row gap-3 justify-center">
             <button
               onClick={() => router.back()}
               className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
             >
               <ArrowLeft className="h-4 w-4 mr-2" />
               Go Back
             </button>
             <button
               onClick={() => router.push('/jobs')}
               className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
             >
               Browse All Jobs
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }

 const salaryDisplay = formatSalary();

 return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     {/* Back button */}
     <button
       onClick={() => router.back()}
       className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68] transition-colors mb-6"
     >
       <ArrowLeft className="h-4 w-4 mr-2" />
       Back to results
     </button>

     {/* Job Header */}
     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
       <div className="flex flex-col lg:flex-col lg:justify-between lg:items-start gap-6">
         {/* Job Info */}
         <div className="flex-1">
           <div className="flex items-start gap-4 mb-4">
             {job.company_logo && (
               <img 
                 src={job.company_logo} 
                 alt={`${job.company_name} logo`}
                 className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
               />
             )}
             <div className="min-w-0 flex-1">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                 {job.title}
               </h1>
               <div className="flex items-center text-lg text-gray-600 dark:text-gray-400 mb-3">
                 <Building2 className="h-5 w-5 mr-2" />
                 <span className="font-medium">{job.company_name}</span>
               </div>
               
               {/* Job Meta Info */}
               <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                 <div className="flex items-center">
                   <MapPin className="h-4 w-4 mr-1.5" />
                   <span>{job.location || 'Location not specified'}</span>
                   {job.is_remote && (
                     <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                       Remote
                     </span>
                   )}
                 </div>
                 
                 <div className="flex items-center">
                   <Clock className="h-4 w-4 mr-1.5" />
                   <span>{job.job_type_display || job.job_type}</span>
                 </div>
                 
                 <div className="flex items-center">
                   <Calendar className="h-4 w-4 mr-1.5" />
                   <span>Posted {formatDate(job.created_at, 'relative')}</span>
                 </div>
                 
                 {job.application_count && (
                   <div className="flex items-center">
                     <Users className="h-4 w-4 mr-1.5" />
                     <span>{job.application_count} applications</span>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Salary and Deadline */}
           <div className="flex flex-wrap gap-6 mb-4">
             {salaryDisplay && (
               <div className="flex items-center text-[#0CCE68] font-semibold">
                 <DollarSign className="h-5 w-5 mr-2" />
                 <span className="text-lg">{salaryDisplay}</span>
                 <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">per year</span>
               </div>
             )}
             
             {job.application_deadline && (
               <div className="flex items-center text-orange-600 dark:text-orange-400">
                 <Clock className="h-5 w-5 mr-2" />
                 <span>Deadline: {formatDate(job.application_deadline, 'short')}</span>
               </div>
             )}
           </div>

           {/* Skills */}
           {job.required_skills && job.required_skills.length > 0 && (
             <div className="flex flex-wrap gap-2">
               {job.required_skills.map((skillObj, index) => (
                 <span
                   key={index}
                   className={`px-3 py-1 rounded-full text-sm font-medium ${
                     skillObj.is_required
                       ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                       : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                   }`}
                 >
                   {skillObj.skill}
                   {skillObj.is_required && <span className="ml-1 text-blue-600">*</span>}
                 </span>
               ))}
             </div>
           )}
         </div>

         {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-full">
           {isAuthenticated ? (
             <>
               <button
                 className="flex items-center justify-center px-6 py-3 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] transition-colors font-medium"
               >
                 <Send className="h-5 w-5 mr-2" />
                 Apply Now
               </button>
               
               <button
                 className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
               >
                 <Bookmark className="h-5 w-5 mr-2" />
                 Save Job
               </button>
             </>
           ) : (
             <>
               <AuthPrompt
                 action="apply"
                 jobId={job.id}
                 jobTitle={job.title}
                 companyName={job.company_name}
               />
               
               <AuthPrompt
                 action="save"
                 jobId={job.id}
                 jobTitle={job.title}
                 companyName={job.company_name}
               />
             </>
           )}
           
           <div className="relative">
             <button
               onClick={() => setShowShareMenu(!showShareMenu)}
               className="flex items-center justify-center w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
             >
               <Share2 className="h-5 w-5 mr-2" />
               Share
             </button>
             
             {showShareMenu && (
               <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10 min-w-[150px]">
                 <button
                   onClick={shareJob}
                   className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                 >
                   Copy Link
                 </button>
                 <button
                   onClick={() => {
                     window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${job.title} at ${job.company_name}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                     setShowShareMenu(false);
                   }}
                   className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                 >
                   Share on Twitter
                 </button>
                 <button
                   onClick={() => {
                     window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                     setShowShareMenu(false);
                   }}
                   className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                 >
                   Share on LinkedIn
                 </button>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Job Status */}
       {job.is_featured && (
         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
           <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
             <Star className="h-4 w-4 mr-1" />
             Featured Job
           </div>
         </div>
       )}
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Main Content */}
       <div className="lg:col-span-2 space-y-8">
         {/* Job Description */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
             Role Overview
           </h2>
           <div className="prose dark:prose-invert max-w-none">
             <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
               {job.description}
             </p>
           </div>
         </div>

         {/* Responsibilities */}
         {job.responsibilities && (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
               Responsibilities
             </h2>
             <div className="prose dark:prose-invert max-w-none">
               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {job.responsibilities}
               </p>
             </div>
           </div>
         )}

         {/* Requirements */}
         {job.requirements && (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
               Requirements
             </h2>
             <div className="prose dark:prose-invert max-w-none">
               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {job.requirements}
               </p>
             </div>
           </div>
         )}

         {/* Benefits */}
         {job.benefits && (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
               Benefits & Perks
             </h2>
             <div className="prose dark:prose-invert max-w-none">
               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {job.benefits}
               </p>
             </div>
           </div>
         )}
       </div>

       {/* Sidebar */}
       <div className="space-y-6">
         {/* Company Info */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             About {job.company_name}
           </h3>
           
           {job.company_logo && (
             <div className="mb-4">
               <img 
                 src={job.company_logo} 
                 alt={`${job.company_name} logo`}
                 className="h-16 w-16 rounded-lg object-cover"
               />
             </div>
           )}
           
           <div className="space-y-3 text-sm">
             <div className="flex items-center text-gray-600 dark:text-gray-400">
               <Building2 className="h-4 w-4 mr-2" />
               <span>Company</span>
             </div>
             
             {job.company_website && (
              <a 
                 href={job.company_website}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
               >
                 <ExternalLink className="h-4 w-4 mr-2" />
                 <span>Visit Website</span>
               </a>
             )}
           </div>
         </div>

         {/* Job Details */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             Job Details
           </h3>
           
           <div className="space-y-4 text-sm">
             <div>
               <span className="text-gray-500 dark:text-gray-400 block">Job Type</span>
               <span className="text-gray-900 dark:text-white font-medium">
                 {job.job_type_display || job.job_type}
               </span>
             </div>
             
             <div>
               <span className="text-gray-500 dark:text-gray-400 block">Experience Level</span>
               <span className="text-gray-900 dark:text-white font-medium">
                 {job.experience_level_display || job.experience_level}
               </span>
             </div>
             
             {job.education_level && (
               <div>
                 <span className="text-gray-500 dark:text-gray-400 block">Education</span>
                 <span className="text-gray-900 dark:text-white font-medium">
                   {job.education_level_display || job.education_level}
                 </span>
               </div>
             )}
             
             <div>
               <span className="text-gray-500 dark:text-gray-400 block">Posted</span>
               <span className="text-gray-900 dark:text-white font-medium">
                 {formatDate(job.created_at, 'long')}
               </span>
             </div>
             
             {job.application_deadline && (
               <div>
                 <span className="text-gray-500 dark:text-gray-400 block">Application Deadline</span>
                 <span className="text-orange-600 dark:text-orange-400 font-medium">
                   {formatDate(job.application_deadline, 'long')}
                 </span>
               </div>
             )}
           </div>
         </div>

         {/* Quick Apply */}
         <div className="bg-gradient-to-r from-[#0CCE68]/10 to-blue-500/10 border border-[#0CCE68]/20 rounded-lg p-6">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
             Ready to Apply?
           </h3>
           <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
             Don't miss out on this opportunity. Apply now and take the next step in your career.
           </p>
           
           {isAuthenticated ? (
             <button className="w-full flex items-center justify-center px-4 py-3 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] transition-colors font-medium">
               <Send className="h-5 w-5 mr-2" />
               Apply Now
             </button>
           ) : (
             <AuthPrompt
               action="apply"
               jobId={job.id}
               jobTitle={job.title}
               companyName={job.company_name}
             />
           )}
         </div>
       </div>
     </div>

     {/* Related Jobs */}
     {relatedJobs.length > 0 && (
       <div className="mt-12">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
           Similar Jobs
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {relatedJobs.map(relatedJob => (
             <PublicJobCard 
               key={relatedJob.id} 
               job={relatedJob}
               isAuthenticated={isAuthenticated}
               compact={true}
             />
           ))}
         </div>
       </div>
     )}
   </div>
 );
}