'use client'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
function FavouriteJobs() {
  const {data:session}= useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    }
  })
  const route = useRouter();
  useEffect(() => {
    const callout = () => {
      // @ts-ignore
      if(session?.user?.role === "EMPLOYER") {
      route.push("/e-dashboard");
      //  redirect("/e-dashboard'");
      }
    }
    callout();
  })
  return (
    <div>
      Favourite
    </div>
  )
}

export default FavouriteJobs