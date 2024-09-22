import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Experience {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const visibleExperiences = showAll ? experiences : experiences.slice(0, 2);

  return (
    <Card className="mb-6 bg-[#F9FAFB] shadow-sm rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#18191C]">Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleExperiences.map((exp) => (
          <div key={exp.id} className="flex items-start mb-4 p-4 bg-white rounded-md">
            <div className="mr-4">
              <svg className="w-12 h-12 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-[#18191C]">{exp.title}</h3>
              <p className="text-[#364187]">{exp.company}</p>
              <p className="text-sm text-[#767F8C]">
                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
              </p>
            </div>
            <svg className="w-5 h-5 text-[#0CCE68] cursor-pointer hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        ))}
        {experiences.length > 2 && (
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

export default ExperienceSection;