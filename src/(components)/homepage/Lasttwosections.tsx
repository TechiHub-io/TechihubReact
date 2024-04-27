import React from 'react'
import Bgbutton from '../shared/Bgbutton';

interface LasttwosectionsProps {
  title: string;
  des: string;
  link: string;
  text: string;
  btntype: string;
}
function Lasttwosections({title, des, link, text, btntype}: LasttwosectionsProps) {
  return (
    <div className='flex flex-col gap-[32px] items-center text-center pt-[40px] lg:pt-[77px] w-[90%] mx-auto'>
      <h3 className='max-w-[866px] mx-auto'>
        {title}
      </h3>
      <p className='max-w-[757px] mx-auto text-center'>
        {des}
      </p>
      <Bgbutton link={link} text={text} btntype={btntype} />
    </div>
  )
}

export default Lasttwosections