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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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





  