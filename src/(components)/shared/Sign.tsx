
import React from 'react';
import { signIn, auth } from '../../../auth';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const Sign =  () => {
  const { data: session } = useSession();
  console.log("this is the sesion", session?.user);
  return (
    <div>
      {
        !session?.user ? <>
        <div className='flex flex-col items-start justify-start pt-2.5 px-0 pb-0'>
          {/* <button onClick={() => signIn("credentials")}>Sign In</button> */}
        <Link
          href='/api/auth/signin?callbackUrl=/'
          className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[54px] whitespace-nowrap hover:underline'
        >
          Sign in
        </Link>
      </div>
      <div className='flex-1 rounded-8xs flex flex-row items-start justify-start py-2.5 px-[23px] border-[2px] border-solid border-[#0CCE68]'>
        <Link
          href='/api/auth/signup'
          className='relative tracking-[0.25px] leading-[27px] font-medium inline-block min-w-[69px] whitespace-nowrap hover:underline'
        >
          sign up
        </Link>
      </div>
        </> : <button onClick={() => signOut()}>Signout</button>
      }
      
    </div>
  );
};

export default Sign;
