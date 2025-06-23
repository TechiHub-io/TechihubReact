// src/components/dashboard/jobseeker/DashboardStatsCards.jsx
import { useProfileStrength } from '@/hooks/useProfileStrength';
import { Bookmark, Briefcase, Eye, TrendingUp } from 'lucide-react';

export default function DashboardStatsCards({ stats, error }) {
  const { profileStrength } = useProfileStrength();

  const cards = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: Briefcase,
      color: "bg-blue-500"
    },
    {
      title: "Saved Jobs",
      value: stats?.savedJobs || 0,
      icon: Bookmark,
      color: "bg-green-500"
    },
    {
      title: "Profile Views",
      value: stats?.profileViews || 0,
      icon: Eye,
      color: "bg-purple-500"
    },
    {
      title: "Profile Strength",
      value: profileStrength || stats?.profileStrength || 0,
      icon: TrendingUp,
      color: "bg-indigo-500",
      suffix: "%"
    }
  ];

  return (
    <>
      {cards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          suffix={card.suffix}
          icon={card.icon}
          color={card.color}
          error={error}
        />
      ))}
    </>
  );
}

// Update StatCard component to handle suffix
const StatCard = ({ title, value, suffix, icon: Icon, color, error }) => {
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-red-500">Error loading</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value?.toLocaleString() || 0}{suffix || ''}
          </p>
        </div>
      </div>
    </div>
  );
};