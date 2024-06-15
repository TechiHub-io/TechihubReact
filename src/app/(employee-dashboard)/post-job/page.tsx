"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { PostedJob } from "@/app/action";
function SubmittingButton({text}: any){
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      aria-disabled={pending}
      className='flex w-full sm:col-span-4 justify-center items-center rounded-md bg-[#0CCE68] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >{pending ? 'Loading' : `${text}`}
    </button>
  )
}

const initialState = {
  message: ""
}


const PostJob = () => {


  const url = "/techihub/list";
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/e-dashboard");
    },
  });

  const callout = () => {
    // @ts-ignore
    if (session?.user?.role !== "EMPLOYER") {
      redirect("/");
    }
  };
  setTimeout(() => {
    callout();
  }, 2000);

  const [statejob, handleSubmit] = useFormState(PostedJob, initialState);
  const handleReset = () => {
    // @ts-ignore
    document.getElementById('handleProfileForm')?.reset();
  }
  return (
    <section className="max-w-[907px]">
      <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {statejob?.message}
        </p>
      <form action={handleSubmit}>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex justify-between">
            <div className="flex flex-col gap-[16px]">
              <h2 className="text-[32px] font-semibold leading-7 text-gray-900">
                New job
              </h2>
              <p className="mt-1 text-[20px] leading-6 text-gray-600">
                Post a new job
              </p>
            </div>
            <Image
              src="/images/dashboard/avator.svg"
              alt="avator"
              className="rounded-full"
              width={49}
              height={49}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Job Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Enter Job Title"
                  autoComplete="jobTitle"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>
            <br />
            <div className="sm:col-span-3">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Location
              </label>
              <div className="mt-2">
                <input
                  id="Location"
                  type="text"
                  name="location"
                  placeholder="enter Location"
                  autoComplete="location"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>
            <br />
            <div className="sm:col-span-3">
              <label
                htmlFor="salary"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Salary
              </label>
              <div className="mt-2">
                <input type="number"
                  id="salary"
                  name="salary"
                  autoComplete="salary"
                  required
                  placeholder="Expected salaly in ksh"
                  className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Name
              </label>
              <div className="mt-2">
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  placeholder="enter Company Name"
                  autoComplete="companyName"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <h3 className="text-[20px] font-normal text-[#000] py-[32px] sm:col-span-4">
              Advanced Info
            </h3>

            <div className="sm:col-span-3">
              <label
                htmlFor="companyWebsiteLink"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Website Link
              </label>
              <div className="mt-2">
                <input
                  id="companyWebsiteLink"
                  type="text"
                  name="companyWebsiteLink"
                  placeholder="enter Company Website LInk"
                  autoComplete="companyWebsiteLink"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>
            <div className="sm:col-span-3 ">
              <label
                htmlFor="desires"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Desires
              </label>
              <div className="mt-2">
                <input
                  id="desires"
                  type="text"
                  name="desires"
                  placeholder="enter Desires"
                  autoComplete="desires"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="jobType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Job type
              </label>
              <div className="mt-2">
              <select
                id="jobType"
                name="jobType"
                autoComplete="jobType"
                required
                className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="requirements"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Requirements
              </label>
              <div className="mt-2">
                <textarea
                  id="requirements"
                  name="requirements"
                  placeholder="enter Requirements"
                  autoComplete="requirements"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="experience"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Experience
              </label>
              <div className="mt-2">
              <select
                id="experience"
                name="experience"
                autoComplete="experience"
                required
                className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
              >
                <option value="">Select years of experience</option>
                <option value="0-2 Years">0-2 Years</option>
                <option value="2-4 Years">2-4 Years</option>
                <option value="5-7 Years">5-7 Years</option>
                <option value="Above 7 years">Above 7 years</option>
              </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="deadline"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Deadline
              </label>
              <div className="mt-2">
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  placeholder="enter Deadline"
                  autoComplete="Deadline"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="employer"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Employer
              </label>
              <div className="mt-2">
                <input
                  id="employer"
                  type="text"
                  name="employer"
                  placeholder="enter the employer"
                  autoComplete="employer"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Job Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  placeholder="enter Description of the Job"
                  autoComplete="description"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  placeholder="enter about the job"
                  autoComplete="about"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
            <label
                htmlFor="jobBenefits"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Benefits
              </label>
              <input
                id="jobBenefits"
                type="text"
                name="jobBenefits"
                placeholder="enter Job Benefits"
                autoComplete="jobBenefits"
                required
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
              />
            </div>
          </div>
        </motion.div>
        <br />
        <SubmittingButton text="Post Job" />
        <button type="button" onClick={handleReset} className="withborder mt-[16px] sm:col-span-3">
          Reset Form
        </button>
      </form>
    </section>
  );
};

export default PostJob;

// original version

// 'use client';
// import { z } from 'zod';
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { ProfileFormDataSchema } from '@/libs/forms/PostSchema';
// import Image from 'next/image';
// import Bgbutton from '@/(components)/shared/Bgbutton';
// import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';

// type Inputs = z.infer<typeof ProfileFormDataSchema>;
// const PostJob = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     trigger,
//     formState: { errors },
//   } = useForm<Inputs>({
//     resolver: zodResolver(ProfileFormDataSchema),
//   });

//   const url = '/techihub/list';
//   const {data: session} = useSession({
//     required: true,
//     onUnauthenticated(){
//       redirect("/api/auth/signin?callbackUrl=/e-dashboard")
//     }
//   }
//   );

