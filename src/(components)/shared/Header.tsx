'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
// import { signIn } from '../../../auth';
import { signIn } from "next-auth/react"
import Sign from './Sign';
import { useSession } from 'next-auth/react';

function Header() {
  const [nav, setNav] = useState(false);
  const {data: session} = useSession();
  //@ts-ignore
  const employee = session?.user?.role
  const pathname=usePathname();
  const modalRef = useRef<HTMLUListElement>(null);
  const handleNav = () => {
    setNav(!nav);
  };
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     // If the modal is open and the click is outside the modal, close the modal
  //     if (
  //       nav &&
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       setNav(false);
  //     }
  //   }

  //   // Add event listener
  //   document.addEventListener('mousedown', handleClickOutside);

  //   // Remove event listener on cleanup
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [nav, setNav]);
  return (
    <header
      className={`${
        pathname === '/about-us'
          ? 'pt-[29px] px-0 pb-[62px] bg-[#364187]'
          : 'pt-[29px] px-0 pb-[62px]'
      }`}
    >
      <div className=' w-[90%] flex items-start mx-auto justify-between  box-border gap-[20px]  text-left z-40'>
        <Link href='/' className='block lg:hidden z-20'>
          <Image
            src='/images/shared/logoa.svg'
            width={62}
            height={45}
            alt='image'
          />
        </Link>
        <div className='w-full hidden lg:flex justify-between'>
          <Link href='/' className='hidden lg:block z-10'>
          {
            pathname === '/about-us' ? 
            <Image
              src='/images/homepage/whitelogo.svg'
              width={62}
              height={45}
              alt='image'
            />
            :
            <Image
              src='/images/shared/logoa.svg'
              width={62}
              height={45}
              alt='image'
            />
          }
            
          </Link>

          <nav className='m-0 hidden lg:flex items-start justify-center pt-2.5 px-0 pb-0 box-border max-w-full z-40'>
            <nav
              className={`${
                pathname === '/about-us'
                  ? 'm-0 lg:text-[#fff]  flex flex-row items-start justify-center gap-[24px] text-left text-lg font-poppins'
                  : 'm-0 text-[#000] flex flex-row items-start justify-center gap-[24px] text-left text-lg font-poppins'
              }`}
            >
              <Link
                href='/home'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[55px] hover:underline'
              >
                Home
              </Link>
              <Link
                href='/about-us'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[82px] whitespace-nowrap hover:underline'
              >
                About us
              </Link>
              <Link
                href='/our-services'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[115px] whitespace-nowrap hover:underline'
              >
                Our Services
              </Link>
              <Link
                href='/jobs'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[115px] whitespace-nowrap hover:underline'
              >
                Job board
              </Link>
              {
                employee !== "EMPLOYER" ? <>
                  <Link
                href='/dashboard'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[115px] whitespace-nowrap hover:underline'
              >
                
              </Link>
                </> : employee === "EMPLOYER" ? <>
                <Link
                href='/e-dashboard'
                className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[115px] whitespace-nowrap hover:underline'
              >
                Dashboard
              </Link>
                </> : ""
              }
            
            </nav>
          </nav>
          <div
            className={`${
              pathname === '/about-us'
                ? 'w-[207px] hidden lg:flex flex-row items-start justify-end gap-[33px] text-[#364187] lg:text-[#fff] z-20'
                : 'w-[207px] hidden lg:flex flex-row items-start justify-end gap-[33px] text-[#364187] z-20'
            }`}
          >
            <Sign />
          </div>
        </div>

        <nav>
          <button
            onClick={handleNav}
            className='lg:hidden right-[5%] relative border-none outline-none z-20'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='2.2em'
              height='2.2em'
              className={pathname === '/about-us' ? 'cursor-pointer text-[#fff] w-[2.2em] h-[2.2em]' : 'cursor-pointer'}
              viewBox='0 0 15 15'
            >
              <path
                fill='currentColor'
                fillRule='evenodd'
                d='M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5'
                clipRule='evenodd'
              />
            </svg>
          </button>
          <ul
            ref={modalRef}
            className={
              nav
                ? 'fixed lg:hidden left-0 top-0 w-[60%] h-full border-r bg-[#364187] p-[32px] text-[#fff] rounded-b-md ease-in-out duration-500 z-20 flex flex-col gap-[2rem]'
                : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] flex flex-col gap-[2rem] z-20'
            }
          >
            <hr />
            <li className='outline-none cursor-pointer hover:no-underline'>
              <Link
                href='/about-us'
                rel='noreferrer noopener'
                className='relative tracking-[-0.03em] leading-[120%] font-medium whitespace-nowrap py-4 hover:underline ease-in-out text-[18px]'
              >
                About us
              </Link>
            </li>
            <hr />
            <li className='outline-none cursor-pointer'>
              <Link
                href='/our-services'
                rel='noreferrer noopener'
                className='relative tracking-[-0.03em] leading-[120%] py-4 font-medium hover:underline ease-in-out text-[18px]'
              >
                Our Services
              </Link>
            </li>
            <hr />
            <li className='outline-none cursor-pointer'>
              <Link
                href='/jobs'
                rel='noreferrer noopener'
                className='relative tracking-[-0.03em] leading-[120%] py-4 font-medium hover:underline ease-in-out text-[18px]'
              >
                Job board
              </Link>
            </li>
            <hr />
            <div className='w-[207px] flex flex-col items-start justify-start gap-[2rem] text-[#fff] '>
              <div className='flex flex-col items-start justify-start pt-2.5 px-0 pb-0'>
                <Link
                  href='/api/auth/signin'
                  className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[54px] whitespace-nowrap hover:underline'
                >
                  Login in
                </Link>
              </div>
              <div className='flex-1 rounded-8xs flex flex-row items-start justify-start py-2.5 px-[23px] border-[2px] border-solid border-[#0CCE68]'>
                <Link
                  href='/sign-up'
                  className='relative tracking-[0.25px] leading-[27px] font-medium inline-block min-w-[69px] whitespace-nowrap hover:underline'
                >
                  sign up
                </Link>
              </div>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

// removed cllback ?callbackUrl=/