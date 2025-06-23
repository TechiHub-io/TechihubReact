// src/components/company/ProgressSidebar.js
import { Check } from 'lucide-react';

const ProgressSidebar = ({ progress, activeSection, setActiveSection }) => {
  const sections = [
    { id: 'details', title: 'Company Details' },
    { id: 'founding', title: 'Founding Info' },
    { id: 'contact', title: 'Contact Info' },
    { id: 'logo', title: 'Upload Company Logo' }
  ];

  // Calculate progress percentage
  const progressPercentage = 
    Object.values(progress).filter(Boolean).length / Object.keys(progress).length * 100;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Company Profile</h2>
      
      <div className="mb-6">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-full bg-[#0CCE68] rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>
      
      <div className="space-y-2">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`p-3 flex items-center cursor-pointer rounded-md transition-colors ${
              activeSection === section.id 
                ? 'bg-blue-50 border-l-4 border-[#0CCE68]' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {progress[section.id] ? (
              <span className="mr-2 flex items-center justify-center h-5 w-5 bg-green-500 rounded-full">
                <Check size={12} color="white" />
              </span>
            ) : (
              <span className="mr-2 flex items-center justify-center h-5 w-5 bg-gray-200 rounded-full">
                <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
              </span>
            )}
            <span className={progress[section.id] ? 'line-through text-gray-500' : ''}>
              {section.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSidebar;