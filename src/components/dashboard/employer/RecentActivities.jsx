// src/components/dashboard/employer/RecentActivities.jsx
import React from 'react';
import { FileText, Briefcase, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function RecentActivities({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    );
  }

  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'job':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'status':
        return <CheckCircle className="h-4 w-4 text-violet-500" />;
      case 'profile':
        return <User className="h-4 w-4 text-cyan-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex-shrink-0 pt-1">
            {getActivityIcon(activity.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-white">
              {activity.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
      
      {/* Placeholder for potential "View All" link */}
      {activities.length > 5 && (
        <div className="pt-2 text-center">
          <button className="text-sm text-[#0CCE68] hover:text-[#0BBE58]">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}