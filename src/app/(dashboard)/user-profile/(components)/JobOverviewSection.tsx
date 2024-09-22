import React from 'react';

interface JobOverviewSectionProps {
  experience: number;
  // jobLevel: string;
  // salaryExpectation: string;
  education: string;
}

const JobOverviewSection: React.FC<JobOverviewSectionProps> = ({
  experience,
  // jobLevel,
  // salaryExpectation,
  education
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#18191C]">Job Overview</h2>
        <svg className="w-5 h-5 text-[#0CCE68] cursor-pointer hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-[#767F8C] text-sm">EXPERIENCE</p>
            <p className="text-[#18191C] font-medium">{experience} years</p>
          </div>
        </div>
        {/* <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-[#767F8C] text-sm">JOB LEVEL:</p>
            <p className="text-[#18191C] font-medium">{jobLevel}</p>
          </div>
        </div>
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-[#767F8C] text-sm">SALARY EXPECTATION</p>
            <p className="text-[#18191C] font-medium">{salaryExpectation}</p>
          </div>
        </div> */}
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10L12 5L4 10L12 15L20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 15L12 20L20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-[#767F8C] text-sm">EDUCATION</p>
            <p className="text-[#18191C] font-medium">{education}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverviewSection;