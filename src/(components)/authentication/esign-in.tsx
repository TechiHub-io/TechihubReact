'use client'
import React from 'react';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ESigninschema } from '@/libs/forms/PostSchema';

type Inputs = z.infer<typeof ESigninschema>
const Signin = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>({
    resolver: zodResolver(ESigninschema)
  })
  const onSubmit = (data: Inputs) => console.log("sign up form data", data)


  return (
    <main>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6'  onSubmit={handleSubmit(onSubmit)}  method='POST'>
         
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Company Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  {...register('name')}
                  type='text'
                  autoComplete='name'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                {errors.name?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.name.message}
                    </p>
                  )}
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
                  {...register('password')}
                  type='password'
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                {
                  errors?.password?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.password.message}
                    </p>
                  )
                }
              </div>
            </div>
            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Sign in
              </button>
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

export default Signin;
