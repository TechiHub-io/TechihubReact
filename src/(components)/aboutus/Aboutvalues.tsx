import Image from 'next/image'
import React from 'react'
const data = [
  {
    id: 1,
    title: "Empower",
    subtitle: "we believe that",
    url: '/images/aboutus/empowervalue.svg',
    des: "Your dreams, and your potential as the driving force behind everything we do. We believe that every line of code, every design stroke, and every idea holds the power to shape the future",
    bgcolor: "#364187" 
  },
  {
    id: 2,
    title: "Collaborate",
    subtitle: "we foster",
    url: '/images/aboutus/collaboratevalue.svg',
    des: "Connection with fellow innovators from every corner of the globe 🌐, sharing insights, and co-creating the solutions.",
    bgcolor: "#0CCE68" 
  },
  {
    id: 3,
    title: "Innovate",
    subtitle: "we are",
    url: '/images/aboutus/innovatevalue.svg',
    des: "Your virtual innovation lab, where you can experiment, ideate, and revolutionize the tech landscape.",
    bgcolor: "#85c4ff" 
  }
]
function Aboutvalues() {
  return (
    <div>
      <h2 className='text-center'>
       Our Values
      </h2>
      <div className='flex flex-col lg:flex-row gap-[40px] lg:gap-0 lg:justify-center items-center pt-[40px]'>
        {
          data.map((dat) => (
            <div key={dat.id} className='flex flex-col gap-[40px] items-center max-w-[327px] min-h-[596px] p-[2rem] max-h-[596px]' style={{backgroundColor: dat.bgcolor}}>
              <h2 className='text-center text-[30px] lg:text-[40px] text-[#fff]'>
                {dat.title}
              </h2>
              <Image
                src={dat.url}
                alt={dat.title}
                width={187}
                height={187}
              />
              <div className='flex flex-col items-center lg:items-start'>
                <h3 className='text-[#fff] lg:text-left'>
                  {dat.subtitle}
                </h3>
                <p className='text-center text-[#fff] lg:text-left'>
                  {dat.des}
                </p>
              </div>  
              
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Aboutvalues