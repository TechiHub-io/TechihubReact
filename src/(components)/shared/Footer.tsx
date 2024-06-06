import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="self-stretch bg-[#364187] flex flex-col items-start justify-start pt-[39.5px] mt-[40px] lg:mt-[77px]  pb-16 box-border gap-[70.2px] max-w-full text-left text-[#afb3cf] font-poppins">
      <div className="max-w-[1440px]  relative w-[90%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center lg:place-items-start justify-center lg:justify-start max-w-full text-center lg:text-left gap-[1rem] md:gap-0">
        <div className="h-[149.8px] w-[234.8px] flex flex-col items-center lg:items-start justify-start pt-[7.7px] px-0 pb-0 box-border">
          <Image
            className="flex-1 relative max-h-full z-[1]"
            loading="lazy"
            alt="logo"
            width={179}
            height={143}
            src="/images/shared/footerlogoa.svg"
          />
        </div>
        <div className="w-[230.6px] flex flex-col  items-center lg:items-start justify-center lg:justify-start pt-[7.7px] px-0 pb-0 box-border">
          <div className="self-stretch flex flex-col items-center lg:items-start justify-center lg:justify-start gap-[9.9px]">
            <div className="w-[171.5px] flex flex-row items-center lg:items-start justify-start py-0 pr-0.5 pl-[1.8px] box-border lg:text-left text-white">
              <h5 className="h-[33.2px] flex-1 relative leading-[150%] capitalize font-semibold inline-block shrink-0 z-[1] text-[20px]">
                Quick links
              </h5>
            </div>
            <div className="w-[136.5px] flex flex-row items-start justify-start py-0 pr-0.5 box-border">
              <Link href="about-us" className="h-[29.5px] flex-1 relative leading-[150%] inline-block shrink-0 z-[1] text-[16px]">
                About Us
              </Link>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0">
              <Link href="why" className="h-[29.5px] flex-1 relative leading-[150%] inline-block z-[1] text-[16px]">
                Why Choose us
              </Link>
            </div>
            <div className="w-[171.6px] flex flex-col items-center lg:items-start justify-start gap-[14.8px]">
              <div className="self-stretch flex flex-col items-center lg:items-start justify-start gap-[9.8px]">
                <Link href="pricing" className="w-[99.7px] h-[29.5px] relative leading-[150%] inline-block shrink-0 z-[1] text-[16px]">
                  Pricing
                </Link>
                <Link href="testimonial" className="self-stretch h-[29.5px] relative leading-[150%] inline-block shrink-0 z-[1] text-[16px]">
                  Testimonial
                </Link>
              </div>
              <div className="w-[125.5px] flex flex-row items-center lg:items-start justify-center lg:justify-start py-0 px-0.5 box-border">
                <Link href="/community" className="h-[29.5px] flex-1 relative leading-[150%] inline-block z-[1] text-[16px]">
                  Community
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[264px] flex flex-col items-center lg:items-start justify-start pt-[7.7px] pb-0 pl-0 box-border text-mini-4">
          <div className="self-stretch flex flex-col items-center lg:items-start justify-start gap-[9.8px]">
            <div className="w-[129.7px] flex flex-row items-start justify-start py-0 pr-px pl-[1.4px] box-border text-xl text-white">
              <h5 className="h-[33.2px] flex-1 relative leading-[150%] capitalize font-semibold inline-block z-[1] text-[20px]">
                Resources
              </h5>
            </div>
            <div className="w-[151.6px] flex flex-row items-start justify-start py-0 pr-px pl-[1.4px] box-border">
              <Link href="/privacy" className="h-[29.5px] flex-1 relative leading-[150%] inline-block z-[1] text-[16px]">
                Privacy Policy
              </Link>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[1.4px]">
              <Link href="/terms" className="h-[29.5px] flex-1 relative leading-[150%] inline-block z-[1] text-[16px]">
                Terms and Condition
              </Link>
            </div>
            <Link href="/blog" className="w-[47.8px] h-[29.5px] relative leading-[150%] inline-block shrink-0 z-[1] text-[16px]">
              Blog
            </Link>
            <Link href="/contact" className="w-[121.5px] h-[29.5px] relative leading-[150%] inline-block shrink-0 z-[1] text-[16px]">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="w-96 flex flex-col items-center lg:items-start justify-start gap-[41px] max-w-full text-22xl-3 text-white">
          <div className="self-stretch flex flex-col items-center lg:items-start justify-start gap-[16px] shrink-0">
            <div className="w-[315.2px] flex flex-row items-start justify-start py-0 pr-1 pl-[3.9px] box-border">
              <h3 className="flex-1 relative tracking-[0.45px] leading-[49.4px] shrink-0 [debug_commit:f6aba90] z-[1] text-[#fff]">
                Techihub
              </h3>
            </div>
            <div className="self-stretch flex flex-col items-center lg:items-start justify-start gap-[16px] ">
              <p className="w-[297.9px] h-[33.2px] relative leading-[150%] font-semibold inline-block shrink-0 z-[1] text-[#fff]">
                Subscribe to our Newsletter
              </p>
              <form className="self-stretch rounded-[7.19px] bg-[#0CCE68] flex flex-col items-center justify-center pt-[7.9px] pb-[8.2px] pr-[0.1px] box-border gap-[10.4px] max-w-full z-[1] text-base text-[#000]">
                <div className="w-[80%] flex flex-col items-start justify-start pt-[11.8px] px-0 pb-0 ">
                  <input type='text' placeholder='Enter your Email' className="self-stretch py-[24.4px] px-[35.9px] h-[29.5px] relative leading-[150%] inline-block  z-[1] text-[16px] p-3 rounded-md" />
                </div>
                <div className="flex-1 max-w-[160px] rounded-[10.79px] bg-white flex flex-row items-start justify-start py-[14.4px] px-[35.9px] box-border min-w-[72px] z-[1] text-gray1-100 font-roboto">
                  <button type='button' className="relative leading-[150%] font-medium inline-block min-w-[72px] text-[16px] text-[#1D2130] cursor-pointer hover:">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="w-[249px] flex flex-row items-start justify-start py-0 px-1 box-border">
            <div className="flex-1 flex flex-row items-start justify-between opacity-[0.5] z-[1]">
              <Image
                className="relative overflow-hidden cursor-pointer"
                loading="lazy"
                alt="facebook"
                width={32}
                height={35}
                src="/images/shared/Facebook.svg"
              />
              <Image
                className="relative overflow-hidden cursor-pointer"
                loading="lazy"
                alt="twitter"
                width={33}
                height={35}
                src="/images/shared/Twitter.svg"
              />
              <Image
                className="relative overflow-hidden cursor-pointer"
                loading="lazy"
                alt="instagram"
                width={33}
                height={35}
                src="/images/shared/Instagram.svg"
              />
              <Image
                className="relative overflow-hidden cursor-pointer"
                loading="lazy"
                alt="logo"
                width={33}
                height={35}
                src="/images/shared/LinkedIn.svg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-center py-0 pr-0 text-xl text-white pt-[40px] lg:pt-[70px]">
        <div className="w-[284px] relative leading-[150%] inline-block shrink-0 z-[1]">
          Copyright @2024 Techihub
        </div>
      </div>
      </div>
    </footer>
  )
}

export default Footer
