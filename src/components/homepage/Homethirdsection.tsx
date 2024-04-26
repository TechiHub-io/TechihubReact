import React from 'react';
import Homethirdsectioncomponent from './Homethirdsectioncomponent';

const data = [
  {
    id: 1,
    rating: "⭐⭐⭐⭐⭐",
    name: "Leslie Alexander",
    avator: "/images/homepage/avator.svg",
    role: "Freelance React Developer",
    des: '“You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change.”'
  },
  {
    id: 2,
    rating: "⭐⭐⭐⭐⭐",
    name: "Jacob Jones",
    avator: "/images/homepage/avator.svg",
    role: "Digital Marketer",
    des: '“Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.”'
  },
  {
    id: 3,
    rating: "⭐⭐⭐⭐⭐",
    name: "Jenny Wilson",
    avator: "/images/homepage/avator.svg",
    role: "Graphic Designer",
    des: '“I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish.”'
  },
]

interface homeprops {
  readonly title: string;
}

function Homethirdsection({title}: homeprops) {
  return (
    <div className='max-w-[1330px] w-[90%] mx-auto flex flex-col items-center justify-start py-0 pr-0 box-border gap-[32px] text-left pt-[49px]'>
      <div className='max-w-[1172px] flex flex-row items-center justify-center py-0 px-5 box-border'>
        <h2 className='m-0 relative '>
          {title}
        </h2>
      </div>
      <div className='self-stretch flex flex-row items-center justify-center max-w-full gap-[20px] relative'>
        <div className='hidden lg:block w-full h-full absolute max-w-[762px] mx-auto [background:linear-gradient(90deg,_rgba(12,_206,_104,_0.3),_rgba(136,_255,_153,_0.3)_25%,_rgba(0,_16,_41,_0.3)_50%,_rgba(133,_196,_255,_0.3)_75%,_rgba(136,_255,_153,_0.3))]' />
        <div className='!m-[0] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[40px] items-end justify-center py-[39px]'>
          {
            data.map((dat) => (
              <Homethirdsectioncomponent
              key={dat.id}
              rating={dat.rating}
              name={dat.name}
              avator={dat.avator}
              role={dat.role}
              des={dat.des}
            />
            ))
          }
          
        </div>
      </div>
      <div className='self-stretch flex flex-row items-center justify-center max-w-full gap-[20px] relative'>
        <div className='hidden lg:block w-full h-full absolute max-w-[762px] mx-auto [background:linear-gradient(90deg,_rgba(12,_206,_104,_0.3),_rgba(136,_255,_153,_0.3)_25%,_rgba(0,_16,_41,_0.3)_50%,_rgba(133,_196,_255,_0.3)_75%,_rgba(136,_255,_153,_0.3))]' />
        <div className='!m-[0] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[40px] items-end justify-center py-[39px]'>
          {
            data.map((dat) => (
              <Homethirdsectioncomponent
              key={dat.id}
              rating={dat.rating}
              name={dat.name}
              avator={dat.avator}
              role={dat.role}
              des={dat.des}
            />
            ))
          }
          
        </div>
      </div>
    </div>
  );
}

export default Homethirdsection;
