'use client'
import React from 'react'
import Multistep from './(components)/Multistepa';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
const Settings = () => {
  const {data:session}= useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    }
  })
  return (
    <div className="flex max-w-[1024px]">
      <Multistep />
    </div>
  )
}

export default Settings;