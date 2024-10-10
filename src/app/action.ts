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

    if(response.message === "Request failed with status code 400"){
      return {message: "Try refreshing the page or use another email type, contact us if it all fails"}
    }else if(response.statusCode === 200) {
      redirect('/verification');
    }else if( response.statusCode !== 200){
      return {message: `${response.message}`}
    }
    return {message: `${response.message}`}

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
  console.log("raw data", rawformData)
  try {
    const response = await axios.post(`${baseurl}/api/users/register/employer`, rawformData).then(response => response.data).catch(error =>  error);
    
    if(response.message === "Request failed with status code 400"){
      return {message: "Try refreshing the page or use another email type, contact us if it all fails"}
    } else if(response.statusCode === 400) {
      return {message: `You have encountered an error ${response.message}`}
    } else if(response.statusCode === 200) {
       redirect('/verification');
    }else if( response.statusCode !== 200){
      return {message: `${response.message}`}
    }
    return {message: `${response.message}`}

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
    const response = await axios.post(`${baseurl}/api/users/reset-password`, rawformData).then(response => response.data).catch(error =>  error);
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

export async function UploadProfilePicture(prevState: State2, formData: FormData): Promise<State2> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { message: "", error: "User not authenticated" };
    }

    // Fetch the user profile ID
    //@ts-ignore
    const userId = session?.user?.userId;

    if (!userId) {
      return { message: "", error: "User ID not found" };
    }

    // Get the file from the formData
    const file = formData.get('file') as File;
    if (!file) {
      return { message: "", error: "No file provided" };
    }

    // Create a new FormData instance for the API request
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Make the API call
    const response = await axios.post(
      `https://techihubjobsproject.azurewebsites.net/api/files/upload-profile-photo/${userId}`,
      apiFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );


    if (response?.data?.statusCode === 200) {
      return { message: "Profile picture uploaded successfully" };
    } else {
      return { message: "", error: "Failed to upload profile picture" };
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { message: "", error: error.response.data.message || "An error occurred while uploading the profile picture" };
      } else if (error.request) {
        // The request was made but no response was received
        return { message: "", error: "No response received from server" };
      } else {
        // Something happened in setting up the request that triggered an Error
        return { message: "", error: "Error in request setup" };
      }
    }
    return { message: "", error: 'An unexpected error occurred while uploading the profile picture' };
  }
}


export async function CreateProfile(state: { message: string }, formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { message: "Authentication failed. Please sign in again." };
    }

    const profile = FormProfile.parse({
      first_name: formData.get('firstname'),
      last_name: formData.get('lastname'),
      address: formData.get('address'),
      email: formData.get('email'),
      role_name: formData.get('jobTitle'), // Using jobTitle as role_name
      phone_number: formData.get('phoneNumber'),
      githubUrl: formData.get('githubUrl'),
      linkedinUrl: formData.get('linkedinUrl'),
      about: formData.get('about')
    });

    const profile2 = { ...profile, username: `${profile.first_name} ${profile.last_name}` };

    // @ts-ignore
    const response = await axios.put(`${baseurl}/api/user-profile/update-name-role/${session.user.userId}`, profile2);
    console.log("the responser", response)
    // @ts-ignore
    if (response?.data?.userId === session?.user?.userId) {
      return { message: "Profile created successfully" };
    } else {
      return { message: "Failed to create profile. Please try again." };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { message: `Error: ${error.response.data.message || 'An unexpected error occurred'}` };
      } else if (error.request) {
        // The request was made but no response was received
        return { message: "No response received from server. Please try again." };
      } else {
        // Something happened in setting up the request that triggered an Error
        return { message: `Error: ${error.message}` };
      }
    }
    return { message: "An unexpected error occurred. Please try again." };
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
    console.log("education content", response)
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
    console.log("response from create experience", response);
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
  description: formData.get("jobDescription"),
  location: formData.get("jobLocation"),
  category: formData.get("jobCategory"),
  minSalary: Number(formData.get("salaryMin")),
  maxSalary: Number(formData.get("salaryMax")),
  companyWebsiteLink: formData.get("applicationReceiver"),
  jobType: formData.get("jobType"),
  jobLevel: formData.get("jobLevel"),
  education: formData.get("education"),
  receivingMethod: formData.get("applicationMethod"),
  employer: {
    id: 46,
  },
  expirationDate: formData.get("expirationDate")+"T15:30:00"
  // experience: formData.get("experience")
  })
  try {
    // @ts-ignore
    const response = await axios.post(`${baseurl}/techihub/save`, experiencepost).then(response => response.data).catch(error => error)
    console.log("post", response);
    if(response === ''){
      return {message: 'session timeout', statuscode: response.statusCode}
    }
    
    return {message: `Congratulations succesfuly created education fill in to create more`, statuscode: response.statusCode}
  
  } catch (error) {
    return {message: `Error encountered ${error}`, statuscode: 403}
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