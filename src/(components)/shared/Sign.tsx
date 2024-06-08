
import React from 'react';
import { signIn, auth } from '../../../auth';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const Sign =  () => {
  const { data: session } = useSession();
  
  return (
    <div className='flex gap-[32px]'>
      {
        !session?.user ? <>
        <div className='flex-1 rounded-8xs flex flex-row items-start justify-start py-2.5 px-[23px]'>
          {/* <button onClick={() => signIn("credentials")}>Sign In</button> */}
        <Link
          href='/api/auth/signin?callbackUrl=/dashboard'
          className='relative tracking-[0.25px] leading-[27px] inline-block min-w-[54px] whitespace-nowrap hover:underline'
        >
          Sign in
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
        </> : <button onClick={() => signOut()}>Signout</button>
      }
      
    </div>
  );
};

export default Sign;

// removed callback ?callbackUrl=/