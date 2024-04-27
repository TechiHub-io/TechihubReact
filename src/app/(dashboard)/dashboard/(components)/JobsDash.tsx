import { FunctionComponent } from "react";
import { Jobsprops } from "@/libs/types/Jobstypes";
import Bgbutton from "@/(components)/shared/Bgbutton";

const JobDash: FunctionComponent<Jobsprops> = ({ id, title, location, salary, companyName, jobType, employer }) => {
  return (
    <div className="self-stretch rounded-lg [background:linear-gradient(90deg,_rgba(4,_159,_217,_0.5),_rgba(255,_255,_255,_0.5)),_#fff] shadow-[0px_2px_18px_rgba(24,_25,_28,_0.03)] box-border flex flex-col items-start justify-start py-6 px-[23px] gap-[20px] max-w-full text-left text-lg text-[#18191C] border-[1px] border-solid border-[#E4E5E8]">
      <div className="self-stretch flex flex-col md:flex-row items-start justify-evenly max-w-full gap-[20px]">
        <div className="w-[349px] flex flex-col items-start justify-start gap-[6px] max-w-full">
          <div className="self-stretch relative leading-[28px] font-medium text-[18px]">
            {title}
          </div>
          <div className="flex flex-col md:flex-row md:items-center items-start justify-start gap-[7px] ">
            <div className="rounded-10xs bg-honeydew flex flex-row items-start justify-start py-1 px-2">
              <div className="relative leading-[120%] uppercase font-semibold inline-block min-w-[66px] text-[18px] text-[#364187]">
                {jobType}
              </div>
            </div>
            <div className="relative leading-[20px] font-poppins text-[#767F8C] text-[14px]">
              Salary: {salary}
            </div>
          </div>
        </div>
        <p className="text-[16px] text-[#000] opacity-50 font-thin">
          27/03/2023
        </p>
        <p className="text-[16px] text-[#0CCE68] opacity-50 font-thin">
          Active
        </p>
        <div className="flex flex-col items-start justify-start pt-[3px] px-0 pb-0">
          <Bgbutton  btntype="withborder" text="View Details" link={`/jobs/${id}`}/>
        </div>
      </div>
      <div className="self-stretch flex flex-row flex-wrap items-center justify-center gap-[12px] max-w-full text-base">
        <div className="rounded bg-ghostwhite flex flex-row items-start justify-start p-3">
          <img
            className="h-6 w-6 relative overflow-hidden shrink-0"
            loading="lazy"
            alt=""
            src="/images/jobs/com.svg"
          />
        </div>
        <div className="flex-1 flex flex-col items-start justify-start gap-[4px] max-w-[738px] md:max-w-full">
          <div className=" relative leading-[24px] font-medium">
            {companyName}
          </div>
          <div className="self-stretch flex flex-row items-center justify-start gap-[4px] max-w-full text-sm text-slategray">
            <img
              className="h-[18px] w-[18px] relative"
              loading="lazy"
              alt=""
              src="/images/jobs/locat.svg"
            />
            <div className="flex-1 relative leading-[20px] inline-block max-w-[calc(100%_-_22px)]">
              {location}
            </div>
          </div>
        </div>
        <img
          className="h-6 w-6 relative"
          loading="lazy"
          alt=""
          src="/images/jobs/book.svg"
        />
      </div>
    </div>
  );
};

export default JobDash;
