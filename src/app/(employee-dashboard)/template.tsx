'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const data = [
  {
    id: 1,
    url: '/images/dashboard/dashboard.svg',
    text: 'Dashboard',
    redirect: '/e-dashboard',
  },
  {
    id: 2,
    url: '/images/dashboard/briefcase.svg',
    text: 'My Jobs',
    redirect: '/my-jobs',
  },
  {
    id: 3,
    url: '/images/dashboard/bookmark.svg',
    text: 'Saved Candidate',
    redirect: '/saved-candidate',
  },
  {
    id: 4,
    url: '/images/dashboard/bell.svg',
    text: 'Notifications',
    redirect: '/notifications',
  },
  {
    id: 5,
    url: '/images/dashboard/settings.svg',
    text: 'Settings',
    redirect: '/e-settings',
  },
  {
    id: 6,
    url: '/images/dashboard/post.svg',
    text: 'Post Job',
    redirect: '/post-job',
  },
];

interface Datatypes {
  readonly id: number;
  readonly url: string;
  readonly text: string;
  readonly redirect: string;
}

export default function EmployeeTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setopen] = useState(false);
  const notopen = 'hidden';
  const openned =
    'list-none flex flex-col max-w-[305px] items-start justify-start';
  return (
    <section className='flex xl:gap-[76px]'>
      <aside className='max-w-[305px] relative min-w-[50px] '>
        <div className=''>
          <ul className={open === false ? openned : notopen}>
            {data.map((dat: Datatypes) => (
              <li key={dat.id} className="z-10 bg-[#fff]">
                <Link
                  href={dat.redirect}
                  className={
                    pathname === dat.redirect
                      ? 'self-stretch bg-[#88FF99] opacity-[40%] min-w-[200px] lg:min-w-[305px] overflow-hidden flex flex-row items-start justify-start pt-6 px-[17px] pb-[18px] gap-[53px] max-[750px]:flex-wrap'
                      : ' min-w-[200px] lg:min-w-[305px] self-stretch bg-white overflow-hidden flex flex-row items-start justify-start pt-6 px-[17px] pb-[18px] gap-[53px] max-[750px]:flex-wrap'
                  }
                >
                  <Image
                    src={dat.url}
                    className='relative overflow-hidden shrink-0'
                    alt={dat.text}
                    width={31}
                    height={31}
                  />
                  <p className='relative text-[15px] leading-[27px] font-medium text-[#000] opacity-[70%] text-left inline-block min-w-[85px]'>
                    {dat.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='absolute top-[50%] right-0 cursor-pointer lg:hidden z-20'>
          {open === false ? (
            <svg
              onClick={() => setopen(!open)}
              xmlns='http://www.w3.org/2000/svg'
              width='32px'
              height='32px'
              viewBox='0 0 24 24'
            >
              <g
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              >
                <path strokeDasharray='20' strokeDashoffset='20' d='M21 3V21'>
                  <animate
                    fill='freeze'
                    attributeName='stroke-dashoffset'
                    dur='0.3s'
                    values='20;0'
                  />
                </path>
                <path
                  strokeDasharray='15'
                  strokeDashoffset='15'
                  d='M17 12H3.5'
                >
                  <animate
                    fill='freeze'
                    attributeName='stroke-dashoffset'
                    begin='0.4s'
                    dur='0.2s'
                    values='15;0'
                  />
                </path>
                <path
                  strokeDasharray='12'
                  strokeDashoffset='12'
                  d='M3 12L10 19M3 12L10 5'
                >
                  <animate
                    fill='freeze'
                    attributeName='stroke-dashoffset'
                    begin='0.6s'
                    dur='0.2s'
                    values='12;0'
                  />
                </path>
              </g>
            </svg>
          ) : (
            <svg
              onClick={() => setopen(!open)}
              xmlns='http://www.w3.org/2000/svg'
              width='32PX'
              height='32PX'
              viewBox='0 0 24 24'
            >
              <g transform='translate(24 0) scale(-1 1)'>
                <g
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                >
                  <path strokeDasharray='20' strokeDashoffset='20' d='M21 3V21'>
                    <animate
                      fill='freeze'
                      attributeName='stroke-dashoffset'
                      dur='0.3s'
                      values='20;0'
                    />
                  </path>
                  <path
                    strokeDasharray='15'
                    strokeDashoffset='15'
                    d='M17 12H3.5'
                  >
                    <animate
                      fill='freeze'
                      attributeName='stroke-dashoffset'
                      begin='0.4s'
                      dur='0.2s'
                      values='15;0'
                    />
                  </path>
                  <path
                    strokeDasharray='12'
                    strokeDashoffset='12'
                    d='M3 12L10 19M3 12L10 5'
                  >
                    <animate
                      fill='freeze'
                      attributeName='stroke-dashoffset'
                      begin='0.6s'
                      dur='0.2s'
                      values='12;0'
                    />
                  </path>
                </g>
              </g>
            </svg>
          )}
        </div>
      </aside>
      <div className='py-[24px] flex-1'>{children}</div>
    </section>
  );
}
