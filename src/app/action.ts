'use server'
import { Forgotpass, FormDataSchema, FormEducation, FormExperience, FormProfile, PostingJob, Resetpass, Signupschema } from '@/libs/forms/PostSchema';
import axios from 'axios';
import { redirect } from 'next/navigation';
import {auth} from '../../auth'

const baseurl =   'https://techihubjobsproject.azurewebsites.net'
export async function signUserUp(state: { message: string }, formData: FormData){
  const baseurl =   'https://techihubjobsproject.azurewebsites.net'
  const rawformData = Signupschema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  let compare = rawformData.password.trim().localeCompare(rawformData.confirmPassword.trim());
  if(compare !== 0){
    return {message: 'password dont match'}
  }
  try {
    const response = await axios.post(`${baseurl}/api/users/register/user`, rawformData).then(response => response.data).catch(error =>  error);
   
    if(response.response.data.status !== 200){
      return {message: `${response.response.data.message}`}
    }
    return {message: `${response.response.data.message}`}

  } catch (error: any) {
    return {message: `Error encountered ${error}`}
  }
} 

export async function signUserUpEmployee(state: { message: string }, formData: FormData){
  const baseurl =   'https://techihubjobsproject.azurewebsites.net'
  const rawformData = Signupschema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  let compare = rawformData.password.trim().localeCompare(rawformData.confirmPassword.trim());
  if(compare !== 0){
    return {message: 'password dont match'}
  }
  try {
    const response = await axios.post(`${baseurl}/api/users/register/employer`, rawformData).then(response => response.data).catch(error =>  error);
    
    if(response.response.data.status !== 200){
      return {message: `${response.response.data.message}`}
    }
    return {message: `${response.response.data.message}`}

  } catch (error: any) {
    return {message: `Error encountered ${error}`}
  }
} 

export async function ForgotPasswordsetup(state: {message: string}, formData: FormData){
 
  const rawformData = Forgotpass.parse({
    email: formData.get('email'),
  })
  try {
    const response = await axios.post(`${baseurl}/api/users/forgot-password?email=${rawformData.email}`).then(response => response.data).catch(error =>  error);
    if(response.statusCode !== 200){
      return {message: `${response.message}`}
    }
    return {message: `${response.message}`}

  } catch (error: any) {
    return {message: `Email Does not Exist ${error}`}
  }
}

export async function ResetPasswordsetup(state: {message: string}, formData: FormData){
 
  const rawformData = Resetpass.parse({
    resetToken: formData.get('resetToken'),
    newPassword: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  let compare = rawformData.newPassword.trim().localeCompare(rawformData.confirmPassword.trim());
  if(compare !== 0){
    return {message: 'password dont match'}
  }
  try {
    const response = await axios.post(`${baseurl}/api/users/register/employer`, rawformData).then(response => response.data).catch(error =>  error);
    
    if(response?.statusCode !== 200){
      return {message: `${response.message}`}
    }
    return {message: `${response?.message}`}

  } catch (error: any) {
    return {message: `Error encountered ${error}`}
  }
}

export async function CreateProfile(state: {message: string}, formData: FormData){
  const session = await auth();
  const profile =  FormProfile.parse({
    first_name: formData.get('firstname'),
    last_name: formData.get('lastname'),
    address: formData.get('address'),
    email: formData.get('email'),
    role_name: formData.get('role_name'),
    phone_number: formData.get('phone_number'),
    githubUrl: formData.get('githubUrl'),
    linkedinUrl: formData.get('linkedinUrl'),
    about: formData.get('about')    
  })
  const profile2 = {...profile, username: profile.first_name + " " + profile.last_name}
  try {
    // @ts-ignore
    const response = await axios.put(`${baseurl}/api/user-profile/update-name-role/${session?.user?.userId}`, profile2).then(response => response.data).catch(error => error)
    if(response === ''){
      return {message: 'session timeout'}
    }
    return {message: `Congratulations succesfuly created profile`}
  } catch (error) {
    return {message: `Error encountered ${error}`}
  }
}

export async function CreateEducation(state: {message: string}, formData: FormData){
  const session = await auth();
  const education =  FormEducation.parse({
    course: formData.get('course'),
    school_name: formData.get('school_name'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    summary: formData.get('summary')
  })
  try {
    // @ts-ignore
    const response = await axios.post(`https://techihubjobsproject.azurewebsites.net/educations/${session?.user?.userId}`, education).then(response => response.data).catch(error => error)
    if(response === ''){
      return {message: 'session timeout'}
    }
    return {message: `Congratulations succesfuly added Education fill again to add more`}
  } catch (error) {
    return {message: `Error encountered ${error}`}
  }
}

export async function CreateExperience(state: {message: string}, formData: FormData){
  const session = await auth();
  const experience = FormExperience.parse({
    title: formData.get('title'),
    company: formData.get('company'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    workSummary: formData.get('workSummary')
  })
  try {
    // @ts-ignore
    const response = await axios.post(`${baseurl}/educations/${session?.user?.userId}`, experience).then(response => response.data).catch(error => error)
  
    if(response === ''){
      return {message: 'session timeout'}
    }
    return {message: `Congratulations succesfuly created education fill in to create more`}
    
  } catch (error) {
    return {message: `Error encountered ${error}`}
  }
  
}

export async function PostedJob(state: {message: string}, formData: FormData){
  
  const session = await auth();

  const experiencepost = PostingJob.parse({
  title: formData.get("jobTitle"),
  location: formData.get("location"),
  salary: formData.get("salary"),
  logoUpload: null,
  companyName: formData.get("companyName"),
  companyWebsiteLink: formData.get("companyWebsiteLink"),
  desires: formData.get("desires"),
  jobType: formData.get("jobType"),
  deadline: null,
  employer: null,
  description: formData.get("description"),
  about: formData.get("about"),
  jobBenefits: formData.get("jobBenefits"),
  requirements: formData.get("requirements"),
  experience: formData.get("experience")
  })
  try {
    // @ts-ignore
    const response = await axios.post(`${baseurl}/techihub/save`, experiencepost).then(response => response.data).catch(error => error)
    if(response === ''){
      return {message: 'session timeout'}
    }
    
    return {message: `Congratulations succesfuly created education fill in to create more`}
  
  } catch (error) {
    return {message: `Error encountered ${error}`}
  }
}