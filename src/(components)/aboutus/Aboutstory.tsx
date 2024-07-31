"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const cards = [
  { id: 1, src: "/images/aboutus/card1.svg", alt: "No Poverty" },
  { id: 5, src: "/images/aboutus/card2.svg", alt: "Gender Equality" },
  { id: 10, src: "/images/aboutus/card3.svg", alt: "Reduced Inequalities" },
  {
    id: 9,
    src: "/images/aboutus/card4.svg",
    alt: "Industry, Innovation and Infrastructure",
  },
  {
    id: 8,
    src: "/images/aboutus/card5.svg",
    alt: "Decent Work and Economic Growth",
  },
];

function Aboutstory() {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition + 1) % cards.length);
    }, 3000); // Change card every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h2 className="text-center lg:text-left pb-[25px]">Our story</h2>
      <div className=" flex flex-col items-center lg:flex-row gap-[35px] lg:gap-[70px] lg:items-start">
        <div className="flex flex-col items-center gap-[40px] max-w-[650px]">
          <Image
            src="/images/aboutus/image1.svg"
            alt="about us"
            className="block lg:hidden"
            width={536}
            height={339}
          />
          <p className="text-center lg:text-left">
            In August 2022, Techihub journey began when a group of young,
            passionate, and visionary minds and fueled by a shared belief in the
            untapped potential of Africa's tech talent came together and set out
            on a mission to transform the continent into a thriving hub of
            technological innovation.
            <br />
            <br />
            Africa presented the opportunity with its world's largest young
            workforce (Median age of 19). Beyond jobs, Techihub catalyzes
            innovation, empowerment, and economic advancement in Africa, shaping
            the tech revolution's future.
          </p>
          <div className="flex gap-[32px]">
            <div className="flex flex-col justify-around">
              <p className="text-[#fff] bg-[#0CCE68] px-[15px] py-[20px] items-start rounded-full flex justify-center">
                2022
              </p>
              <hr className="border-[#0CCE68] border-[2px] rotate-90 " />
            </div>
            <div className="flex flex-col gap-[25px] max-w-[551px]">
              <h3 className="text-left">Inception</h3>
              <p className="text-left">
                Two young innovators fueled by a shared belief in the untapped
                potential of Africa's tech talent set out on a mission to
                transform the continent into a thriving hub of innovation.
              </p>
            </div>
          </div>
          <div className="flex gap-[32px]">
            <div className="flex flex-col justify-around">
              <p className="text-[#fff] bg-[#0CCE68] px-[15px] py-[20px] items-start rounded-full flex justify-center">
                2023
              </p>
              <hr className="border-[#0CCE68] border-[2px] rotate-90 " />
            </div>
            <div className="flex flex-col gap-[25px] max-w-[551px]">
              <h3 className="text-left">Re-branding</h3>
              <p className=":text-left">
                In August 2023, Techily re-branded to Techihub with technology
                innovation to solve global gap for tech talent merging
                technology, AI and Talent Community.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[32px]">
          <Image
            src="/images/aboutus/image1.svg"
            alt="about us"
            className="hidden lg:block"
            width={536}
            height={339}
          />
          <div className="overflow-hidden hidden lg:block w-full">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${position * 50}%)` }}
            >
              {[...cards, ...cards].map((card, index) => (
                <div key={index} className="flex-shrink-0 w-1/2 p-2">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={116}
                    height={116}
                    className="w-full h-auto object-fill"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutstory;