//   const callout = () => {
//     // @ts-ignore
//     if(session?.user?.role !== "EMPLOYER") {
//      redirect('/');
//     }
//   }
//   setTimeout(() => {
//     callout();
//   }, 2000)

//   const processForm: SubmitHandler<Inputs> = (data) => {
//     reset();
//   };
//   return (
//     <section className='max-w-[907px]'>
//       <form onSubmit={handleSubmit(processForm)}>
//         <motion.div
//           initial={{ x: 200, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.3, ease: 'easeInOut' }}
//         >
//           <div className='flex justify-between'>
//             <div className='flex flex-col gap-[16px]'>
//               <h2 className='text-[32px] font-semibold leading-7 text-gray-900'>
//                 New job
//               </h2>
//               <p className='mt-1 text-[20px] leading-6 text-gray-600'>
//                 Post a new job
//               </p>
//             </div>
//             <Image
//               src='/images/dashboard/avator.svg'
//               alt='avator'
//               className='rounded-full'
//               width={49}
//               height={49}
//             />
//           </div>

//           <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
//             <div className='sm:col-span-4'>
//               <label
//                 htmlFor='jobTitle'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Job Title
//               </label>
//               <div className='mt-2'>
//                 <input
//                   type='text'
//                   id='jobTitle'
//                   {...register('jobTitle')}
//                   placeholder='Enter Job Title'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.jobTitle?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.jobTitle.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <br />
//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='keywords'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Keywords
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='keywords'
//                   type='text'
//                   {...register('keywords')}
//                   placeholder='enter keywords'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.keywords?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.keywords.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='jobRoles'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Job Roles
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='jobRoles'
//                   type='text'
//                   {...register('jobRoles')}
//                   placeholder='enter jobRoles'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.jobRoles?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.jobRoles.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <h3 className='text-[20px] font-normal text-[#000] py-[32px] sm:col-span-4'>
//               Advanced Info
//             </h3>

//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='education'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Education
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='education'
//                   type='text'
//                   {...register('education')}
//                   placeholder='enter education'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.education?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.education.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className='sm:col-span-3 '>
//               <label
//                 htmlFor='experience'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Experience
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='experience'
//                   type='text'
//                   {...register('experience')}
//                   placeholder='enter experience'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.experience?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.experience.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='jobType'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Job type
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='jobType'
//                   type='text'
//                   {...register('jobType')}
//                   placeholder='enter jobType'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.jobType?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.jobType.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='jobLevel'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Job level
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='jobLevel'
//                   type='text'
//                   {...register('jobLevel')}
//                   placeholder='enter jobLevel'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.jobLevel?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.jobLevel.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className='sm:col-span-3'>
//               <label
//                 htmlFor='expirationDate'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Expiration date
//               </label>
//               <div className='mt-2'>
//                 <input
//                   id='expirationDate'
//                   type='text'
//                   {...register('expirationDate')}
//                   placeholder='enter expirationDate'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.expirationDate?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.expirationDate.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className='sm:col-span-4'>
//               <label
//                 htmlFor='expirationDate'
//                 className='block text-sm font-medium leading-6 text-gray-900'
//               >
//                 Job Description
//               </label>
//               <div className='mt-2'>
//                 <textarea
//                   id='expirationDate'
//                   {...register('expirationDate')}
//                   placeholder='enter expirationDate'
//                   autoComplete='given-name'
//                   className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]'
//                 />
//                 {errors.expirationDate?.message && (
//                   <p className='mt-2 text-sm text-red-400'>
//                     {errors.expirationDate.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <h3 className='text-[20px] font-normal text-[#000] py-[32px] sm:col-span-4'>
//               Select Benefits
//             </h3>
//             <div className='sm:col-span-4'>
//               <BoxSelection />
//             </div>
//           </div>
//         </motion.div>
//         <br />
//         <Bgbutton link='' text='Post Job' btntype='withborder' />
//       </form>
//     </section>
//   );
// };

// export default PostJob;

// const BoxSelection = () => {
//   interface Box {
//     id: number;
//     label: string;
//   }
//   const [selectedBoxes, setSelectedBoxes] = useState<number[]>([]);

//   const handleBoxClick = (boxId: number) => {
//     if (selectedBoxes.includes(boxId)) {
//       setSelectedBoxes(selectedBoxes.filter((id) => id !== boxId));
//     } else {
//       setSelectedBoxes([...selectedBoxes, boxId]);
//     }
//   };

//   return (
//     <div className='flex flex-wrap'>
//       {[
//         { id: 1, label: 'Competitive salary' },
//         { id: 2, label: 'Competitive growth' },
//         { id: 3, label: 'Competitive Space' },
//       ].map(({ id, label }) => (
//         <div
//           key={id}
//           className={`w-[250px] h-[73px] border-2 border-gray-400 m-2 flex justify-center items-center cursor-pointer ${
//             selectedBoxes.includes(id)
//               ? 'bg-[#E7FFEB] text-[#000] opacity-50'
//               : ''
//           }`}
//           onClick={() => handleBoxClick(id)}
//         >
//           {label}
//         </div>
//       ))}
//       <input
//         type='hidden'
//         name='selectedBoxes'
//         value={selectedBoxes.join(',')}
//       />
//     </div>
//   );
// };
