import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
const jobsData = [
  {
    id: 1,
    companyLogo: "/google-logo.png",
    title: "Senior Technical Support Specialist",
    location: "Nairobi Kenya",
    tags: ["Full time", "Onsite", "Entry level"],
    description: "Here at Velstar, we don't just make websites, we create exceptional digital experiences that consumers love. Our team of designers, developers, strategists, and creators work together to deliver outstanding results.",
    timeAgo: "1 week ago",
    applicants: "78",
    company: "Google",
    status: "In Review"
  },
  {
    id: 2,
    companyLogo: "/google-logo.png",
    title: "Junior Software Developer",
    location: "Nairobi Kenya",
    tags: ["Full time", "Remote", "Entry level"],
    description: "Join our dynamic team of developers creating innovative solutions. We're looking for passionate developers who love solving complex problems and building user-friendly applications.",
    timeAgo: "2 weeks ago",
    applicants: "145",
    company: "Google",
    status: "Pending"
  },
  {
    id: 3,
    companyLogo: "/google-logo.png",
    title: "DevOps Engineer",
    location: "Nairobi Kenya",
    tags: ["Full time", "Hybrid", "Mid level"],
    description: "We're seeking a skilled DevOps Engineer to help streamline our development and deployment processes. Experience with cloud platforms and containerization is essential.",
    timeAgo: "3 days ago",
    applicants: "92",
    company: "Google",
    status: "Shortlisted"
  },
  {
    id: 4,
    companyLogo: "/google-logo.png",
    title: "UI/UX Designer",
    location: "Nairobi Kenya",
    tags: ["Full time", "Onsite", "Senior level"],
    description: "Looking for a creative UI/UX Designer to join our product team. You'll be responsible for creating intuitive and beautiful interfaces that delight our users.",
    timeAgo: "5 days ago",
    applicants: "63",
    company: "Google",
    status: "Under Review"
  }
];

// TopBar Component remains the same
const TopBar = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <svg 
          className="w-6 h-6 text-blue-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <span className="font-semibold">Applied Jobs</span>
      </div>
    </div>
  );
};

// JobCard Component with status added
const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const JobCard = ({ 
  title,
  location,
  tags,
  description,
  timeAgo,
  applicants
}) => {
  return (
    <Card className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
      <CardContent className="p-0">
        <div className="flex gap-4">

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Title and Location */}
            <div className="mb-4 flex gap-3">
              <div className="w-12 h-12 p-3 ! rounded-lg flex items-center justify-center shrink-0" style={{background:"#EDEFF5"}}>
                <GoogleLogo />
              </div>
              <div>
                <h3 className="text-[#23262F] text-[15px] font-semibold leading-tight mb-1">
                  {title}
                </h3>
                <p className="text-[#23262F] text-[10px] font-medium">
                  {location}
                </p>
              </div>              
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-1 text-[12px] font-medium text-[#0CCE68] bg-[#0cce67de] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-[12px] text-[#5E6670] leading-relaxed mb-4 line-clamp-2">
              {description}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-semibold text-[#0CCE68]">
                {timeAgo}
              </span>
              <span className="text-[10px] font-semibold text-[#0CCE68]">
                {applicants} Applicants
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Updated RecentlyAppliedJobs Section with data mapping
const RecentlyAppliedJobs = ({title}) => {
  return (
    <div className="p-4">
      <h2 className="text-[18px] font-semibold text-[#364187] mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobsData.map((job) => (
          <JobCard
            key={job.id}
            {...job}
          />
        ))}
      </div>
    </div>
  );
};

export { TopBar, JobCard, RecentlyAppliedJobs };