// src/components/profile/ProfileHeader.jsx
export default function ProfileHeader({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-6">
        <img
          src={profile?.profile_picture || '/images/default-avatar.png'}
          alt={profile?.user?.full_name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile?.user?.full_name}</h1>
          <p className="text-gray-600">{profile?.job_title}</p>
          <p className="text-gray-500 mt-2">{profile?.country}</p>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Profile Strength:</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#0CCE68] rounded-full"
                  style={{ width: `${profile?.profile_strength || 0}%` }}
                ></div>
              </div>
              <span className="text-sm">{profile?.profile_strength || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}