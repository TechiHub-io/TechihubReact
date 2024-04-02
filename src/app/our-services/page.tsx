import Lasttwosections from '@/components/homepage/Lasttwosections'
import Servicehero from '@/components/ourservices/Servicehero'
import Services from '@/components/ourservices/Services'
import React from 'react'
const data = [
  {
    id: 1,
    title: "Ready to Transform your Career? Join the Tribe!",
    des: "Are you a techie ready to embark on a journey of endless possibilities? Join Techihub, where your skills meet unparalleled opportunities. Elevate your tech career with us!",
    link: "/jobs",
    text: "Explore Jobs",
    btntype: "withborder"
  },
  {
    id: 2,
    title: "Ready to Grow your Business? ",
    des: "Are you an employer seeking top-tier tech talent? We are glad that you are here. We bridge the talent and skills gaps in your organizations with a pool of ready to sprint skilled talent.",
    link: "/jobs",
    text: "Post Jobs",
    btntype: "borderless"
  }
]
function page() {
  return (
    <div className='w-[90%] mx-auto max-w-[1440px]'>
      <Servicehero />
      <Services />
      <Lasttwosections title={data[0].title} des={data[0].des} link={data[0].link} text={data[0].text} btntype={data[0].btntype} />
      <Lasttwosections title={data[1].title} des={data[1].des} link={data[1].link} text={data[1].text} btntype={data[1].btntype} />
    </div>
  )
}

export default page