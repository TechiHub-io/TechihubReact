import Image from "next/image";
import React from "react";
import Bgbutton from "../shared/Bgbutton";
const data =[
  {
    id: 1,
    title: "Data Community",
    img: "/images/community/icon1.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  },
  {
    id: 2,
    title: "UX/UI Design",
    img: "/images/community/icon2.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  },
  {
    id: 3,
    title: "Women in Tech ",
    img: "/images/community/icon3.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  },
  {
    id: 4,
    title: "Devs under 20",
    img: "/images/community/icon4.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  },
  {
    id: 5,
    title: "IT Support & Devops",
    img: "/images/community/icon5.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  },
  {
    id: 6,
    title: "Product Developers",
    img: "/images/community/icon6.svg",
    des: "Techiehub talent sourcing services offer a seamless journey, from identifying your hiring needs",
    link: "",
    text: "Join Community"
  }
]
const CommunitySec = () => {
  return (
    <main>
      <div className="w-[90%] mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[32px]">
          <h2 className="text-center" >Communities</h2>
          <div className="flex justify-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-[40px]">
              <button className="withborder">
                Popular
              </button>
              <select name="" id="" className="withborder bg-[#88FF99] text-[#000]">
                <option value="">All categories</option>
                <option value="">Women in Tech</option>
              </select>
            </div>            
          </div>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-center place-items-center gap-[42px]">
            {
              data.map((dat) => (
                <div key={dat.id} className="max-w-[398px] flex flex-col bg-[#E7FAF0] p-[16px] justify-around items-center  gap-[25px] shadow-[8px_8px_16px_rgba(0,_0,_0,_0.1)] rounded-[12px] max-h-[525px] min-w-[300px] h-[450px]">
                  <h3 className="text-center">
                    {dat.title}
                  </h3>
                  <Image src={dat.img} alt={dat.title} width={112} height={108} className="w-[112] h-[108]" />
                  <p className="text-center">
                    {dat.des}
                  </p>
                  <Bgbutton link={dat.link} text={dat.text} btntype="withborder" />
                </div>
              ))
            }
          </section>
        </div>
      </div>
    </main>
  );
};

export default CommunitySec;
