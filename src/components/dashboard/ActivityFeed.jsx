// src/components/dashboard/ActivityFeed.jsx
export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#0CCE68]"></div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}