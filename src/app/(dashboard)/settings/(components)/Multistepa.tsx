"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreateEducation, CreateExperience, CreateProfile } from "@/app/action";
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';


const initialState = {
  message: ""
}

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

export default function Multistepa() {
//  handle submission
  const [stateprofile, handleProfile] = useFormState(CreateProfile, initialState);
  const [stateeducation, handleEducation] = useFormState(CreateEducation, initialState)
  const [stateexperience, handleExperience] = useFormState(CreateExperience, initialState)
 
  const handleReset = () => {
    // @ts-ignore
    document.getElementById('handleProfileForm')?.reset();
  }

  const handleEDucation = () => {
    // @ts-ignore
    document.getElementById('handleEducationForm')?.reset();
  }

  const handleEXperience = () => {
    // @ts-ignore
    document.getElementById('handleExperienceForm')?.reset();
  }
  return (
    <section className=" inset-0 flex flex-col justify-between pl-[32px] w-[80%]">
      <div className="mt-1 py-2" >
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Provide your personal details.
        </p>
        <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {stateprofile?.message}
        </p>
        <form id="handleProfileForm" action={handleProfile} className=" mt-2 mb-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="firstName"
                required
                name="firstname"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="lastName"
                required
                name="lastname"
                autoComplete="family-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                name="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Address
            </label>
            <div className="mt-2">
              <input
                id="address"
                required
                type="text"
                name="address"
                autoComplete="address"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="role_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Job Title
            </label>
            <div className="mt-2">
              <input
                id="role_name"
                required
                type="text"
                name="role_name"
                autoComplete="role_name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="phone_number"
                required
                type="tel"
                name="phone_number"
                autoComplete="phone_number"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="githubUrl"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Github Url
            </label>
            <div className="mt-2">
              <input
                id="githubUrl"
                type="text"
                required
                name="githubUrl"
                autoComplete="githubUrl"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="linkedinUrl"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              LinkedIn Url
            </label>
            <div className="mt-2">
              <input
                id="linkedinUrl"
                type="text"
                required
                name="linkedinUrl"
                autoComplete="linkedinUrl"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="about"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Bio
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                required
                autoComplete="about"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
          <SubmittingButton text='Add Profile' />
          <button type="button" onClick={handleReset} className="withborder sm:col-span-2">
            Reset Form
          </button>
        </form>

        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Education
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Education Information
        </p>
        <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {stateeducation?.message}
        </p>
        <form action={handleEducation} id="handleEducationForm" className="mb-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor={`course`}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Course Name
            </label>
            <div className="mt-2">
              <input
                id={`course`}
                autoComplete="course"
                name="course"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor={`school_name`}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Institution
            </label>
            <div className="mt-2">
              <input
                type="text"
                id={`school_name`}
                required
                name="school_name"
                autoComplete="school_name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor={`startDate`}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Start Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id={`startDate`}
                required
                name="startDate"
                autoComplete="startDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor={`endDate`}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              End Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id={`endDate`}
                required
                name="endDate"
                autoComplete="endDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor={`summary`}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Summary
            </label>
            <div className="mt-2">
              <textarea
                id={`summary`}
                required
                name="summary"
                autoComplete="summary"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              ></textarea>
             
            </div>
          </div>
          <SubmittingButton text='Add Education' />
          <button type="button" onClick={handleEDucation} className="withborder sm:col-span-2">
            Add Education
          </button>
        </form>

        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Experience
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Previous Experiences
        </p>
        <p aria-live='polite' className=' text-[#ff0000] text-center text-[16px]' role='status'>
          {stateexperience?.message}
        </p>
        <form action={handleExperience} id="handleExperienceForm" className="mb-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Role Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                required
                autoComplete="title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="company"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Company Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                required
                id="company"
                name="company"
                autoComplete="company"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Start Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="startDate"
                required
                name="startDate"
                autoComplete="startDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              End Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="endDate"
                required
                name="endDate"
                autoComplete="endDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="workSummary"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Work Summary
            </label>
            <div className="mt-2">
              <textarea
                id="workSummary"
                name="workSummary"
                required
                autoComplete="workSummary"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
          <SubmittingButton text='Add Experience' />
          <button type="button" onClick={handleEXperience} className="withborder sm:col-span-2">
            Add Experience
          </button>  
          <a href="/user-profile" onClick={handleEXperience} className="withborder sm:col-span-2">
            User Profile
          </a>          
        </form>
        <div className="mt-8 pt-5"></div>
      </div>
    </section>
  );
}