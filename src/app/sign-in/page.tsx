import Signin from '@/(components)/authentication/sign-in'
import React from 'react';
import { auth } from '../../../auth';
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await auth();
  if(session){
    redirect('/dashboard')
  }
 
  return (
    <div>
      <Signin />
    </div>
  )
}

export default page