'use client';
import Bgbutton from '@/(components)/shared/Bgbutton';
import { Skeleton } from '@/(components)/ui/skeleton';
import axios from 'axios';
import React from 'react';
import useSWR from 'swr';

function JobDetails({ params }: Readonly<{ params: { id: number } }>) {
  const url = `/techihub/get/${params.id}`;
  const { data, error, isLoading } = Swrgetdat2(url);
  console.log('this is', data);
  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <main className='max-w-[1330px] mx-auto w-[90%]'>
      <section className='flex flex-col lg:flex-row justify-between lg:px-[19px] gap-[32px] lg:gap-0'>
        <div className='flex flex-col gap-[12px]'>
          <h4 className='text-[24px] leading-[120%] font-[400]'>title</h4>
          <div className='flex gap-[8px] items-center'>
            <p className='bg-[#0BA02C] rounded-[3px] py-[4px] px-[12px] text-[14px] text-[#fff]'>
              FULL-TIME
            </p>
            <p className='bg-[#FFEDED] rounded-[52px] py-[4px] px-[12px] text-[14px] text-[#E05151]'>
              Featured
            </p>
          </div>
        </div>
        <div className='flex gap-[12px]'>
          <div className='flex justify-center items-center w-[56px] h-[56px] bg-[#E7F0FA] rounded-[4px]'>
            <img
              className='h-6 w-6 relative'
              loading='lazy'
              alt=''
              src='/images/jobs/book.svg'
            />
          </div>
          <Bgbutton link='/' text='Apply now ' btntype='withborder' />
        </div>
      </section>
      <section className='flex flex-col lg:flex-row justify-between gap-[24px] pt-[42px]'>
        <div className='flex flex-col gap-[16px] max-w-[732px]'>
          <h4 className='text-[18px] font-medium'>job des</h4>
          <p>
            Here at Velstar, we don't just make websites, we create exceptional
            digital experiences that consumers love. Our team of designers,
            developers, strategists, and creators work together to push brands
            to the next level. From Platform Migration, User Experience & User
            Interface Design, to Digital Marketing, we have a proven track
            record in delivering outstanding eCommerce solutions and driving
            sales for our clients.
          </p>
          <h4 className='text-[18px] font-medium'>Requirements</h4>
          <p>
            Great troubleshooting and analytical skills combined with the desire
            to tackle challenges head-on 3+ years of experience in back-end
            development working either with multiple smaller projects
            simultaneously or large-scale applications Experience with HTML,
            JavaScript, CSS, PHP, Symphony and/or Laravel Working regularly with
            APIs and Web Services (REST, GrapthQL, SOAP, etc) Have
            experience/awareness in Agile application development, commercial
            off-the-shelf software, middleware, servers and storage, and
            database management. Familiarity with version control and project
            management systems (e.g., Github, Jira) Great troubleshooting and
            analytical skills combined with the desire to tackle challenges
            head-on Ambitious and hungry to grow your career in a fast-growing
            agency
          </p>
        </div>
        <aside className='flex flex-col w-[100%] max-w-[617px] gap-[32px]'>
          <div className=' h-[160px] flex justify-between w-full border-[#E7F0FA] border-[2px]'>
            <div className='flex p-[32px] items-center justify-center text-center flex-col gap-[12px]'>
              <p className='text-[16px] font-medium text-[#18191C]'>
                Salary (USD)
              </p>
              <p className='text-[#0BA02C] text-[20px] font-medium'>salary</p>
              <p className='text-[#767F8C] font-[400] text-[14px]'>
                Yearly salary
              </p>
            </div>
            <hr className='border-[1px] border-[#E7F0FA] h-[80%] my-auto' />
            <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
              <p className=''>
                <svg
                  className='text-[#0CCE68]'
                  xmlns='http://www.w3.org/2000/svg'
                  width='38px'
                  height='38px'
                  viewBox='0 0 256 256'
                >
                  <g fill='currentColor'>
                    <path d='M160 72v144l-64-32V40Z' opacity='0.2' />
                    <path d='M228.92 49.69a8 8 0 0 0-6.86-1.45l-61.13 15.28l-61.35-30.68a8 8 0 0 0-5.52-.6l-64 16A8 8 0 0 0 24 56v144a8 8 0 0 0 9.94 7.76l61.13-15.28l61.35 30.68a8.15 8.15 0 0 0 3.58.84a8 8 0 0 0 1.94-.24l64-16A8 8 0 0 0 232 200V56a8 8 0 0 0-3.08-6.31M104 52.94l48 24v126.12l-48-24Zm-64 9.31l48-12v127.5l-48 12Zm176 131.5l-48 12V78.25l48-12Z' />
                  </g>
                </svg>
              </p>
              <p className='text-[16px] font-medium text-[#18191C]'>
                Job Location
              </p>
              <p className='text-[#767F8C] font-[400] text-[14px]'>
                Dhaka, Bangladesh
              </p>
            </div>
          </div>
          <div className='py-[32px] px-[23px] border-[#518EF8] border-[2px] rounded-[8px]'>
            <div className='flex flex-col gap-[20px] '>
              <p className='text-[16px] font-medium text-[#18191C]'>
                Job Overview
              </p>
              <div className='flex gap-[16px]'>
                <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
                  <p className=''>
                    <svg
                      className='text-[#88FF99]'
                      xmlns='http://www.w3.org/2000/svg'
                      width='32px'
                      height='32px'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        d='M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2V5a2 2 0 0 0-2-2m0 16H5V9h14zm0-12H5V5h14z'
                      />
                    </svg>
                  </p>
                  <p className='text-[16px] font-medium text-[#18191C]'>
                    Job Posted:
                  </p>
                  <p className='text-[#767F8C] font-[400] text-[14px]'>
                    14 Jun, 2021
                  </p>
                </div>
                <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
                  <p className=''>
                    <svg
                      className='text-[#88FF99]'
                      xmlns='http://www.w3.org/2000/svg'
                      width='32px'
                      height='32px'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        d='M15 1H9v2h6zm-4 13h2V8h-2zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7'
                      />
                    </svg>
                  </p>
                  <p className='text-[16px] font-medium text-[#18191C]'>
                    Job expire in:
                  </p>
                  <p className='text-[#767F8C] font-[400] text-[14px]'>
                    14 Jun, 2021
                  </p>
                </div>
                <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
                  <p className=''>
                    <svg
                      className='text-[#88FF99]'
                      xmlns='http://www.w3.org/2000/svg'
                      width='32px'
                      height='32px'
                      viewBox='0 0 256 256'
                    >
                      <path
                        fill='currentColor'
                        d='M230.91 172a8 8 0 0 1-2.91 10.91l-96 56a8 8 0 0 1-8.06 0l-96-56A8 8 0 0 1 36 169.09l92 53.65l92-53.65a8 8 0 0 1 10.91 2.91M220 121.09l-92 53.65l-92-53.65a8 8 0 0 0-8 13.82l96 56a8 8 0 0 0 8.06 0l96-56a8 8 0 1 0-8.06-13.82M24 80a8 8 0 0 1 4-6.91l96-56a8 8 0 0 1 8.06 0l96 56a8 8 0 0 1 0 13.82l-96 56a8 8 0 0 1-8.06 0l-96-56A8 8 0 0 1 24 80m23.88 0L128 126.74L208.12 80L128 33.26Z'
                      />
                    </svg>
                  </p>
                  <p className='text-[16px] font-medium text-[#18191C]'>
                    Job Level:
                  </p>
                  <p className='text-[#767F8C] font-[400] text-[14px]'>
                    Entry Level
                  </p>
                </div>
              </div>
              <div className='flex gap-[16px]'>
                <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
                  <p className=''>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#88FF99]'
                      width='32px'
                      height='32px'
                      viewBox='0 0 256 256'
                    >
                      <path
                        fill='currentColor'
                        d='M216 66H56a10 10 0 0 1 0-20h136a6 6 0 0 0 0-12H56a22 22 0 0 0-22 22v128a22 22 0 0 0 22 22h160a14 14 0 0 0 14-14V80a14 14 0 0 0-14-14m2 126a2 2 0 0 1-2 2H56a10 10 0 0 1-10-10V75.59A21.84 21.84 0 0 0 56 78h160a2 2 0 0 1 2 2Zm-28-60a10 10 0 1 1-10-10a10 10 0 0 1 10 10'
                      />
                    </svg>
                  </p>
                  <p className='text-[16px] font-medium text-[#18191C]'>
                    Experience
                  </p>
                  <p className='text-[#767F8C] font-[400] text-[14px]'>
                    $50k-80k/month
                  </p>
                </div>
                <div className='flex items-center justify-center text-center flex-col gap-[12px] p-[32px] '>
                  <p className=''>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#88FF99]'
                      width='32px'
                      height='32px'
                      viewBox='0 0 256 256'
                    >
                      <g fill='currentColor'>
                        <path
                          d='M224 118.31V200a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-81.69A191.14 191.14 0 0 0 128 144a191.08 191.08 0 0 0 96-25.69'
                          opacity='0.2'
                        />
                        <path d='M104 112a8 8 0 0 1 8-8h32a8 8 0 0 1 0 16h-32a8 8 0 0 1-8-8m128-40v128a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16h40v-8a24 24 0 0 1 24-24h48a24 24 0 0 1 24 24v8h40a16 16 0 0 1 16 16M96 56h64v-8a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8ZM40 72v41.62A184.07 184.07 0 0 0 128 136a184 184 0 0 0 88-22.39V72Zm176 128v-68.37A200.25 200.25 0 0 1 128 152a200.19 200.19 0 0 1-88-20.36V200z' />
                      </g>
                    </svg>
                  </p>
                  <p className='text-[16px] font-medium text-[#18191C]'>
                    Education
                  </p>
                  <p className='text-[#767F8C] font-[400] text-[14px]'>
                    Graduation
                  </p>
                </div>
              </div>
              <hr className='border-[1px] border-[#E7F0FA]' />
              <div className='flex flex-col gap-[8px] '>
                <p className='text-[16px] font-medium text-[#18191C]'>
                  Job Overview
                </p>
                <div className='flex gap-[8px]'>
                  <div className='bg-[#E7F0FA] flex gap-[8px] rounded-[4px] px-[16px] py-[8px]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#88FF99]'
                      width='24px'
                      height='24px'
                      viewBox='0 0 256 256'
                    >
                      <path
                        fill='currentColor'
                        d='M165.66 90.34a8 8 0 0 1 0 11.32l-64 64a8 8 0 0 1-11.32-11.32l64-64a8 8 0 0 1 11.32 0M215.6 40.4a56 56 0 0 0-79.2 0l-30.06 30.05a8 8 0 0 0 11.32 11.32l30.06-30a40 40 0 0 1 56.57 56.56l-30.07 30.06a8 8 0 0 0 11.31 11.32l30.07-30.11a56 56 0 0 0 0-79.2m-77.26 133.82l-30.06 30.06a40 40 0 1 1-56.56-56.57l30.05-30.05a8 8 0 0 0-11.32-11.32L40.4 136.4a56 56 0 0 0 79.2 79.2l30.06-30.07a8 8 0 0 0-11.32-11.31'
                      />
                    </svg>
                    <p className='text-[16px] text-[#0CCE68]'>Copy Links</p>
                  </div>
                  <p className='bg-[#E7F0FA] p-[10px] flex justify-center items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#0CCE68]'
                      width='20px'
                      height='20px'
                      viewBox='0 0 16 16'
                    >
                      <path
                        fill='currentColor'
                        fillRule='evenodd'
                        d='M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm1.102 4.297a1.195 1.195 0 1 0 0-2.39a1.195 1.195 0 0 0 0 2.39m1 7.516V6.234h-2v6.579zM6.43 6.234h2v.881c.295-.462.943-1.084 2.148-1.084c1.438 0 2.219.953 2.219 2.766c0 .087.008.484.008.484v3.531h-2v-3.53c0-.485-.102-1.438-1.18-1.438c-1.079 0-1.17 1.198-1.195 1.982v2.986h-2z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </p>
                  <p className='bg-[#0CCE68] p-[10px] flex justify-center items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#fff]'
                      width='20px'
                      height='20px'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        d='M20 12.05a8 8 0 1 0-9.25 8v-5.67h-2v-2.33h2v-1.77a2.83 2.83 0 0 1 3-3.14a11.92 11.92 0 0 1 1.79.16v2h-1a1.16 1.16 0 0 0-1.3 1.26v1.51h2.22l-.36 2.33h-1.85V20A8 8 0 0 0 20 12.05'
                      />
                    </svg>
                  </p>
                  <p className='bg-[#E7F0FA] p-[10px] flex justify-center items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#0CCE68]'
                      width='20px'
                      height='20px'
                      viewBox='0 0 16 16'
                    >
                      <path
                        fill='currentColor'
                        d='M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518a3.3 3.3 0 0 0 1.447-1.817a6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429a3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218a3.2 3.2 0 0 1-.865.115a3 3 0 0 1-.614-.057a3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15'
                      />
                    </svg>
                  </p>
                  <p className='bg-[#E7F0FA] p-[10px] flex justify-center items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-[#0CCE68]'
                      width='20px'
                      height='20px'
                      viewBox='0 0 36 36'
                    >
                      <path
                        fill='currentColor'
                        d='M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-1.54 22H5.66l7-7.24l-1.44-1.39L4 26.84V9.52l12.43 12.37a2 2 0 0 0 2.82 0L32 9.21v17.5l-7.36-7.36l-1.41 1.41ZM5.31 8h25.07L17.84 20.47Z'
                        className='clr-i-outline clr-i-outline-path-1'
                      />
                      <path fill='none' d='M0 0h36v36H0z' />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default JobDetails;

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.data.job);
const baseUrl = 'https://techihubjobsproject.azurewebsites.net';
function Swrgetdat2(url: string) {
  const { data, error, isLoading } = useSWR(`${baseUrl}${url}`, fetcher); //, {refreshInterval: 3000}
  return {
    data: data,
    isLoading,
    error: error,
  };
}
