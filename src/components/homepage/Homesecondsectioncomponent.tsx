import React from 'react'

interface HomesecondsectioncomponentProps {
  readonly title: string;
  readonly des: string;
}

function Homesecondsectioncomponent({title, des}: HomesecondsectioncomponentProps) {
  return (
    <div
      className=" bg-[#F1FFF4] max-w-[535px] !m-[0] flex flex-col items-start justify-start pt-[30.4px] px-[33.6px] max-[375px]:min-h-[350px] min-h-[315px] rounded-md box-border gap-[51.8px]  text-left text-5xl text-gray-900 font-poppins"
    >
      <h3 className="relative leading-[120%]">
        {title}
      </h3>
      <p className="max-w-[455.2px] relative inline-block ">
        {des}
      </p>
    </div>
  )
}

export default Homesecondsectioncomponent