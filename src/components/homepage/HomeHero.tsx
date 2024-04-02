import type { NextPage } from 'next';
import Image from 'next/image';

const HomeHero: NextPage = () => {
  return (
    <section className='self-stretch flex flex-row items-start justify-start py-0 w-[90%] mx-auto box-border max-w-full text-left text-black '>
      <div className='w-full flex flex-col lg:flex-row items-start justify-start relative max-w-full'>
        <div className='flex-1 flex flex-col text-center lg:text-left items-center lg:items-start justify-start relative max-w-full gap-[16px] pb-[16px] lg:pb-0 pt-[31px]'>
          <h1 className='m-0 flex-1 relative text-inherit font-medium font-inherit max-w-[786px]'>
            Connecting Tech Talents with Opportunities
          </h1>
          <p className='flex-1 relative leading-[32px] inline-block  max-w-[786px]'>
            Techihub is a digital tech community connecting top talent with
            leading companies across Africa and beyond
          </p>
        </div>
        <Image
          src='/images/homepage/heroimg.svg'
          className='object-cover'
          width={583}
          height={598}
          alt='Picture of the author'
        />
      </div>
    </section>
  );
};

export default HomeHero;
