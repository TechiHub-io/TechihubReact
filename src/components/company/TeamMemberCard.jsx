// src/components/company/TeamMemberCard.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import { User, Edit, Trash, ChevronDown, Check } from 'lucide-react';

export default function TeamMemberCard({ member, onRoleUpdate, onRemove }) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  // Role display mapping
  const roleDisplays = {
    owner: 'Owner',
    admin: 'Admin',
    recruiter: 'Recruiter',
    viewer: 'Team Member'
  };
  
  // Role background colors
  const roleBgColors = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    recruiter: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowRoleDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle role change
  const handleRoleChange = (newRole) => {
    if (member.role === newRole) return;
    
    onRoleUpdate(member.id, newRole);
    setShowRoleDropdown(false);
  };
  
  // Toggle role dropdown
  const toggleRoleDropdown = (e) => {
    e.stopPropagation();
    setShowRoleDropdown(!showRoleDropdown);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-start space-x-4">
      {/* Profile picture */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
        {member.profile_picture ? (
          <Image
            src={member.profile_picture}
            alt={member.name || member.email}
            width={48}
            height={48}
            objectFit="cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      
      {/* Member details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {member.name || member.user_name || 'Unnamed User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {member.email}
            </p>
          </div>
          
          <div className="flex space-x-1">
            {/* Only allow role editing for non-owners */}
            {member.role !== 'owner' && (
              <div className="relative">
                <button
                  onClick={toggleRoleDropdown}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleBgColors[member.role] || roleBgColors.member} cursor-pointer`}
                >
                  {roleDisplays[member.role] || member.role_display || member.role}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                
                {showRoleDropdown && (
                  <div 
                    className="absolute right-0 z-10 mt-1 w-36 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
                    onClick={e => e.stopPropagation()}
                  >
                    {['admin', 'recruiter', 'viewer'].map(role => (
                      <button
                        key={role}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          member.role === role 
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleRoleChange(role)}
                      >
                        <span className="flex items-center">
                          {roleDisplays[role]}
                          {member.role === role && <Check className="w-3 h-3 ml-auto" />}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Owner badge (non-editable) */}
            {member.role === 'owner' && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleBgColors.owner}`}>
                Owner
              </span>
            )}
            
            {/* Only allow removal for non-owners */}
            {member.role !== 'owner' && (
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove team member"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Additional info - when they joined */}
        {member.joined_date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Joined {new Date(member.joined_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}