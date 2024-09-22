import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  role: string;
  profilePhotoUrl: string;
  completionPercentage: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, role, profilePhotoUrl, completionPercentage }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm" style={{ maxWidth: '379px', width: '100%' }}>
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={profilePhotoUrl} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{name}</h1>
        <div className="bg-[#D8F7E7] text-[#0CCE68] px-3 py-1 rounded-full text-sm font-medium mb-4">
          {role}
        </div>
        <div className="w-full mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Profile completion</span>
            <span className="text-sm text-[#364187] cursor-pointer hidden">Edit</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{
                width: `${completionPercentage}%`,
                background: 'linear-gradient(to right, #0CCE68, #518EF8)'
              }}
            ></div>
            <span className="absolute right-0 top-3 text-xs text-gray-600">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;