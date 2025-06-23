// src/components/dashboard/jobseeker/JobSearchStats.jsx
import { BarChart, Activity, Search, Eye, TrendingUp, AlertCircle } from 'lucide-react';

const StatItem = ({ icon: Icon, title, value, subtitle, color = "text-blue-600 dark:text-blue-400" }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <div className={`flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {typeof value === 'number' ? value.toLocaleString() : (value || 0)}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default function JobSearchStats({ stats = {}, error }) {
  
  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Search Activity
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Unable to load activity stats
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Search Activity
        </h2>
        <div className="text-center py-8">
          <Activity className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your job search activity will appear here as you start applying and exploring opportunities.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Overview
          </h2>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {/* Profile Views */}
          <StatItem
            icon={Eye}
            title="Profile Views"
            value={stats.profileViews || 0}
            subtitle={stats.profileViewsChange > 0 ? `+${stats.profileViewsChange} from last week` : 'Last 30 days'}
            color="text-blue-600 dark:text-blue-400"
          />
          
          {/* Applications */}
          <StatItem
            icon={Search}
            title="Applications Sent"
            value={stats.totalApplications || 0}
            subtitle="Total applications"
            color="text-green-600 dark:text-green-400"
          />
          
          {/* Profile Strength */}
          <StatItem
            icon={TrendingUp}
            title="Profile Strength"
            value={`${stats.profileStrength || 0}%`}
            subtitle="Complete your profile to improve"
            color="text-purple-600 dark:text-purple-400"
          />
          
          {/* Saved Jobs */}
          <StatItem
            icon={BarChart}
            title="Saved Jobs"
            value={stats.savedJobs || 0}
            subtitle="Jobs in your wishlist"
            color="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <button className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Update Profile</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
            </button>
            <button className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Search Jobs</span>
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}