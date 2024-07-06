import React from 'react'
import Bgbutton from '../shared/Bgbutton'

const page = () => {
  return (
    <main className='bg-[url(/images/blogs/bg.svg)] min-h-[800px] w-full flex flex-col lg:flex-row bg-center bg-no-repeat'>
      <section className='bg-[#364187]' style={{flex: 0.5}}>
        <div className='max-w-[409px] mx-auto flex flex-col p-[32px] lg:p-0 gap-[32px] lg:gap-[60px] items-center lg:items-start lg:justify-start'>
          <img src="/images/blogs/icona.svg" width="409" className='object-contain' alt="image" />
          <h2 className='text-[#fff] text-center lg:text-left'>
            Are you looking for Tech Jobs?  
          </h2>
          <Bgbutton link='/sign-up/candidate' text="Create account" btntype='withborder' />
        </div>
      </section>
      <section className='#fff lg:border-l-[#0CCE68] lg:border-l-[10px] lg:border-opacity-[0.8]' style={{flex: 0.5}}>
        <div className='max-w-[409px] mx-auto flex items-center h-full flex-col justify-center p-[32px] lg:p-0 lg:justify-end gap-[32px] lg:gap-[40px]'>
         <h2 className='text-center  text-[#364187]'>
            Are you looking for Tech Jobs?  
          </h2>
          <Bgbutton link='/sign-up/employer' text="Start hiring" btntype='withborder' />
          <img src="/images/blogs/iconb.jpg" className='object-contain' alt="image" />
        </div>
      </section>
    </main>
  )
}

export default page
