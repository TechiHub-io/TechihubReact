// src/components/applications/ApplicationActivity.jsx
import React, { useState, useEffect } from 'react';
import { useTeamCollaboration } from '@/hooks/useTeamCollaboration';
import { formatDate } from '@/lib/utils/date';
import { 
  Activity, 
  User, 
  MessageSquare, 
  Edit3, 
  Share2, 
  Star,
  Eye,
  Mail,
  FileText,
  Clock
} from 'lucide-react';

const ACTIVITY_ICONS = {
  status_change: Edit3,
  note_added: FileText,
  comment_added: MessageSquare,
  application_shared: Share2,
  application_viewed: Eye,
  message_sent: Mail,
  rating_added: Star,
  default: Activity
};

const ACTIVITY_COLORS = {
  status_change: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
  note_added: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
  comment_added: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20',
  application_shared: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
  application_viewed: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
  message_sent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20',
  rating_added: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
  default: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
};

export default function ApplicationActivity({ applicationId, className = "" }) {
  const { getApplicationActivity, loading, error } = useTeamCollaboration();
  const [activities, setActivities] = useState([]);

  // Load activity history
  useEffect(() => {
    const loadActivity = async () => {
      try {
        const activityData = await getApplicationActivity(applicationId);
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to load activity:', error);
      }
    };

    if (applicationId) {
      loadActivity();
    }
  }, [applicationId, getApplicationActivity]);

  // Get activity icon and color
  const getActivityConfig = (activityType) => {
    const Icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.default;
    const colorClass = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.default;
    return { Icon, colorClass };
  };

  // Format activity description
  const formatActivityDescription = (activity) => {
    switch (activity.action_type) {
      case 'status_change':
        return `changed status from ${activity.old_value} to ${activity.new_value}`;
      case 'note_added':
        return 'added an internal note';
      case 'comment_added':
        return 'added team feedback';
      case 'application_shared':
        return `shared application with ${activity.details?.shared_with_count || 'team members'}`;
      case 'application_viewed':
        return 'viewed the application';
      case 'message_sent':
        return 'sent a message to the applicant';
      case 'rating_added':
        return `gave a ${activity.details?.rating}/5 rating`;
      default:
        return activity.description || 'performed an action';
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-6">
        <Activity className="w-5 h-5 mr-2" />
        Activity Timeline ({activities.length})
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Application activity will appear here as team members interact with it
            </p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const { Icon, colorClass } = getActivityConfig(activity.action_type);
            
            return (
              <div key={activity.id || index} className="flex items-start space-x-3">
                {/* Activity Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">
                        {activity.user?.full_name || 'Unknown User'}
                      </span>{' '}
                      {formatActivityDescription(activity)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.created_at, 'full')}
                    </p>
                    
                    {activity.details?.note_preview && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        "{activity.details.note_preview.substring(0, 50)}..."
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Load More Button */}
      {activities.length > 0 && activities.length % 20 === 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Implement load more functionality if needed
            }}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium"
          >
            Load More Activity
          </button>
        </div>
      )}
    </div>
  );
}