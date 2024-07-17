import React from 'react'
import Bgbutton from '../shared/Bgbutton'

function Abouthero() {
  return (
    <section className='relative w-full !h-[661px]'>
      <div className='absolute inset-0 w-full h-[661px] overflow-hidden'>
        <img
          src='/images/aboutus/herobg.svg'
          className='w-full h-full object-cover'
          alt='gradient background'
        />
      </div>
      
      <div className='relative w-[90%] mx-auto flex flex-col gap-[32px] items-center lg:items-baseline lg:flex-row lg:justify-between lg:gap-0 py-[40px] lg:py-[77px] min-h-[661px] max-w-[1440px]'>
        <h1 className='max-w-[842px] text-center lg:text-left text-white z-10'>
          About us
        </h1>
        <div className='flex items-center lg:items-start flex-col gap-[34px] lg:gap-[68px] max-w-[539px] z-10'>
          <p className='text-center lg:text-left text-white'>
            Techihub connects top tech talent with global opportunities through our seamless platform. Beyond jobs, we foster innovation and diversity in a vibrant community. Join for a dynamic tech experience.
          </p>
          <div className='flex flex-col lg:flex-row gap-[20px] justify-between text-white'>
            <Bgbutton link="/jobs" text='Explore Jobs' btntype='withborder'/>
            <Bgbutton link="/jobs" text='Post Jobs' btntype='borderless'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Abouthero