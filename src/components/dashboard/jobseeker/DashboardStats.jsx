// src/components/dashboard/jobseeker/DashboardStats.jsx
import { useState, useEffect } from 'react';
import { Bell, Bookmark, Briefcase, Eye } from 'lucide-react';

export default function DashboardStats({ analyticsData, loading }) {
  const [stats, setStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    profileViews: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (analyticsData) {
      setStats({
        totalApplications: analyticsData.applications?.length || 0,
        savedJobs: analyticsData.savedJobs?.length || 0,
        profileViews: analyticsData.profileViews?.views_this_month || 0,
        totalViews: analyticsData.profileViews?.total_views || 0
      });
    }
  }, [analyticsData]);

  const statsCards = [
    {
      title: 'Favourite Jobs',
      value: stats.savedJobs,
      icon: Bookmark,
      bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Total jobs applied',
      value: stats.totalApplications,
      icon: Briefcase,
      bgColor: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Total profile views',
      value: stats.totalViews,
      icon: Eye,
      bgColor: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Profile views this month',
      value: stats.profileViews,
      icon: Eye,
      bgColor: 'bg-gradient-to-br from-green-500 to-teal-600',
      iconBg: 'bg-white/20'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className={`${card.bgColor} rounded-lg shadow-lg p-6 text-white relative overflow-hidden`}>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
              <IconComponent className="h-24 w-24" />
            </div>
          </div>
        );
      })}
    </div>
  );
}