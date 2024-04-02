import React from 'react';
import EmblaCarousela from './embla/EmblaCarousela';
import './embla/Embla.css'
const OPTIONS = { loop: false, dragFree: true };
const alldata = [
  {
    id: 1,
    url: '/images/homepage/bargradient.svg',
    title: 'Create Profile',
    lines: "/images/homepage/arrowup.svg",
    myclass: "higher",
    numb: 1,
    des: "For job seekers, build a standout profile showcasing your skills and experience. Employers, set up your company profile to start connecting with top-tier talent.",
  },
  {
    id: 2,
    url: '/images/homepage/bargradient.svg',
    title: 'Explore Opportunities',
    lines: "/images/homepage/arrowdown.svg",
    myclass: "lower",
    numb: 2,
    des: 'Browse through our dynamic job board or talent pool. Job seekers, find the perfect role. Employers, discover exceptional tech talent that aligns with your requirements.',
  },
  {
    id: 3,
    url: '/images/homepage/bargradient.svg',
    title: 'Engage with the Community',
    lines: "/images/homepage/arrowup.svg",
    myclass: "higher",
    numb: 3,
    des: "Join discussions, share insights, and network with like-minded individuals on our vibrant community platform. Techiiehub is not just a platform; it's your tech community",
  },
  {
    id: 4,
    url: '/images/homepage/bargradient.svg',
    title: 'Streamlined Recruitment Process',
    lines: "/images/homepage/empty.svg",
    myclass: "lower",
    numb: 4,
    des: "For employers, post jobs effortlessly and manage applications through our seamless recruitment process. Job seekers, experience a user-friendly application process that brings opportunities close",
  },
];

function JourneySection() {
  return (
    <section className='py-[65px]  gap-[27px] w-90% mx-auto flex flex-col justify-center items-center gap-[77px]'>
      <h2 className='text-center min-w-[348px] flex justify-center items-center'>
        Getting Started with Techiehub
      </h2>
      <EmblaCarousela slides={alldata} options={OPTIONS} />
    </section>
  );
}

export default JourneySection;
