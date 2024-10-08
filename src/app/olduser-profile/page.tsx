'use client'
import Bgbutton from "@/(components)/shared/Bgbutton";
import { Skeleton } from "@/(components)/ui/skeleton";
import { Swrgetdat } from "@/libs/hooks/Swrgetdat";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const {data: session} = useSession();
  
  // @ts-ignore
  const url = `/api/user-profile/${session?.user?.userId}`;
  const { data, error, isLoading } = Swrgetdat(url);
  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  function convertDateToMonthYear(dateString: string) {
      const date = new Date(dateString);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${month} ${year}`;
  }

  function formatDateRange(startDate: string, endDate: string) {
      const startMonthYear = convertDateToMonthYear(startDate);
      const endMonthYear = convertDateToMonthYear(endDate);
      return `${startMonthYear} - ${endMonthYear}`;
  }

  interface experienceData {
    company: string,
    title: string,
    startDate: string,
    endDate: string,
    workSummary: string
  }
  return (
    <main>
      <div className="max-w-[1440px] w-[90%] mx-auto flex flex-col gap-[42px] lg:gap-[64px]">
        <figure className="flex flex-col gap-[42px]">
          <Image
            src="/images/dashboard/avator.svg"
            alt="avator"
            className="rounded-full w-[232px]"
            width={232}
            height={232}
          />
          <figcaption className="flex flex-col max-w-[200px] items-center gap-[8px]">
            <p className="text-[24px] font-medium">{data.userProfile.username}</p>
            <p className="text-[16px] font-medium">{data.userProfile.role_name}</p>
          </figcaption>
        </figure>
        <div className="flex flex-col gap-[24px]">
          <p className="text-[24px] font-medium">Top skills</p>
          <p className="text-[16px] font-medium">
            Figma Ux/ui Prototyping Visual Design
          </p>
        </div>
        <section className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col gap-[24px]">
            <p className="text-[24px] font-medium">Bio </p>
            <p className="text-[16px] font-medium max-w-[630px]">
              {data.userProfile.about}
            </p>
          </div>
          <div className="border-[2px] border-[#0CCE68] flex flex-col rounded-[8px] max-w-[501px] w-full px-[16px] py-[32px]">
            <h4 className="text-[18px] font-medium">Job Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <Image
                  width={32}
                  height={32}
                  src="/images/userprofile/timer.svg"
                  alt="icon"
                />
                <p className="text-[#767F8C] font-normal text-[15px]">
                  EXPERIENCE
                </p>
                <p className=" text-[#18191C] font-medium text-[14px]">
                  5 years
                </p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <Image
                  width={32}
                  height={32}
                  src="/images/userprofile/stack.svg"
                  alt="icon"
                />
                <p className="text-[#767F8C] font-normal text-[15px]">
                  Job Level:
                </p>
                <p className=" text-[#18191C] font-medium text-[14px]">
                  Senior
                </p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <Image
                  width={32}
                  height={32}
                  src="/images/userprofile/timer.svg"
                  alt="icon"
                />
                <p className="text-[#767F8C] font-normal text-[15px]">
                  Salary Expectation
                </p>
                <p className=" text-[#18191C] font-medium text-[14px]">
                  $50,000
                </p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <Image
                  width={32}
                  height={32}
                  src="/images/userprofile/timer.svg"
                  alt="icon"
                />
                <p className="text-[#767F8C] font-normal text-[15px]">
                  Education
                </p>
                {
                  data.userProfile.educations.map((dat: any) => (
                    <p className=" text-[#18191C] py-3 font-medium text-[14px]">
                      
                      {dat.course}
                      <br />
                      {dat.school_name}
                      <br />
                      {dat.startDate}
                      <br />
                      {dat.endDate}
                      <br />
                      {dat.summary}
                    </p>
                  ))
                }
                
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col md:flex-row gap-[32px] justify-between">
          <div className="flex flex-col gap-[42px] w-full max-w-[632px]">
            <div className="flex justify-between w-full items-center">
              <p className="text-[24px] font-medium">Experience</p>
              <div className="flex gap-[8px]">
                <Image
                  width={30}
                  height={30}
                  src="/images/userprofile/timer.svg"
                  alt="icon"
                />
                <Image
                  width={20}
                  height={20}
                  src="/images/userprofile/edit.svg"
                  alt="icon"
                />
              </div>
            </div>
            <div>
              {
                data.userProfile.experiences.map((dat : experienceData) => (
                  <div className="self-stretch flex flex-row flex-wrap items-center justify-center px-[16px] py-[29px] border-[0.8px] border-[#18191C] border-opacity-[0.2] shadow-md rounded-[7px] max-w-[632px] gap-[12px] w-full text-base">
                    <div className="rounded bg-ghostwhite flex flex-row items-start justify-start ">
                      <img
                        className="h-[99px] w-[99px] relative overflow-hidden shrink-0"
                        loading="lazy"
                        alt=""
                        src="/images/jobs/com.svg"
                      />
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-start gap-[4px] max-w-[738px] md:max-w-full">
                      <div className=" relative leading-[24px] font-medium">
                        {dat.title}
                      </div>
                      <div className=" relative text-[16px] font-medium">
                        {dat.company}
                      </div>
                      <div className="flex-1 relative leading-[20px] inline-block text-[12px] !text-[#18191C] max-w-[calc(100%_-_22px)]">
                        {formatDateRange(dat.startDate, dat.endDate)}
                      </div>
                      <div className="self-stretch flex flex-row items-center justify-start gap-[4px] max-w-full text-sm text-slategray">
                        <img
                          className="h-[18px] w-[18px] relative"
                          loading="lazy"
                          alt=""
                          src="/images/jobs/locat.svg"
                        />
                        <div className="flex-1 relative leading-[20px] inline-block text-[12px] !text-[#18191C] max-w-[calc(100%_-_22px)]">
                          Nairobi Kenya
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
              
            </div>
          </div>
          <div className="max-w-[501px] w-full">
            <Bgbutton link="/settings" text="Edit Profile" btntype="withborder" />
            {/* <div className="flex flex-col max-w-[337px] gap-[24px] w-full h-[217px] justify-center items-center rounded-md bg-[#C6D4ED] border-[2px] border-dashed border-[#0CCE68]">
              <Image
                width={30}
                height={30}
                src="/images/userprofile/download.svg"
                alt="icon"
              />
              <p className="text-[#000] text-[16px] font-semibold">
                Download Resume
              </p>
              <Bgbutton link="/" text="Download" btntype="withborder" />
            </div> */}
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default UserProfile;
