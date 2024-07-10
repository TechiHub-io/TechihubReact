'use client'
import React, {useEffect} from 'react';
import { z } from 'zod';
import { SignInHandler } from '@/app/action';
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';
const initialState = {
  message: "",
  error: undefined,
  url: undefined
}
// async (formData) => {
//   'use server';
//   await signIn('credentials', formData);
// }

function SignInButton(){
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      aria-disabled={pending}
      className='flex w-full justify-center rounded-md bg-[#0CCE68] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >{pending ? 'Loading' : 'Login'}
    </button>
  )
}
const Signin = () => {
  const [state, handleSignin] = useFormState(SignInHandler, initialState);
 
  useEffect(() => {
    if (state.message === "Success signin") {
      // Perform a hard refresh
      window.location.href = '/dashboard';
    }
  }, [state]);
  

  return (
    <main className='flex flex-col gap-[32px] lg:gap-0 lg:justify-between max-w-[1440px] mx-auto w-[90%]'>
      <img src="/images/blogs/logoa.jpg" className='mx-auto w-[100px] lg:w-[200px] ' alt="" />
      <div className='flex max-w-[1330px] mx-auto gap-[32px]'>
        <div className='flex min-h-full flex-col justify-center lg:justify-start px-6 py-12 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <h2 className='mt-10 text-left text-[32px] font-medium leading-9 tracking-tight text-black'>
              Welcome back!
            </h2>
            <p>
              Enter your Credentials to access your account
            </p>
          </div>
          {state.error && (
            <p aria-live='polite' className='text-[#ff0000] text-center text-[16px]' role='status'>
              {state.error}
            </p>
          )}
          {state.message && (
            <p aria-live='polite' className='text-[#00ff00] text-center text-[16px]' role='status'>
              {state.message}
            </p>
          )}
          <div className='mt-1 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form
              className='space-y-6'
              action={handleSignin}
              method='POST'
            >
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    autoComplete='email'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Password
                  </label>
                  <div className='text-sm'>
                    <a
                      href='/forgot-password'
                      className='font-semibold text-indigo-600 hover:text-indigo-500'
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    type='password'
                    name='password'
                    autoComplete='current-password'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
               <SignInButton />
              </div>
            
            </form>

            
          </div>
        </div>
        <img src="/images/blogs/signc.jpg" className='hidden lg:block w-[480px] xl:w-[500px] object-cover' alt="image" />
      </div>
      
    </main>
  );
};

export default Signin;
