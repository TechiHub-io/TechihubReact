import Image from 'next/image'
import React from 'react'
import { thetypes } from '../page'

const Statistics = ({id, url, urlcolor, color, text, bg, stat}: thetypes) => {
  return (
    <div className={`min-w-[253px] min-h-[133px] py-[27px] px-[16px] bg-[${bg}] rounded-lg`}>
      <div className='flex justify-between items-center'>
        <h3 className='text-[32px] font-medium text-[#fff]'>
          {stat}
        </h3>
        <Image src={url} className={`text-[${urlcolor}]`} alt={text} width={29} height={27} />
      </div>
      <p className={`text-[13.39] pt-[19px] text-[${color}]`}>
        {text}
      </p>
    </div>
  )
}

export default Statistics