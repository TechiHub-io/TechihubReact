// src/components/homepage/embla/JourneyStepIcon.js
'use client';

import Image from 'next/image';
import React from 'react';

const JourneyStepIcon = ({ url, numb, lines, myclass }) => {
  return (
    <section className='main_embla_section'>
      <div className='flex flex-col gap-[8px] items-center z-[2]'>
        <div className="self-stretch flex flex-row items-start justify-center py-0 px-5 relative z-10">
          <Image
            className="lines_image relative"
            loading="lazy"
            width={162}
            height={162}
            alt={`Step ${numb}`}
            src={url}
          />
          <h2 className='flex items-center z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[#fff] font-bold text-[96px]'>
            {numb}
          </h2>
        </div>   
      </div>
      <Image
        className={myclass}
        src={lines}
        alt=''
        width={249}
        height={30}
      />
    </section>    
  );
};

export default JourneyStepIcon;