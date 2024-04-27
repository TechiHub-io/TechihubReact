import Image from 'next/image'
import React from 'react'

function Aboutstory() {
  return (
    <div>
      <h2 className='text-center lg:text-left pb-[25px]'>
        Our story
      </h2>
      <div className=' flex flex-col items-center lg:flex-row gap-[35px] lg:gap-[70px] lg:items-start'>
        <div className='flex flex-col items-center gap-[40px] max-w-[650px]'>
          <Image 
            src="/images/aboutus/image1.svg"
            alt='about us'
            className='block lg:hidden'
            width={536}
            height={339}
          />
          <p className='text-center lg:text-left'>
            In August 2022, Techily started with a vision for Africa's Tech Potential that evolved into a transformative hub connecting top-tier tech talent with global opportunities. One year down the line, Techily rebranded to Techihub with emphasis of seamless integration of technology, AI and create access to vast Africa’s young talent.  
            <br />
            <br />
            Beyond jobs, Techihub catalyzes innovation, empowerment, and economic advancement in Africa, shaping the tech revolution's future
          </p>
          <div className='flex gap-[32px]'>
            <div className='flex flex-col justify-around'>
              <p className='text-[#fff] bg-[#0CCE68] px-[15px] py-[20px] items-start rounded-full flex justify-center'>
                2022
              </p>
              <hr className='border-[#0CCE68] border-[2px] rotate-90 ' />
            </div>
            <div className='flex flex-col gap-[25px] max-w-[551px]'>
              <h3 className='text-left'>
                Inception
              </h3>
              <p className='text-left'>
                Two young innovators fueled by a shared belief in the untapped potential of Africa's tech talent set out on a mission to transform the continent into a thriving hub of  innovation.
              </p>
            </div>
          </div>
          <div className='flex gap-[32px]'>
            <div className='flex flex-col justify-around'>
              <p className='text-[#fff] bg-[#0CCE68] px-[15px] py-[20px] items-start rounded-full flex justify-center'>
                2023
              </p>
              <hr className='border-[#0CCE68] border-[2px] rotate-90 ' />
            </div>
            <div className='flex flex-col gap-[25px] max-w-[551px]'>
              <h3 className='text-left'>
                Re-branding
              </h3>
              <p className=':text-left'>
                In August 2023, Techily re-branded to Techihub with technology innovation to solve global gap for tech talent merging technology, AI and Talent Community. 
              </p>
            </div>
          </div>
        </div>
        <Image 
          src="/images/aboutus/image1.svg"
          alt='about us'
          className='hidden lg:block'
          width={536}
          height={339}
        />
      </div>
    </div>
  )
}

export default Aboutstory