'use client';
import React from 'react';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import Job from './Job';
import { Jobsprops } from '@/libs/types/Jobstypes';
import { Skeleton } from '../ui/skeleton';

function Jobs() {
  const url = '/techihub/list';
  const { data, error, isLoading } = Swrgetdat(url);
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
        {data ? data?.jobs.map((dat: Jobsprops) => (
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
          )) : <Skeleton/>}
      </section>
    </section>
  );
}

export default Jobs;
