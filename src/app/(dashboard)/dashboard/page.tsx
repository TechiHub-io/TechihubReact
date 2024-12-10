'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MetricCard from './(components)/MetricCard';
import MetricCardSkeleton from './(components)/MetricCardSkeleton';
import ErrorMessage from './(components)/ErrorMessage';
import ProfileStrength from './(components)/ProfileStrength';
import ProfileViews from './(components)/ProfileViews';
import RecentProfileViewers from './(components)/RecentProfileViewers';
import ProfileStrengthSkeleton from './(components)/ProfileStrengthSkeleton';
import ProfileViewsSkeleton from './(components)/ProfileViewsSkeleton';
import RecentProfileViewersSkeleton from './(components)/RecentProfileViewersSkeleton';
import RecommendedJobs from './(components)/RecommendedJobs';
import JobsAppliedOvertime from './(components)/JobsAppliedOvertime';
import RecentUpdates from './(components)/RecentUpdates';
import RecommendedJobsSkeleton from './(components)/RecommendedJobsSkeleton';
import JobsAppliedOvertimeSkeleton from './(components)/JobsAppliedOvertimeSkeleton';
import RecentUpdatesSkeleton from './(components)/RecentUpdatesSkeleton';
import { Bell } from 'lucide-react';

interface MockData {
  profileStrength: number;
  profileViews: Array<{ name: string; views: number }>;
  recentViewers: Array<{ company: string; date: string }>;
  recommendedJobs: Array<{ company: string; title: string; time: string }>;
  jobsAppliedOvertime: Array<{ name: string; value: number }>;
  recentUpdates: Array<{ content: string; time: string }>;
}

const generateMockData = (): MockData => {
  const profileStrength = Math.floor(Math.random() * 31) + 70;
  const profileViews = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
    name: month,
    views: Math.floor(Math.random() * 300) + 50
  }));
  const recentViewers = Array(4).fill(null).map(() => ({
    company: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple'][Math.floor(Math.random() * 5)],
    date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()
  }));
  const recommendedJobs = Array(4).fill(null).map(() => ({
    company: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple'][Math.floor(Math.random() * 5)],
    title: 'Technical Support Specialist',
    time: 'Today | 02:00 AM'
  }));
  const jobsAppliedOvertime = [
    { name: 'Jan', value: 186 },
    { name: 'Feb', value: 305 },
    { name: 'Mar', value: 237 },
    { name: 'Apr', value: 73 },
    { name: 'May', value: 209 },
    { name: 'Jun', value: 214 }
  ];
  const recentUpdates = Array(4).fill(null).map(() => ({
    content: 'Lorem Ipsum',
    time: 'Today | 02:00 AM'
  }));

  return { profileStrength, profileViews, recentViewers, recommendedJobs, jobsAppliedOvertime, recentUpdates };
};

