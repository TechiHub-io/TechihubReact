import React from "react"; 

const Jorneystep = ({
  title,
  des,
}) => {


  return (
    <div className="w-[400px] md:w-[408.4px] shrink-0 flex flex-col items-start justify-start p-[27px] box-border gap-[9px] max-w-full text-left text-13xl text-black font-heading-2">
      <div
        className="self-stretch flex flex-row items-start justify-center py-0 px-5"
      >
        <h2 className="m-0 relative text-[24px] leading-[125%] font-semibold text-center">
          {title}
        </h2>
      </div>
      <div className="self-stretch relative text-[18px] leading-[180%] font-body text-center max-[1113px]:max-w-[340px]">
        {des}
      </div>
    </div>
  );
};

export default Jorneystep;
