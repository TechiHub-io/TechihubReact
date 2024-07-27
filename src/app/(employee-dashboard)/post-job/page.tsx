"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { PostedJob } from "@/app/action";
function SubmittingButton({ text }: any) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="flex w-full sm:col-span-4 justify-center items-center rounded-[5px] bg-[#0CCE68] px-3 py-1.5 text-sm max-w-[250px] mx-auto font-semibold leading-6 text-white shadow-sm hover:bg-[#364187] h-[50px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {pending ? "Loading" : `${text}`}
    </button>
  );
}

const initialState = {
  message: "",
};

const PostJob = () => {
  const [applicationMethod, setApplicationMethod] = useState<string>("email");
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
    document.getElementById("handleProfileForm")?.reset();
  };
  return (
    <section className="mx-[32px] max-w-[1220px]">
      <div>
        
      </div>
      <p
        aria-live="polite"
        className=" text-[#ff0000] text-center text-[16px]"
        role="status"
      >
        {statejob?.message}
      </p>
      
      <form
        action={handleSubmit}
        className="w-full max-w-[1220px] mx-auto bg-white shadow-md rounded-[10px] px-8 pt-6 pb-8 mb-4"
      >
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="mb-6">
            <h2 className="text-[16px] text-center font-semibold bg-[#364187] text-white p-2 mb-4">
              BASIC INFORMATION
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="jobTitle"
              >
                Job Title
              </label>
              <input
                className="shadow appearance-none border rounded-[10px] w-full p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="Enter job title"
              />
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="jobCategory"
                >
                  Job Category
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="jobCategory"
                    name="jobCategory"
                  >
                    <option value="">Choose job category</option>
                    <option value="it">IT</option>
                    <option value="finance">Finance</option>
                    <option value="marketing">Marketing</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="jobLocation"
                >
                  Job Location
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="jobLocation"
                    name="jobLocation"
                  >
                    <option value="">Select location</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[16px] text-center font-semibold bg-[#364187] text-white p-2 mb-4">
              ADVANCED INFORMATION
            </h2>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="education"
                >
                  Education
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="education"
                    name="education"
                  >
                    <option value="">Choose education level</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Degree</option>
                    <option value="masters">Masters</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="experience"
                >
                  Experience
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="experience"
                    name="experience"
                  >
                    <option value="">Experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="intermediate">
                      Intermediate (3-5 years)
                    </option>
                    <option value="senior">Senior (6+ years)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="jobType"
                >
                  Job type
                </label>
                <input
                  className="shadow appearance-none border rounded-[10px] w-full p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="jobType"
                  name="jobType"
                  type="text"
                  placeholder="Job type"
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="jobLevel"
                >
                  Job level
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="jobLevel"
                    name="jobLevel"
                  >
                    <option value="">Job level</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid level</option>
                    <option value="experienced">Experienced</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="expirationDate"
                >
                  Expiration date
                </label>
                <input
                  className="shadow appearance-none border rounded-[10px] w-full p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="salaryRange"
                >
                  Salary range
                </label>
                <div className="flex">
                  <select
                    className="block appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-[10px]-l leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="salaryCurrency"
                    name="salaryCurrency"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    className="shadow appearance-none border border-l-0 w-1/2 p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="salaryMin"
                    name="salaryMin"
                    type="text"
                    placeholder="Min monthly"
                  />
                  <input
                    className="shadow appearance-none border border-l-0 rounded-[10px]-r w-1/2 p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="salaryMax"
                    name="salaryMax"
                    type="text"
                    placeholder="Max monthly"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="jobDescription"
              >
                Job Description
              </label>
              <textarea
                className="shadow appearance-none  h-[191px] border rounded-[10px] w-full p-[10px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobDescription"
                name="jobDescription"
                placeholder="Enter job description"
              ></textarea>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[16px] text-center font-semibold bg-[#364187] text-white p-2 mb-4">
              APPLICATION RECEIVING METHOD
            </h2>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end justify-between max-w-[672px] mb-4">
              <select
                className="block appearance-none w-full lg:w-[269px] h-[50px] bg-white border border-gray-200 text-gray-700 p-[10px] pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="applicationMethod"
                name="applicationMethod"
                value={applicationMethod}
                onChange={(e) => setApplicationMethod(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="website">Website link</option>
              </select>
              <div className="flex flex-col">
                <label htmlFor="applicationReceiver" className="capitalize">
                  {applicationMethod}
                </label>
                <input
                  className="shadow appearance-none border w-full lg:w-[269px] border-l-0 rounded-[10px]  p-[10px] h-[50px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="applicationReceiver"
                  name="applicationReceiver"
                  type="text"
                  placeholder={
                    applicationMethod === "email" ? "Your email" : "Website URL"
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>
        <br />
        <SubmittingButton text="Post Job" />
        {/* <button
          type="button"
          onClick={handleReset}
          className="withborder mt-[16px] sm:col-span-3"
        >
          Reset Form
        </button> */}
      </form>
    </section>
  );
};

export default PostJob;

// old form
{
  /* <div className="flex justify-between">
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
              className="rounded-[10px]-full"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full p-2 rounded-[10px]-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                <textarea
                  id="desires"
                  name="desires"
                  placeholder="enter Desires"
                  autoComplete="desires"
                  required
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
                ></textarea>
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
                className="block w-full p-2 rounded-[10px]-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                className="block w-full p-2 rounded-[10px]-md border-gray-300 shadow-sm focus:border-sky-600 focus:ring-sky-600 sm:text-sm"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                  className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 h-[191px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
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
                className="block w-full rounded-[10px]-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 placeholder:p-[16px]"
              />
            </div>
          </div> */
}
