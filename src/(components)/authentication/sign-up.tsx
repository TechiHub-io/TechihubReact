'use client'
import { signUserUp, signUserUpEmployee } from '@/app/action';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';

const initialState = {
  message: ""
}

function SignUpButton(){
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      aria-disabled={pending}
      className='flex w-full justify-center rounded-md bg-[#0CCE68] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >{pending ? 'Loading' : 'Sign up'}
    </button>
  )
}

const Signup = () => {
  // const onSubmit =
  const [state, handleSubmit] = useFormState(signUserUp, initialState)
  const [stateemployee, handleSubmitEmployee] = useFormState(signUserUpEmployee, initialState)

  return (
    <main className='flex flex-col lg:flex-row gap-[32px] lg:gap-0 lg:justify-between max-w-[1440px] mx-auto w-[90%]'>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-[32px] font-medium leading-9 tracking-tight text-black'>
            Sign up to your account as Candidate
          </h2>
        </div>
        <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {state?.message}
        </p>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' action={handleSubmit} >
       
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
                    href='#'
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
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Confirm Password
              </label>
              <div className='mt-2'>
                <input
                  id='confirmPassword'
                  type='password'
                  name='confirmPassword'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <SignUpButton />
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            <input
              type='checkbox'
              id="terms"
              name="terms"
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
            />
            <label htmlFor="terms">I agree to the terms & policy</label>
          </p>
        </div>
      </div>

      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-[32px] font-medium leading-9 tracking-tight text-black'>
            Sign up to your account As Employee
          </h2>
        </div>
        <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {stateemployee?.message}
        </p>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' action={handleSubmitEmployee} >
       
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
                    href='#'
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
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Confirm Password
              </label>
              <div className='mt-2'>
                <input
                  id='confirmPassword'
                  type='password'
                  name='confirmPassword'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <SignUpButton />
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            <input
              type='checkbox'
              id="terms"
              name="terms"
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
            />
            <label htmlFor="terms">I agree to the terms & policy</label>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
