import React from 'react'
import Homesecondsectioncomponent from './Homesecondsectioncomponent'

const data = [
  {
    id: 1,
    title: "🚀 Short Term or Project Staffing",
    des: "Simplify your hiring process with our user-friendly platform. From job posting to candidate selection, we make recruitment efficient and straightforward."
  },
  {
    id: 2,
    title: "🚀 Short Term or Project Staffing",
    des: "Simplify your hiring process with our user-friendly platform. From job posting to candidate selection, we make recruitment efficient and straightforward."
  },
  {
    id: 3,
    title: "🌟 Empowering Careers",
    des: "For job seekers, Techily is not just a platform – it's a launchpad to elevate your career. Unleash your potential and turn your passion into a profession with our empowering opportunitie"
  },
  {
    id: 4,
    title: "🌐 Largest Tech Network",
    des: "Connect with top tech talent from Africa and beyond. Our diverse and skilled community is ready to shape the future with innovation."
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