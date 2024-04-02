import React from 'react'
import Bgbutton from '../shared/Bgbutton';
import Image from 'next/image';
const data = [
  {
    id: 1,
    title: "End to end talent Sourcing",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs to onboarding. We ensure a tailored match that aligns with your organizational goals, simplifying the entire hiring process.",
    link: "/our-services",
    url: "/images/ourservices/img1.svg",
    text: "Post Jobs",
    btntype: "withborder"
  },
  {
    id: 2,
    title: "Job Board with Global Reach",
    des: "Our job board is more than a platform – it's a portal to a world of tech talent spanning Africa and beyond. Post your job openings and connect with the best minds in the industry, wherever they may be.",
    link: "/our-services",
    url: "/images/ourservices/img2.svg",
    text: "Explore Jobs",
    btntype: "withborder"
  },
  {
    id: 3,
    title: "Staff on Demand",
    des: "Embrace flexibility with our project-based staffing solutions. Whether you need specialized skills for a project or want to augment your team, our staff-on-demand services provide the flexibility you need",
    link: "/our-services",
    url: "/images/ourservices/img3.svg",
    text: "Contact us",
    btntype: "withborder"
  },
  {
    id: 4,
    title: "Thriving Tech Talent Community",
    des: "Techiehub’s Community Platform is where tech enthusiasts and industry experts unite. For job seekers, it's a one-stop-shop for tech jobs, career advice, and a network of like-minded peers. For employers, it's a hub to discover talent, share insights, and stay at the forefront of innovation",
    link: "/our-services",
    url: "/images/ourservices/img4.svg",
    text: "Join Community",
    btntype: "withborder"
  },
  {
    id: 5,
    title: "Advanced ATS Database",
    des: "Streamline your hiring process with our Advanced ATS Database. Effortlessly search, filter, and access a pool of curated tech talent profiles that align with your requirements.",
    link: "/our-services",
    url: "/images/ourservices/img5.svg",
    text: "Coming Soon",
    btntype: "withborder"
  }
]

interface ServicesProps {
  readonly title: string;
  readonly des: string;
  readonly link: string
  readonly text: string
}
function Services() {
  return (
    <main className='flex flex-col gap-28px'>
      <h2 className='text-center'>
        Our Services
      </h2>
      <div className='flex flex-col gap-[40px] place-items-center'>
        {
          data.map((dat) => (
            <section key={dat.id} className='flex flex-row-reverse items-center lg:gap-[76px] w-[100%]  odd:flex-row'>
              <div className='flex flex-col gap-[34px] items-center lg:items-start flex-1'>
                <h3 className='max-w-[603px] text-center lg:text-left'>{dat.title}</h3>
                <Image
                  className='block lg:hidden'
                  src={dat.url}
                  alt={dat.title}
                  width={536}
                  height={339}
                />
                <p className='max-w-[603px] text-center lg:text-left'>
                  {dat.des}
                </p>
                <Bgbutton link={dat.link} text={dat.text} btntype={dat.btntype} />
              </div>
              <Image
                className='hidden lg:block'
                src={dat.url}
                alt={dat.title}
                width={536}
                height={339}
              />
            </section>
          ))
        }
      </div>
    </main>
  )
}

export default Services