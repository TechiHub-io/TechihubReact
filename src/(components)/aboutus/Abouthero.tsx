import React from 'react'
import Bgbutton from '../shared/Bgbutton'

function Abouthero() {
  return (
    <section className='relative bg-[url(/images/aboutus/herobg.svg)] bg-no-repeat w-full bg-center lg:bg-none'>
      <img
          src='/images/aboutus/herobg.svg'
          className='hidden lg:block absolute top-[-2px] w-full left-0 max-h-[633px] object-cover '
          width="100%"
          alt='gradient'
        />
      
      <div className='w-[90%] mx-auto flex flex-col gap-[32px] items-center lg:items-baseline lg:flex-row lg:justify-between lg:gap-0 pb-[40px] lg:pb-[77px] h-[661px] relative max-w-[1440px]'>
      <h1 className='max-w-[842px] text-center lg:text-left text-[#fff] '>
        About us
      </h1>
      <div className='flex items-center lg:items-start flex-col gap-[34px] lg:gap-[68px] max-w-[539px]'>
        <p className='text-center lg:text-left text-[#fff] '>
          Techihub connects top tech talent with global opportunities through our seamless platform. Beyond jobs, we foster innovation and diversity in a vibrant community. Join for a dynamic tech experience.
        </p>
        <div className='flex flex-col lg:flex-row gap-[20px] justify-between !text-[#fff] '>
          <Bgbutton link="/jobs" text='Explore Jobs' btntype='withborder'/>
          <Bgbutton link="/jobs" text='Post Jobs' btntype='borderless'/>
        </div>
      </div>
      </div>
  </section>
  )
}

export default Abouthero