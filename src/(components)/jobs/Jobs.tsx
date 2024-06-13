
'use client';
import React, { useMemo } from 'react';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import Job from './Job';
import { Jobsd, Jobsprops } from '@/libs/types/Jobstypes';
import { Skeleton } from '../ui/skeleton';

// @ts-ignore

function Jobs({ filters }) {
  const url = '/techihub/list';
  const { data, error, isLoading } = Swrgetdat(url);
  const filteredJobs = useMemo(() => {
    if (!data) return [];
    if (Object.keys(filters).length === 0) {
      return data.jobs;
    } else {
        return data.jobs.filter((job: Jobsd) => {
            return (
                (!filters.jobType || job?.jobType === filters?.jobType || job?.jobType?.toLowerCase() === filters?.jobType?.toLowerCase() || job?.jobType?.toUpperCase() === filters?.jobType?.toUpperCase() ) &&
                (!filters.location || job?.location?.toLowerCase() === filters?.location.toLowerCase() )
            );
        });
    }
  }, [data, filters]);

  if (isLoading) {
    return <div><Skeleton /></div>;
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
