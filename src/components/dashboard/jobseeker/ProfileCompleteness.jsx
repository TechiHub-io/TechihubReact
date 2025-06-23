// src/components/dashboard/jobseeker/ProfileCompleteness.jsx
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { CircleCheck, CircleX, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileCompleteness({ onEditProfile }) {
  const router = useRouter();
  const { percentage, sections, nextSteps } = useProfileCompletion();
  
  // Calculate stroke properties for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      router.push('/dashboard/jobseeker/profile/edit');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile Strength
        </h2>
      </div>
      
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-[#0CCE68] transition-all duration-300 ease-in-out"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Complete
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section breakdown */}
      <div className="space-y-3 mb-6">
        {Object.entries(sections).map(([key, section]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center">
              {section.complete ? (
                <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <CircleX className="h-5 w-5 text-gray-400 mr-2" />
              )}
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {key === 'additional' ? 'Certificates/Portfolio' : key}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {section.weight}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Next steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Complete your profile to increase your chances of being noticed by employers:
          </h3>
          <ul className="space-y-2">
            {nextSteps.slice(0, 3).map((step, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <ArrowRight className="h-4 w-4 text-[#0CCE68] mr-2 flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Action button */}
      <button
        onClick={handleEditProfile}
        className="w-full py-2 px-4 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md transition-colors font-medium"
      >
        {percentage < 100 ? 'Complete Your Profile' : 'Edit Profile'}
      </button>
    </div>
  );
}