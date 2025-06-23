// src/components/homepage/embla/JourneyStepContent.js

'use client';

import React from 'react';

const JourneyStepContent = ({ title, des }) => {
  return (
    <div className="elementembla !w-[300px] md:w-[408.4px] md:min-w-[400px] shrink-0 flex flex-col items-start justify-start p-[27px] box-border gap-[9px] max-w-full text-left text-13xl text-black font-heading-2">
      <div className="elementembla_div self-stretch flex flex-row items-start justify-center py-0 px-5">
        <h2 className="!min-h-[72px] relative text-[24px] leading-[125%] font-semibold text-center">
          {title}
        </h2>
      </div>
      <div className="self-stretch relative text-[18px] leading-[180%] font-body text-center max-[1113px]:max-w-[340px]">
        {des}
      </div>
    </div>
  );
};

export default JourneyStepContent;