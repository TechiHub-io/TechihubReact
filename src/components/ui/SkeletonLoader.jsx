// src/components/ui/SkeletonLoader.jsx
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
      
      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}