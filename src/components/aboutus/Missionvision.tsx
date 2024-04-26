import Image from 'next/image'
import React from 'react'
const data = [
  {
    id: 1,
    title: "Our mission",
    url: '/images/aboutus/ourmissionicon.svg',
    des: "Our mission is to empower individuals, disrupt norms, and elevate the tech ecosystem by providing opportunities that redefine the future."
  },
  {
    id: 2,
    title: "Our vision",
    url: '/images/aboutus/ourvisionicon.svg',
    des: "We envision millions stepping into dream tech careers through Techily, reshaping industries and transforming lives."
  }
]
function Missionvision() {
  return (
    <section>
      <div className='flex flex-col lg:flex-row gap-[40px] lg:gap-0 lg:justify-between items-center pt-[40px]'>
        {
          data.map((dat) => (
            <div key={dat.id} className='flex flex-col gap-[40px] justify-center items-center max-w-[550px]'>
              <h2 className='text-center'>
                {dat.title}
              </h2>
              <Image
                src={dat.url}
                alt={dat.title}
                width={97}
                height={97}
              />
              <p className='text-center text-[22px]'>
                {dat.des}
              </p>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default Missionvision