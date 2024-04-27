import Image from 'next/image';
import React from 'react';

interface HomethirdsectioncomponentProps {
  readonly rating: string;
  readonly name: string;
  readonly role: string;
  readonly des: string;
  readonly avator: string;
}
function Homethirdsectioncomponent({rating, name, role, des, avator}: HomethirdsectioncomponentProps) {
  return (
    <div
      className='max-w-[382px] min-h-[310px] bg-white shadow-[0px_42.4px_61.31px_rgba(0,_0,_0,_0.08)] flex flex-col items-start justify-start pt-7 pb-[30px] pr-7 pl-[29px] box-border gap-[56px] z-[1] text-left '
    >
      <div className='self-stretch flex flex-col items-start justify-start gap-[34px]'>
        <p
          className='w-24 h-4 relative z-[1]'
        >
          {rating}
        </p>
        <p className='self-stretch relative'>
          {des}
        </p>
      </div>
      <div className='flex flex-row items-end justify-start gap-[16px] text-base'>
        <div className='flex flex-col items-start justify-end pt-0 px-0 pb-[3px]'>
          <Image
            className='w-[43px] h-[43px] relative rounded-[50%] object-cover z-[1]'
            loading='lazy'
            width={43}
            height={43}
            alt={name}
            src={avator}
          />
        </div>
        <div className='flex flex-col items-start justify-start gap-[2px]'>
          <b
            className='relative'
          >
            {name}
          </b>
          <p
            className='relative text-gray-600 inline-block min-w-[105px]'
          >
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homethirdsectioncomponent;
