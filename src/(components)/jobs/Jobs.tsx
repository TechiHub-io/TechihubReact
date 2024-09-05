'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import Job from './Job';
import { Jobsd, Jobsprops } from '@/libs/types/Jobstypes';
import { Skeleton } from '../ui/skeleton';
import BouncingCirclesLoader from '@/components/animations/BouncingCircleLoader';

// @ts-ignore
function Jobs({ filters }) {
  const url = '/techihub/list';
  const { data, error, isLoading } = Swrgetdat(url);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!data) return [];
    let jobs = [...data.jobs];
    
    // Sort jobs in descending order (assuming there's an 'id' field)
    jobs.sort((a: Jobsd, b: Jobsd) => {
      return (b.id as any) - (a.id as any);
    });

    if (Object.keys(filters).length === 0) {
      return jobs;
    } else {
        return jobs.filter((job: Jobsd) => {
            return (
                (!filters.jobType || job?.jobType === filters?.jobType || job?.jobType?.toLowerCase() === filters?.jobType?.toLowerCase() || job?.jobType?.toUpperCase() === filters?.jobType?.toUpperCase() ) &&
                (!filters.location || job?.location?.toLowerCase() === filters?.location.toLowerCase() ) &&
                (!filters.jobLevel || job?.jobLevel === filters?.jobLevel || job?.jobLevel?.toLowerCase() === filters?.jobLevel?.toLowerCase() || job?.jobLevel?.toUpperCase() === filters?.jobLevel?.toUpperCase() )
            );
        });
    }
  }, [data, filters]);

  if (isLoading || showLoader) {
    return <div className="flex justify-center items-center h-screen"><BouncingCirclesLoader /></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className='w-[90%] max-w-[1330px] mx-auto'>
      <h2 className='pb-[48px] pt-[64px] md:text-[36px] text-[24px]'>
        Featured Jobs
      </h2>
      <section className='flex gap-[24px] flex-col'>
        {filteredJobs.length > 0 ? filteredJobs.map((dat: Jobsprops) => (
            <Job
              key={dat?.id}
              id={dat.id}
              title={dat.title}
              location={dat?.location}
              salary={dat?.salary}
              companyName={dat?.companyName}
              jobType={dat?.jobType}
              employer={dat?.employer}
            />
          )) : <div>No jobs found matching your criteria.</div>}
      </section>
    </section>
  );
}

export default Jobs;
