import { z } from 'zod'

export const ProfileFormDataSchema = z.object({
  jobTitle: z.string().min(3, 'JOb Title is required'),
  location: z.string().min(3, 'Location is required'),
  salary: z.number().min(3, 'salary is required'),
  companyName: z.string().min(3, 'Company name is required'),
  companyWebsiteLink: z.string().min(3, 'Company website link is required'),
  desires: z.string().min(3, 'Desires is required'),
  jobType: z.string().min(3, 'Job type is required'),
  deadline: z.string().min(3, 'Deadline is required'),
  employer: z.string().min(2, 'employer required'),
  description:  z.string().min(2, 'Description is required'),
  about: z.string().min(2, "About is required"),
  jobBenefits: z.string().min(3, 'Job Benefits is Required'),
  requirements: z.string().min(3, 'Requirements is required'),
  experience: z.string().min(3, 'Experience is required'),
  keywords: z.string().min(3, 'Experience is required'),
  jobRoles: z.string().min(3, 'Experience is required'),
  education: z.string().min(3, 'Experience is required'),
  jobLevel: z.string().min(3, 'Experience is required'),
  expirationDate: z.string().min(3, 'Experience is required'),
})

export const FormDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  address: z.string().min(1, 'Your address is required'),
  role_name: z.string().min(1, 'Your Job Title is required'),
  phone_number: z.number().min(10, 'Your phone Number is required'),
  githubUrl: z.string().min(1, 'Your Github Url is required'),
  linkedinUrl: z.string().min(1, 'Your Linkedin Url is required'),
  about: z.string().min(1, 'Your bio is required'),
  course: z.string().min(1, 'Your Certificate is required'),
  school_name: z.string().min(1, 'Your Institution/college is required'),
  startDate: z.string().min(4, 'Your Start Date is required'),
  endDate: z.string().min(4, 'Your End Date is required'),
  summary: z.string().min(4, 'Your Summary is required'),
  title: z.string().min(1, 'Your Role title is required'),
  company: z.string().min(1, 'The company is required'),
  workSummary: z.string().min(4, 'Your Work Summary is required'),
})

export const FormProfile = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  address: z.string().min(1, 'Your address is required'),
  role_name: z.string().min(1, 'Your Job Title is required'),
  phone_number: z.string().min(2, 'Your phone Number is required'),
  githubUrl: z.string().min(1, 'Your Github Url is required'),
  linkedinUrl: z.string().min(1, 'Your Linkedin Url is required'),
  about: z.string().min(1, 'Your bio is required'),
})

export const PostingJob = z.object({
  title: z.string().min(3, 'Job Titleis required'),
  location: z.string().min(3, "Location Of the Job"),
  salary: z.string().min(4, 'Salary in Ksh is required'),
  companyName: z.string().min(1, 'Company Name is required'),
  companyWebsiteLink: z.string().min(1, 'Your company webisite link is required'),
  desires: z.string().min(1, 'Your Job desires are required'),
  jobType: z.string().min(2, 'Your Job Type is required'),
  deadline: z.null(),
  employer: z.null(),
  logoUpload: z.null(),
  description: z.string().min(2, 'Your Job description is required'),
  about: z.string().min(1, 'Job About is required'),
  jobBenefits: z.string().min(1, 'Job Benefits are required'),
  requirements: z.string().min(1, 'Job requirements are required'),
  experience: z.string().min(1, 'Job experience are required'),
})

export const FormEducation = z.object({
  course: z.string().min(1, 'Your Certificate is required'),
  school_name: z.string().min(1, 'Your Institution/college is required'),
  startDate: z.string().min(4, 'Your Start Date is required'),
  endDate: z.string().min(4, 'Your End Date is required'),
  summary: z.string().min(4, 'Your Summary is required'),
})

export const FormExperience = z.object({
  title: z.string().min(1, 'Your Role title is required'),
  company: z.string().min(1, 'The company is required'),
  startDate: z.string().min(4, 'Your Start Date is required'),
  endDate: z.string().min(4, 'Your End Date is required'),
  workSummary: z.string().min(4, 'Your Work Summary is required'),
})


export const Signupschema = z.object({
  confirmPassword: z.string().min(3, 'Your name is required'),
  email: z.string().min(3, 'Your email is requires').email('invalid Email address'),
  password: z.string().min(3, 'Password is required')
})

export const Forgotpass = z.object({
  confirmPassword: z.string().min(3, 'Your name is required'),
  password: z.string().min(3, 'Password is required')
})

export const Signinschema = z.object({
  email: z.string().min(3, 'Your email is requires').email('invalid Email address'),
  password: z.string().min(3, 'Password is required')
})


export const ESigninschema = z.object({
  name: z.string().min(3, 'Your name is required'),
  password: z.string().min(3, 'Password is required')
})
