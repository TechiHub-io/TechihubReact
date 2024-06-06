import React from 'react'
import Homesecondsectioncomponent from './Homesecondsectioncomponent'

const data = [
  {
    id: 1,
    title: "🚀 Seamless Recruitment",
    des: "Your journey to finding the perfect tech talent starts right here, right now. At Techihub, we're not just another platform; Get ready to elevate your hiring game, connect with top-notch technologists, and shape the future of your team!"
  },
  {
    id: 2,
    title: "🚀 Short Term or Project Staffing",
    des: "Embrace the agility of project-based staffing with our Project Contracting services. Whether you need a specialized skillset for a specific project or seek to augment your team's capabilities, our Staff on Demand solutions provide the flexibility you need."
  },
  {
    id: 3,
    title: "🌟 Empowering Careers",
    des: "For job seekers, Techihub is not just a platform – it's a launchpad to elevate your career. Unleash your potential and turn your passion into a profession with our empowering opportunities."
  },
  {
    id: 4,
    title: "🌐 Largest Tech Network",
    des: "Our community is where tech enthusiasts and industry experts unite. For job seekers, it's a one-stop-shop for tech jobs, career advice, and a network of like-minded peers. For employers, it's a hub to discover talent, share insights, and stay ahead of innovation."
  }
]

function Homesecondsection() {
  return (
    <div className="self-stretch flex flex-col items-center justify-center w-[90%] mx-auto font-poppins pt-[40px] lg:pt-[77px] gap-[40px]">
      <div className='flex flex-col items-center'>
        <h2>
         Why Techihub
        </h2>
        <p className='max-w-[635px] text-center'>
          We are ready to accelerate your vision, whether looking for an opportunity or looking for great tech talent, we exist for you!
        </p>
      </div>
      <div className="max-w-[1330px] grid grid-cols-1 md:grid-cols-2 relative gap-[40px] lg:gap-[80px]">
        {
          data.map((dat) => (
            <Homesecondsectioncomponent
              key={dat.id}
              title={dat.title}
              des={dat.des}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Homesecondsection