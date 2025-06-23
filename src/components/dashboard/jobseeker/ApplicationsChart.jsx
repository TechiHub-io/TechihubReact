// src/components/dashboard/jobseeker/ApplicationsChart.jsx
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function ApplicationsChart({ applicationsOverTime, loading }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (applicationsOverTime && Object.keys(applicationsOverTime).length > 0) {
      // Convert object to array for chart display
      const data = Object.entries(applicationsOverTime).map(([month, count]) => ({
        month,
        count,
        percentage: 0 // Will calculate below
      }));

      // Calculate percentages for visual representation
      const maxCount = Math.max(...data.map(d => d.count));
      const dataWithPercentages = data.map(d => ({
        ...d,
        percentage: maxCount > 0 ? (d.count / maxCount) * 100 : 0
      }));

      setChartData(dataWithPercentages);
    }
  }, [applicationsOverTime]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-6"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 bg-gray-300 dark:bg-gray-600 rounded text-xs h-4"></div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-8"></div>
                <div className="w-8 bg-gray-300 dark:bg-gray-600 rounded text-xs h-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
          Jobs applied Overtime
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Your application history over the last 6 months
        </p>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No applications yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Start applying to jobs to see your progress
          </p>
        </div>
      </div>
    );
  }

  const totalApplications = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
            Jobs applied Overtime
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your application history over time
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
            {totalApplications} total applications
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-8 text-xs font-medium text-gray-600 dark:text-gray-400">
              {item.month}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                style={{ width: `${Math.max(item.percentage, 5)}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {item.count}
                </span>
              </div>
            </div>
            <div className="w-8 text-xs font-medium text-gray-600 dark:text-gray-400 text-right">
              {item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Trend indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
          <span>Total jobs applied for the last {chartData.length} months</span>
        </div>
      </div>
    </div>
  );
}