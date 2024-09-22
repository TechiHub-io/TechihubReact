import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Education {
  id: number;
  course: string;
  school_name: string;
  startDate: string;
  endDate: string | null;
  summary?: string;
}

interface EducationSectionProps {
  educations: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const visibleEducations = showAll ? educations : educations.slice(0, 2);

  return (
    <Card className="mb-6 bg-[#F9FAFB] shadow-sm rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#18191C]">Education</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleEducations.map((edu) => (
          <div key={edu.id} className="flex items-start mb-4 p-4 bg-white rounded-md">
            <div className="mr-4">
              <svg className="w-12 h-12 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-[#18191C]">{edu.course}</h3>
              <p className="text-[#364187]">{edu.school_name}</p>
              <p className="text-sm text-[#767F8C]">
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </p>
              {edu.summary && <p className="mt-2 text-[#18191C]">{edu.summary}</p>}
            </div>
            <svg className="w-5 h-5 text-[#0CCE68] cursor-pointer hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        ))}
        {educations.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full py-2 bg-[#D8F7E7] text-[#0CCE68] rounded-md font-medium transition-colors duration-200 hover:bg-[#0CCE68] hover:text-white"
          >
            {showAll ? 'View less' : 'View more'}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;