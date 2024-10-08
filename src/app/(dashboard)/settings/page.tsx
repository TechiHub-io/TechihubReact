'use client'
import React, { useEffect } from 'react'
import Multistepa from './(components)/Multistep';
import {motion} from 'framer-motion'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
const Settings = () => {
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
    <div className="flex ">
      <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className='w-full'
        >
      <Multistepa />
      </motion.div>
    </div>
  )
}

export default Settings;