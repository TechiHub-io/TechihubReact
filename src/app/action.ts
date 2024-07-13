'use server'
import { Forgotpass, FormDataSchema, FormEducation, FormExperience, FormProfile, PostingJob, Resetpass, Signupschema } from '@/libs/forms/PostSchema';
import axios from 'axios';
import { redirect } from 'next/navigation';
import {auth, signIn} from '../../auth'

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
   
    if (response?.error) {
      return { message: "", error: response.error };
    }

    if(response.response.data.status !== 200){
      return {message: `${response.response.data.message}`}
    }
    return {message: `${response.response.data.message}`}

  } catch (error: any) {
    return {message: `The Details are already registered try with different one`}
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
    }else if(response.response.data.status === 200) {
      return {message: "Succefully signed in check your email"}
    }
    return {message: `${response.response.data.message}`}

  } catch (error: any) {
    console.error('SignIn error:', error);
    return { message: "", error: 'Not succesful try again' };
  }
} 

export async function ForgotPasswordsetup(state: {message: string}, formData: FormData){
 
  const rawformData = Forgotpass.parse({
    email: formData.get('email'),
  })
  try {
    const response = await axios.post(`${baseurl}/api/users/forgot-password?email=${rawformData.email}`).then(response => response.data).catch(error =>  error);
    if(response.statusCode !== 200){
      return {message: `invalid email Please try with the right email`}
    }
    return {message: `${response.message}`}

  } catch (error: any) {
    return {message: `Email Does not Exist `}
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
    return {message: `Email does not Exist ${response?.message}`}

  } catch (error: any) {
    return {message: `Error encountered ${error}`}
  }
}

type State2 = {
  message: string;
  error?: string;
}

export async function UploadResume(prevState: State2, formData: FormData): Promise<State2> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { message: "", error: "User not authenticated" };
    }

    const file = formData.get('file') as File;
    const documentName = formData.get('documentName') as string;

    if (!file || !documentName) {
      return { message: "", error: "File and document name are required" };
    }

    // Fetch the user profile ID
    const userId = session.user.id; // Adjust this based on your session structure
    const profileResponse = await fetch(`/api/user-profile/${userId}`);
    const profileData = await profileResponse.json();
    const userProfileId = profileData.id; // Adjust this based on your API response structure

    // Prepare the form data for the API
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('documentName', documentName);
    apiFormData.append('userProfileId', userProfileId);

    // Make the API call
    const response = await fetch('https://techihubjobsproject.azurewebsites.net/documents/upload-document', {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: "", error: errorData.message || "Failed to upload resume" };
    }

    return { message: "Resume uploaded successfully" };
  } catch (error) {
    console.error('Upload error:', error);
    return { message: "", error: 'An error occurred while uploading the resume' };
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
    const response = await axios.post(`${baseurl}/experience/${session?.user?.userId}`, experience).then(response => response.data).catch(error => error)
  
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

type State = {
  message: string;
  error?: string;
  url?: undefined
}

export const SignInHandler = async (prevState: State, formData: FormData): Promise<State> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const res = await signIn('credentials', { 
      email, 
      password, 
      redirect: false,
      callbackUrl: "/dashboard"  // Specify where to redirect after successful login
    });
    if (res?.error) {
      return { message: "", error: res.error };
    }
    
    if (res?.url) {
      // Instead of redirecting here, we'll return the URL to redirect to
      return { message: "Success signin", error: undefined, url: res.url };
    }

    return { message: "Success signin", error: undefined };
  } catch (error) {
    console.error('SignIn error:', error);
    return { message: "", error: 'Invalid credentials Please try again' };
  }
}