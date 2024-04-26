import { z } from 'zod'

export const FormDataSchema = z.object({
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
  experience: z.string().min(3, 'Experience is required')
})