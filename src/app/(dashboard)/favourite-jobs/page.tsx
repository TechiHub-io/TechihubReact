'use client'
import React from 'react'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
function FavouriteJobs() {
  const {data:session}= useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    }
  })
  return (
    <div>
      Favourite
    </div>
  )
}

export default FavouriteJobs