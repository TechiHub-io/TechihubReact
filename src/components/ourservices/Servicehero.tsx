import Image from 'next/image'
import React from 'react'

function Servicehero() {
  return (
    <section className='flex flex-col gap-[32px] lg:flex-row lg:gap-0 pb-[40px] lg:pb-[77px]'>
      <h2 className='max-w-[842px] text-center lg:text-left pt-[16px] lg:pt-[77px]'>
        Your gateway to a world of tech excellence
      </h2>
      <Image
        src="/images/ourservices/hero.svg"
        width={616}
        height={616}
        alt='heroimg'
      />
    </section>
  )
}

export default Servicehero