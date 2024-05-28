'use server'
import { Signupschema } from '@/libs/forms/PostSchema';
import axios from 'axios';

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