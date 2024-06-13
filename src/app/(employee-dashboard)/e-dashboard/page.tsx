'use client';
import Image from 'next/image';
import React from 'react';
import EStatistics from './(components)/EStatistics';
import Job from '@/(components)/jobs/Job';
import { Jobsprops } from '@/libs/types/Jobstypes';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import EJobDash from './(components)/EJobsDash';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const data2 = [
  {
    id: 1,
    url: '/images/dashboard/briefcase.svg',
    urlcolor: '#000',
    color: '#000',
    text: 'Applied Jobs',
    bg: '#88FF99',
    stat: 36,
  },
  {
    id: 2,
    url: '/images/dashboard/bookmark.svg',
    urlcolor: '#0CCE68',
    color: '#fff',
    text: 'Saved Candidates',
    bg: '#364187',
    stat: 418,
  },
];

export type thetypes = {
  id: number;
  url: string;
  urlcolor: string;
  color: string;
  text: string;
  bg: string;
  stat: number;
};

const EDashboard = () => {
  const url = '/techihub/list';
  const {data: session} = useSession({
    required: true,
    onUnauthenticated(){
      redirect("/api/auth/signin?callbackUrl=/e-dashboard")
    }
  }
  );
  
  
  const callout = () => {
    // @ts-ignore
    if(session?.user?.role !== "EMPLOYER") {
     redirect("/home'");
    }
  }
  setTimeout(() => {
    callout();
  }, 2000)
  

  const { data, error, isLoading } = Swrgetdat(url);
  if (isLoading) {
    return <div>loding ...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <section className='max-w-[822px]'>
      <div className='flex flex-col lg:flex-row lg:justify-between'>
        <div className='flex flex-col gap-[32px] max-w-[396px] min-h-[84px]'>
          <h2 className='text-[32px] text-[#000] font-light'>
            Hello Techihub!
          </h2>
        </div>
        <div className='flex gap-[25px] justify-center items-center'>
          <Image
            src='/images/dashboard/avator.svg'
            alt='avator'
            className='rounded-full'
            width={49}
            height={49}
          />
          {/* <Image src='/images/dashboard/bell2.svg' alt='avator' className="rounded-full" width={28.61} height={36.77} /> */}
        </div>
      </div>
      <div>
        <h4 className=' font-medium text-[16.48px] py-[20px]'>
          Application Statistics
          <div className='grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr)_)] gap-[32px] pt-[20px]'>
            {data2.map((dat: thetypes) => (
              <EStatistics
                key={dat.id}
                url={dat.url}
                urlcolor={dat.urlcolor}
                color={dat.color}
                text={dat.text}
                bg={dat.bg}
                stat={dat.stat}
                id={0}
              />
            ))}
          </div>
        </h4>
      </div>
      <div className='h-[48.6px] p-[10px] bg-[#767F8C] text-[18.54px] font-thin flex justify-around md:justify-start '>
        <p>Job</p>
        <p className='md:pl-[320px]'>Applicants</p>
        <p className='md:pl-[32px]'>Status</p>
      </div>
      <div>
        <h3 className='py-[32px] text-[16.48px] font-medium'>Applied Jobs</h3>

        <section className='flex gap-[24px] flex-col'>
          {data ? (
            data?.jobs?.map((dat: Jobsprops) => (
              <EJobDash
                key={dat?.id}
                id={dat.id}
                title={dat.title}
                location={dat?.location}
                salary={dat?.salary}
                companyName={dat?.companyName}
                jobType={dat?.jobType}
                employer={dat?.employer}
              />
            ))
          ) : (
            <p>loading</p>
          )}
        </section>
      </div>
    </section>
  );
};
export default EDashboard;
