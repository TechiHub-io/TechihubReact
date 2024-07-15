'use client'
import React, { useState } from 'react';
import { signUserUpEmployee } from '@/app/action';
import { useFormStatus, useFormState } from 'react-dom';
import { Check, X } from 'lucide-react';

const initialState = {
  message: ""
}


type PasswordRequirement = {
  check: boolean;
  text: string;
};

type PasswordRequirementProps = {
  isMet: boolean;
  text: string;
};


type FormState = {
  message: string;
};

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      aria-disabled={pending}
      className='flex w-full justify-center rounded-md bg-[#0CCE68] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >
      {pending ? 'Loading' : 'Sign up'}
    </button>
  )
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ isMet, text }) => (
  <div className="flex items-center space-x-2">
    {isMet ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
    <span className={isMet ? "text-green-500" : "text-red-500"}>{text}</span>
  </div>
);

const Signup = () => {
  const [stateemployee, handleSubmitEmployee] = useFormState(signUserUpEmployee, initialState);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordRequirements = [
    { check: password.length >= 12, text: "At least 12 characters long" },
    { check: /[A-Z]/.test(password), text: "Contains uppercase letter" },
    { check: /[a-z]/.test(password), text: "Contains lowercase letter" },
    { check: /\d/.test(password), text: "Contains number" },
    { check: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "Contains special character" },
    { check: password === confirmPassword, text: "Passwords match" }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.check);

  return (
    <main className='flex flex-col gap-[32px] lg:gap-0 lg:justify-between max-w-[1440px] mx-auto w-[90%]'>
      <img src="/images/blogs/logoa.jpg" className='mx-auto w-[100px] lg:w-[200px]' alt="" />
      <div className='flex max-w-[1330px] mx-auto gap-[32px]'>
        <div className='flex min-h-full flex-col justify-center lg:justify-start px-6 py-12 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <h2 className='mt-10 text-center lg:text-left text-[32px] font-medium leading-9 tracking-tight text-black'>
              Get Started Now
            </h2>
          </div>
          <p aria-live='polite' className='text-[#ff0000] text-center text-[16px]' role='status'>
            {stateemployee?.message}
          </p>
          <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form className='space-y-6' action={handleSubmitEmployee}>
              <div>
                <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    autoComplete='email'
                    required
                    className='block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                  Password
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium leading-6 text-gray-900'>
                  Confirm Password
                </label>
                <div className='mt-2'>
                  <input
                    id='confirmPassword'
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className='block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Password Requirements:</h3>
                {passwordRequirements.map((req, index) => (
                  <PasswordRequirement key={index} isMet={req.check} text={req.text} />
                ))}
              </div>

              <div>
                <SignUpButton />
              </div>

              <p className='mt-10 text-center text-sm text-gray-500'>
                <input
                  type='checkbox'
                  id="terms"
                  name="terms"
                  required
                  className='font-semibold mr-1 leading-6 text-indigo-600 hover:text-indigo-500'
                />
                <a href='/terms-and-conditions' className='underline'>I agree to the terms & policy</a>
              </p>
            </form>
          </div>
        </div>
        <img src="/images/blogs/signc.jpg" className='hidden lg:block w-[480px] xl:w-[500px] object-cover' alt="image" />
      </div>
    </main>
  );
};

export default Signup;