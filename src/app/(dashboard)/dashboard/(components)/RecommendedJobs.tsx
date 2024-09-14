import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Job {
  company: string;
  title: string;
  time: string;
}

interface RecommendedJobsProps {
  jobs: Job[];
}

const RecommendedJobs: React.FC<RecommendedJobsProps> = ({ jobs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.map((job, index) => (
          <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
            <div className="flex items-center">
              <img src={`https://logo.clearbit.com/${job.company.toLowerCase()}.com`} alt={`${job.company} logo`} className="w-8 h-8 mr-3 rounded" />
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-gray-500">{job.time}</p>
              </div>
            </div>
            <Button variant="outline">Apply</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;