// src/components/dashboard/jobseeker/ProfileViewsAnalytics.jsx
import { useState, useEffect } from 'react';
import { TrendingUp, Building, Eye, Calendar } from 'lucide-react';

export default function ProfileViewsAnalytics({ profileViews, loading }) {
  const [viewsData, setViewsData] = useState(null);

  useEffect(() => {
    if (profileViews) {
      setViewsData(profileViews);
    }
  }, [profileViews]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!viewsData || viewsData.total_views === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-500" />
          Recent profile viewers
        </h3>
        <div className="text-center py-8">
          <Eye className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No profile views yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Complete your profile to attract more viewers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Eye className="h-5 w-5 mr-2 text-blue-500" />
        Recent profile viewers
      </h3>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">This Month</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {viewsData.views_this_month || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Views</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {viewsData.total_views || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company viewers */}
      {viewsData.company_views && viewsData.company_views.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Companies that viewed your profile:
          </h4>
          {viewsData.company_views.slice(0, 4).map((company, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {company.company_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(company.last_viewed).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {company.view_count} view{company.view_count !== 1 ? 's' : ''}
                </p>
                <div className="w-4 h-4 text-gray-400">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Anonymous views */}
      {viewsData.anonymous_views > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Anonymous views
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {viewsData.anonymous_views}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}