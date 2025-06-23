// src/app/dashboard/jobseeker/companies/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import useAuthAxios from '@/hooks/useAuthAxios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReviewsList from '@/components/reviews/ReviewsList';
import ContactEmployerButton from '@/components/jobs/ContactEmployerButton';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Calendar,
  Star,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import WriteReviewButton from '@/components/reviews/WriteReviewButton';
import StarRating from '@/components/reviews/StarRating';

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const axios = useAuthAxios();
  const companyId = params.id;
  
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;
      
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        
        // Fetch company details
        const companyResponse = await axios.get(`${API_URL}/companies/${companyId}/`);
        setCompany(companyResponse.data);
        
        // Fetch company jobs
        const jobsResponse = await axios.get(`${API_URL}/jobs/company/${companyId}/`);
        setJobs(jobsResponse.data.results || []);
        
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, axios]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !company) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Company Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The company you\'re looking for doesn\'t exist or has been removed.'}
           </p>
           <button
             onClick={() => router.back()}
             className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
           >
             Go Back
           </button>
         </div>
       </div>
     </DashboardLayout>
   );
 }

 return (
   <DashboardLayout>
     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Header */}
       <div className="mb-8">
         <div className="flex items-start space-x-4">
           {company.logo ? (
             <img
               src={company.logo}
               alt={company.name}
               className="w-16 h-16 rounded-lg object-cover"
             />
           ) : (
             <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
               <Building2 className="w-8 h-8 text-gray-400" />
             </div>
           )}
           
           <div className="flex-1 min-w-0">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
               {company.name}
             </h1>
             <p className="text-gray-600 dark:text-gray-400 mt-1">
               {company.industry}
             </p>
             
             {company.average_rating && (
               <div className="flex items-center mt-2">
                 <StarRating rating={Math.round(company.average_rating)} size="sm" />
                 <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                   {company.average_rating.toFixed(1)} ({company.review_count || 0} reviews)
                 </span>
               </div>
             )}
           </div>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
           {/* Company Overview */}
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
               About {company.name}
             </h2>
             
             {company.description ? (
               <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                 {company.description}
               </p>
             ) : (
               <p className="text-gray-500 dark:text-gray-400 italic">
                 No description available.
               </p>
             )}
           </div>

           {/* Company Benefits */}
           {company.benefits && company.benefits.length > 0 && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                 Benefits & Perks
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {company.benefits.map((benefit) => (
                   <div key={benefit.id} className="flex items-start space-x-3">
                     <div className="flex-shrink-0 w-8 h-8 bg-[#0CCE68]/10 rounded-lg flex items-center justify-center">
                       <Star className="w-4 h-4 text-[#0CCE68]" />
                     </div>
                     <div>
                       <h3 className="font-medium text-gray-900 dark:text-white">
                         {benefit.title}
                       </h3>
                       {benefit.description && (
                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                           {benefit.description}
                         </p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Company Images */}
           {company.images && company.images.length > 0 && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                 Office & Culture
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {company.images.map((image) => (
                   <div key={image.id} className="relative">
                     <img
                       src={image.image}
                       alt={image.caption || 'Company image'}
                       className="w-full h-48 object-cover rounded-lg"
                     />
                     {image.caption && (
                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                         {image.caption}
                       </p>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Open Positions */}
           {jobs.length > 0 && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                 Open Positions ({jobs.length})
               </h2>
               <div className="space-y-4">
                 {jobs.slice(0, 5).map((job) => (
                   <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <Link 
                           href={`/jobs/${job.id}`}
                           className="text-lg font-medium text-gray-900 dark:text-white hover:text-[#0CCE68] transition-colors"
                         >
                           {job.title}
                         </Link>
                         <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                           <div className="flex items-center">
                             <MapPin className="w-4 h-4 mr-1" />
                             {job.location}
                           </div>
                           <div className="flex items-center">
                             <Briefcase className="w-4 h-4 mr-1" />
                             {job.job_type_display}
                           </div>
                           {job.is_remote && (
                             <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-xs">
                               Remote
                             </span>
                           )}
                         </div>
                       </div>
                       
                       {!isEmployer && (
                         <div className="flex space-x-2">
                           <ContactEmployerButton 
                             job={job}
                             variant="outline"
                             size="sm"
                           />
                           <Link
                             href={`/jobs/${job.id}`}
                             className="px-3 py-1.5 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] text-sm transition-colors"
                           >
                             View Job
                           </Link>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
                 
                 {jobs.length > 5 && (
                   <div className="text-center pt-4">
                     <Link
                       href={`/jobs?company=${company.id}`}
                       className="text-[#0CCE68] hover:text-[#0BBE58] font-medium"
                     >
                       View all {jobs.length} positions →
                     </Link>
                   </div>
                 )}
               </div>
             </div>
           )}

           {/* Reviews Section */}
           <ReviewsList company={company} canWriteReview={!isEmployer} />
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
           {/* Company Info */}
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
               Company Information
             </h3>
             
             <div className="space-y-4">
               <div className="flex items-center">
                 <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                 <span className="text-gray-700 dark:text-gray-300">{company.location}</span>
               </div>
               
               <div className="flex items-center">
                 <Users className="w-5 h-5 text-gray-400 mr-3" />
                 <span className="text-gray-700 dark:text-gray-300">{company.size} employees</span>
               </div>
               
               {company.founding_date && (
                 <div className="flex items-center">
                   <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                   <span className="text-gray-700 dark:text-gray-300">
                     Founded {new Date(company.founding_date).getFullYear()}
                   </span>
                 </div>
               )}
               
               {company.website && (
                 <div className="flex items-center">
                   <Globe className="w-5 h-5 text-gray-400 mr-3" />
                   <a 
                     href={company.website}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#0CCE68] hover:text-[#0BBE58] truncate"
                   >
                     {company.website.replace(/^https?:\/\//, '')}
                   </a>
                 </div>
               )}
               
               {company.email && (
                 <div className="flex items-center">
                   <Mail className="w-5 h-5 text-gray-400 mr-3" />
                   <a 
                     href={`mailto:${company.email}`}
                     className="text-[#0CCE68] hover:text-[#0BBE58] truncate"
                   >
                     {company.email}
                   </a>
                 </div>
               )}
               
               {company.phone && (
                 <div className="flex items-center">
                   <Phone className="w-5 h-5 text-gray-400 mr-3" />
                   <a 
                     href={`tel:${company.phone}`}
                     className="text-[#0CCE68] hover:text-[#0BBE58]"
                   >
                     {company.phone}
                   </a>
                 </div>
               )}
             </div>
           </div>

           {/* Social Links */}
           {(company.linkedin || company.twitter || company.facebook) && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                 Follow Us
               </h3>
               
               <div className="space-y-3">
                 {company.linkedin && (
                   <a
                     href={company.linkedin}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
                   >
                     <span className="mr-2">LinkedIn</span>
                     <Globe className="w-4 h-4" />
                   </a>
                 )}
                 
                 {company.twitter && (
                   <a
                     href={company.twitter}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
                   >
                     <span className="mr-2">Twitter</span>
                     <Globe className="w-4 h-4" />
                   </a>
                 )}
                 
                 {company.facebook && (
                   <a
                     href={company.facebook}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
                   >
                     <span className="mr-2">Facebook</span>
                     <Globe className="w-4 h-4" />
                   </a>
                 )}
               </div>
             </div>
           )}

           {/* Quick Actions */}
           {!isEmployer && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                 Quick Actions
               </h3>
               
               <div className="space-y-3">
                 <WriteReviewButton 
                   company={company}
                   variant="button"
                   size="md"
                   className="w-full"
                 />
                 
                 {jobs.length > 0 && (
                   <Link
                     href={`/jobs?company=${company.id}`}
                     className="block w-full px-4 py-2 border border-[#0CCE68] text-[#0CCE68] text-center rounded-md hover:bg-[#0CCE68] hover:text-white transition-colors"
                   >
                     View All Jobs ({jobs.length})
                   </Link>
                 )}
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   </DashboardLayout>
 );
}