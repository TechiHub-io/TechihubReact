'use client'
import React from 'react'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


function SavedCandidate() {
  const url = '/techihub/list';
  const {data: session} = useSession({
    required: true,
    onUnauthenticated(){
      redirect("/api/auth/signin?callbackUrl=/e-dashboard")
    }
  }
  );
  
  
  const callout = () => {
    // @ts-ignore
    if(session?.user?.role !== "EMPLOYER") {
     redirect('/');
    }
  }
  setTimeout(() => {
    callout();
  }, 2000)
  return (
    <div>SavedCandidate</div>
  )
}

export default SavedCandidate