const Dashboard: React.FC = () => {
  const route = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/home")
    }
  });
  useEffect(() => {
    const callout = () => {
      // @ts-ignore
      if(session?.user?.role === "EMPLOYER") {
      route.push("/e-dashboard");
      //  redirect("/e-dashboard'");
      }
    }
    setTimeout(() => {
      callout();
    }, 2000)
  })
  

  
  
  const [mockData, setMockData] = useState<MockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = generateMockData();
        setMockData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const metricCards = [
    { title: 'Job Alerts', value: '500', icon: 'bell', bgColor: 'h-32 rounded-2xl text-white bg-[linear-gradient(259deg,_#364187_0%,_#0CCE68_100%)]', textColor: 'text-white' },
    { title: 'Favourite Jobs', value: '24', icon: 'bookmark', bgColor: 'h-32 bg-gradient-to-l from-[#85c4ff] to-[#4d5be2] rounded-2xl shadow', textColor: 'text-white' },
    { title: 'Total Jobs Applied', value: '300', icon: 'briefcase', bgColor: 'h-32 bg-gradient-to-l from-[#364187] to-[#049fd9] rounded-2xl shadow', textColor: 'text-white' },
    { title: 'Total Profile Views', value: '1500', icon: 'eye', bgColor: 'h-32 bg-gradient-to-l from-sky-500 to-sky-500 rounded-2xl shadow', textColor: 'text-white' },
  ];

  const renderMetricCards = () => {
    if (isLoading) {
      return (
        <>
          {[...Array(4)].map((_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return metricCards.map((card, index) => (
      <MetricCard
        key={index}
        title={card.title}
        value={card.value}
        icon={card.icon}
        bgColor={card.bgColor}
        textColor={card.textColor}
      />
    ));
  };

  const renderUserProfile = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return (
      <>
        <h2 className='text-[32px] text-[#000] font-light'>
          John Doe
        </h2>
        <p>Software Developer</p>
      </>
    );
  };

  const renderProfileStats = () => {
    if (isLoading) {
      return (
        <>
          <ProfileStrengthSkeleton />
          <ProfileViewsSkeleton />
          <RecentProfileViewersSkeleton />
        </>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (!mockData) {
      return null;
    }

    return (
      <>
        <ProfileStrength strength={mockData.profileStrength} userName="John Doe" />
        <ProfileViews viewsData={mockData.profileViews} />
        <RecentProfileViewers viewers={mockData.recentViewers} />
      </>
    );
  };

  const renderAdditionalStats = () => {
    if (isLoading) {
      return (
        <>
          <RecommendedJobsSkeleton />
          <JobsAppliedOvertimeSkeleton />
          <RecentUpdatesSkeleton />
        </>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (!mockData) {
      return null;
    }

    return (
      <>
        <RecommendedJobs jobs={mockData.recommendedJobs} />
        <JobsAppliedOvertime data={mockData.jobsAppliedOvertime} />
        <RecentUpdates updates={mockData.recentUpdates} />
      </>
    );
  };

  return (
    <section className='max-w-full mx-auto px-4'>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="bg-white shadow-sm">
          <div className="max-full   px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div className="ml-4 text-xl font-semibold text-gray-800">Dashboard</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 relative">
                  <Bell className="h-6 w-6 text-gray-400 cursor-pointer" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {renderMetricCards()}
        </div>

        <div className='grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 mb-8'>
          {renderProfileStats()}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {renderAdditionalStats()}
        </div>
      </motion.div>
    </section>
  );
};

export default Dashboard;





  // code to implement
  // types.ts
// export interface MockData {
//   profileStrength: number;
//   profileViews: Array<{ name: string; views: number }>;
//   recentViewers: Array<{ company: string; date: string }>;
//   recommendedJobs: Array<{ company: string; title: string; time: string }>;
//   jobsAppliedOvertime: Array<{ name: string; value: number }>;
//   recentUpdates: Array<{ content: string; time: string }>;
// }

// // MetricCard.tsx
// import React from 'react';
// import { Bell, Bookmark, Briefcase, Eye } from 'lucide-react';

// interface MetricCardProps {
//   title: string;
//   value: string;
//   icon: string;
//   bgColor: string;
//   textColor: string;
// }

// const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, bgColor, textColor }) => {
//   const getIcon = (iconName: string) => {
//     switch (iconName) {
//       case 'bell':
//         return <Bell size={24} />;
//       case 'bookmark':
//         return <Bookmark size={24} />;
//       case 'briefcase':
//         return <Briefcase size={24} />;
//       case 'eye':
//         return <Eye size={24} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={`p-6 ${bgColor}`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className={`text-sm ${textColor}`}>{title}</p>
//           <h3 className={`text-2xl font-bold ${textColor} mt-2`}>{value}</h3>
//         </div>
//         <div className={textColor}>{getIcon(icon)}</div>
//       </div>
//     </div>
//   );
// };

// export default MetricCard;

// // MetricCardSkeleton.tsx
// import React from 'react';

// const MetricCardSkeleton: React.FC = () => (
//   <div className="h-32 rounded-2xl bg-gray-200 animate-pulse p-6">
//     <div className="flex items-center justify-between">
//       <div className="space-y-2">
//         <div className="h-4 bg-gray-300 rounded w-20"></div>
//         <div className="h-6 bg-gray-300 rounded w-16"></div>
//       </div>
//       <div className="h-6 w-6 bg-gray-300 rounded"></div>
//     </div>
//   </div>
// );

// export default MetricCardSkeleton;

// // ErrorMessage.tsx
// import React from 'react';

// interface ErrorMessageProps {
//   message: string;
// }

// const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
//   <div className="p-4 rounded-md bg-red-50 border border-red-200">
//     <p className="text-red-700">{message}</p>
//   </div>
// );

// export default ErrorMessage;

// // ProfileStrength.tsx
// import React from 'react';

// interface ProfileStrengthProps {
//   strength: number;
//   userName: string;
// }

// const ProfileStrength: React.FC<ProfileStrengthProps> = ({ strength, userName }) => (
//   <div className="bg-white p-6 rounded-2xl shadow">
//     <h3 className="text-lg font-semibold mb-4">Profile Strength</h3>
//     <div className="relative pt-1">
//       <div className="flex mb-2 items-center justify-between">
//         <div>
//           <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
//             {strength}%
//           </span>
//         </div>
//       </div>
//       <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
//         <div
//           style={{ width: `${strength}%` }}
//           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
//         ></div>
//       </div>
//     </div>
//   </div>
// );

// export default ProfileStrength;

// // generateMockData.ts
// import { MockData } from './types';

// export const generateMockData = (): MockData => {
//   const profileStrength = Math.floor(Math.random() * 31) + 70;
//   const profileViews = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
//     name: month,
//     views: Math.floor(Math.random() * 300) + 50
//   }));
//   const recentViewers = Array(4).fill(null).map(() => ({
//     company: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple'][Math.floor(Math.random() * 5)],
//     date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()
//   }));
//   const recommendedJobs = Array(4).fill(null).map(() => ({
//     company: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple'][Math.floor(Math.random() * 5)],
//     title: 'Technical Support Specialist',
//     time: 'Today | 02:00 AM'
//   }));
//   const jobsAppliedOvertime = [
//     { name: 'Jan', value: 186 },
//     { name: 'Feb', value: 305 },
//     { name: 'Mar', value: 237 },
//     { name: 'Apr', value: 73 },
//     { name: 'May', value: 209 },
//     { name: 'Jun', value: 214 }
//   ];
//   const recentUpdates = Array(4).fill(null).map(() => ({
//     content: 'Lorem Ipsum',
//     time: 'Today | 02:00 AM'
//   }));

//   return {
//     profileStrength,
//     profileViews,
//     recentViewers,
//     recommendedJobs,
//     jobsAppliedOvertime,
//     recentUpdates
//   };
// };

// // Dashboard.tsx
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useSession } from 'next-auth/react';
// import { redirect, useRouter } from 'next/navigation';
// import { Bell } from 'lucide-react';
// import { MockData } from './types';
// import { generateMockData } from './generateMockData';
// import MetricCard from './MetricCard';
// import MetricCardSkeleton from './MetricCardSkeleton';
// import ErrorMessage from './ErrorMessage';
// import ProfileStrength from './ProfileStrength';
// import ProfileViews from './ProfileViews';
// import RecentProfileViewers from './RecentProfileViewers';
// import RecommendedJobs from './RecommendedJobs';
// import JobsAppliedOvertime from './JobsAppliedOvertime';
// import RecentUpdates from './RecentUpdates';

// const Dashboard: React.FC = () => {
//   const router = useRouter();
//   const { data: session } = useSession({
//     required: true,
//     onUnauthenticated() {
//       redirect("/home");
//     }
//   });
  
//   const [mockData, setMockData] = useState<MockData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const initialize = async () => {
//       // Check user role first
//       if (session?.user?.role === "EMPLOYER") {
//         router.push("/e-dashboard");
//         return;
//       }

//       // Fetch data if user is not an employer
//       setIsLoading(true);
//       try {
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         const data = generateMockData();
//         setMockData(data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to fetch data. Please try again later.');
//         setIsLoading(false);
//       }
//     };

//     initialize();
//   }, [session, router]);

//   const metricCards = [
//     {
//       title: 'Job Alerts',
//       value: '500',
//       icon: 'bell',
//       bgColor: 'h-32 rounded-2xl text-white bg-[linear-gradient(259deg,_#364187_0%,_#0CCE68_100%)]',
//       textColor: 'text-white'
//     },
//     {
//       title: 'Favourite Jobs',
//       value: '24',
//       icon: 'bookmark',
//       bgColor: 'h-32 bg-gradient-to-l from-[#85c4ff] to-[#4d5be2] rounded-2xl shadow',
//       textColor: 'text-white'
//     },
//     {
//       title: 'Total Jobs Applied',
//       value: '300',
//       icon: 'briefcase',
//       bgColor: 'h-32 bg-gradient-to-l from-[#364187] to-[#049fd9] rounded-2xl shadow',
//       textColor: 'text-white'
//     },
//     {
//       title: 'Total Profile Views',
//       value: '1500',
//       icon: 'eye',
//       bgColor: 'h-32 bg-gradient-to-l from-sky-500 to-sky-500 rounded-2xl shadow',
//       textColor: 'text-white'
//     }
//   ];

//   const renderMetricCards = () => {
//     if (isLoading) {
//       return <>{[...Array(4)].map((_, index) => <MetricCardSkeleton key={index} />)}</>;
//     }

//     if (error) {
//       return <ErrorMessage message={error} />;
//     }

//     return metricCards.map((card, index) => (
//       <MetricCard
//         key={index}
//         title={card.title}
//         value={card.value}
//         icon={card.icon}
//         bgColor={card.bgColor}
//         textColor={card.textColor}
//       />
//     ));
//   };

//   if (isLoading) {
//     return (
//       <section className="max-w-full mx-auto px-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[...Array(4)].map((_, index) => (
//             <MetricCardSkeleton key={index} />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="max-w-full mx-auto px-4">
//         <ErrorMessage message={error} />
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-full mx-auto px-4">
//       <motion.div
//         initial={{ x: 200, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         <div className="bg-white shadow-sm">
//           <div className="max-full px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center py-4">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 </div>
//                 <div className="ml-4 text-xl font-semibold text-gray-800">Dashboard</div>
//               </div>
//               <div className="flex items-center">
//                 <div className="ml-4 relative">
//                   <Bell className="h-6 w-6 text-gray-400 cursor-pointer" />
//                   <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {renderMetricCards()}
//         </div>

//         {mockData && (
//           <>
//             <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 mb-8">
//               <ProfileStrength strength={mockData.profileStrength} userName="John Doe" />
//               <ProfileViews viewsData={mockData.profileViews} />
//               <RecentProfileViewers viewers={mockData.recentViewers} />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <RecommendedJobs jobs={mockData.recommendedJobs} />
//               <JobsAppliedOvertime data={mockData.jobsAppliedOvertime} />
//               <RecentUpdates updates={mockData.recentUpdates} />
//             </div>
//           </>
//         )}
//       </motion.div>
//     </section>
//   );
// };

// export default Dashboard;

// // app/page.tsx
// import Dashboard from './Dashboard';

// export default function DashboardPage() {
//   return <Dashboard />;
// }