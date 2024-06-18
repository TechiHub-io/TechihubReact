'use client'
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ResetPasswordsetup } from "../action";
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
    >{pending ? 'Loading' : 'Reset Password'}
    </button>
  )
}

const ResetPassword = () => {
  const [state, handleSubmit] = useFormState(ResetPasswordsetup, initialState);
  return (
    <main>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-[32px] font-medium leading-9 tracking-tight text-black">
            Reset your password
          </h2>
        </div>
        <p
          aria-live="polite"
          className=" text-[#ff0000] text-center text-[16px]"
          role="status"
        >
          {state?.message}
        </p>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={handleSubmit}>
          <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Token Shared in Email
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="resetToken"
                  type="string"
                  name="resetToken"
                  autoComplete="resetToken"
                  required
                  placeholder="add token shared in your email 8 number code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <SignUpButton />
            </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            />
            <label htmlFor="terms">I agree to the terms & policy</label>
          </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
