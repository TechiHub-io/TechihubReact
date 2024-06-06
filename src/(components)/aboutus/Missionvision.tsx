import Image from 'next/image'
import React from 'react'
const data = [
  {
    id: 1,
    title: "Our mission",
    url: '/images/aboutus/ourmissionicon.svg',
    des: "Our mission is to Unleashing the human potential to be at the center of creating innovative solutions for the world. "
  },
  {
    id: 2,
    title: "Our vision",
    url: '/images/aboutus/ourvisionicon.svg',
    des: "To be a leading platform to transform Africa into a global tech hub, empowering over 1 million talents & thousands of organizations to drive innovation and achieve $1 billion in economic growth by 2035."
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