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
  country: z.string().min(1, 'Country is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip is required')
})


export const Signupschema = z.object({
  name: z.string().min(3, 'Your name is required'),
  email: z.string().min(3, 'Your email is requires').email('invalid Email address'),
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
