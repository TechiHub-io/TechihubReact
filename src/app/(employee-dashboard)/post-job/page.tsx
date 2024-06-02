'use client';
import { z } from 'zod';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProfileFormDataSchema } from '@/libs/forms/PostSchema';
import Image from 'next/image';
import Bgbutton from '@/(components)/shared/Bgbutton';
type Inputs = z.infer<typeof ProfileFormDataSchema>;
const PostJob = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ProfileFormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = (data) => {
    reset();
  };
  return (
    <section className='max-w-[907px]'>
      <form onSubmit={handleSubmit(processForm)}>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className='flex justify-between'>
            <div className='flex flex-col gap-[16px]'>
              <h2 className='text-[32px] font-semibold leading-7 text-gray-900'>
                New job
              </h2>
              <p className='mt-1 text-[20px] leading-6 text-gray-600'>
                Post a new job
              </p>
            </div>
            <Image
              src='/images/dashboard/avator.svg'
              alt='avator'
              className='rounded-full'
              width={49}
              height={49}
            />
          </div>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-4'>
              <label
                htmlFor='jobTitle'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Job Title
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='jobTitle'
                  {...register('jobTitle')}
                  placeholder='Enter Job Title'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.jobTitle?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>
            <br />
            <div className='sm:col-span-3'>
              <label
                htmlFor='keywords'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Keywords
                
              </label>
              <div className='mt-2'>
                <input
                  id='keywords'
                  type='text'
                  {...register('keywords')}
                  placeholder='enter keywords'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.keywords?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.keywords.message}
                  </p>
                )}
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='jobRoles'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Job Roles
              </label>
              <div className='mt-2'>
                <input
                  id='jobRoles'
                  type='text'
                  {...register('jobRoles')}
                  placeholder='enter jobRoles'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.jobRoles?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.jobRoles.message}
                  </p>
                )}
              </div>
            </div>

            <h3 className='text-[20px] font-normal text-[#000] py-[32px] sm:col-span-4'>
              Advanced Info
            </h3>

            <div className='sm:col-span-3'>
              <label
                htmlFor='education'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Education
              </label>
              <div className='mt-2'>
                <input
                  id='education'
                  type='text'
                  {...register('education')}
                  placeholder='enter education'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.education?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.education.message}
                  </p>
                )}
              </div>
            </div>
            <div className='sm:col-span-3 '>
              <label
                htmlFor='experience'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Experience
              </label>
              <div className='mt-2'>
                <input
                  id='experience'
                  type='text'
                  {...register('experience')}
                  placeholder='enter experience'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.experience?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='jobType'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Job type
              </label>
              <div className='mt-2'>
                <input
                  id='jobType'
                  type='text'
                  {...register('jobType')}
                  placeholder='enter jobType'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.jobType?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.jobType.message}
                  </p>
                )}
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='jobLevel'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Job level
              </label>
              <div className='mt-2'>
                <input
                  id='jobLevel'
                  type='text'
                  {...register('jobLevel')}
                  placeholder='enter jobLevel'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.jobLevel?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.jobLevel.message}
                  </p>
                )}
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='expirationDate'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Expiration date
              </label>
              <div className='mt-2'>
                <input
                  id='expirationDate'
                  type='text'
                  {...register('expirationDate')}
                  placeholder='enter expirationDate'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.expirationDate?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.expirationDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className='sm:col-span-4'>
              <label
                htmlFor='expirationDate'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Job Description
              </label>
              <div className='mt-2'>
                <textarea
                  id='expirationDate'
                  {...register('expirationDate')}
                  placeholder='enter expirationDate'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
                />
                {errors.expirationDate?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.expirationDate.message}
                  </p>
                )}
              </div>
            </div>
            <h3 className='text-[20px] font-normal text-[#000] py-[32px] sm:col-span-4'>
              Select Benefits
            </h3>
            <div className='sm:col-span-4'>
              <BoxSelection />
            </div>
          </div>
        </motion.div>
        <br />
        <Bgbutton link='' text='Post Job' btntype='withborder' />
      </form>
    </section>
  );
};

export default PostJob;

const BoxSelection = () => {
  interface Box {
    id: number;
    label: string;
  }
  const [selectedBoxes, setSelectedBoxes] = useState<number[]>([]);

  const handleBoxClick = (boxId: number) => {
    if (selectedBoxes.includes(boxId)) {
      setSelectedBoxes(selectedBoxes.filter((id) => id !== boxId));
    } else {
      setSelectedBoxes([...selectedBoxes, boxId]);
    }
  };

  return (
    <div className='flex flex-wrap'>
      {[
        { id: 1, label: 'Competitive salary' },
        { id: 2, label: 'Competitive growth' },
        { id: 3, label: 'Competitive Space' },
      ].map(({ id, label }) => (
        <div
          key={id}
          className={`w-[250px] h-[73px] border-2 border-gray-400 m-2 flex justify-center items-center cursor-pointer ${
            selectedBoxes.includes(id)
              ? 'bg-[#E7FFEB] text-[#000] opacity-50'
              : ''
          }`}
          onClick={() => handleBoxClick(id)}
        >
          {label}
        </div>
      ))}
      <input
        type='hidden'
        name='selectedBoxes'
        value={selectedBoxes.join(',')}
      />
    </div>
  );
};
