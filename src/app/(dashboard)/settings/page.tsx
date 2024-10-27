'use client'
import React, { useEffect, useState } from 'react'
import Multistepa from './(components)/Multistep';
import {motion} from 'framer-motion'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import BlueHeader from '@/(components)/shared/BlueHeader';
import BouncingCirclesLoader from '@/components/animations/BouncingCircleLoader';
const Settings = () => {
  const {data:session, status} = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    }
  })
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const callout = () => {
      // @ts-ignore
      if(session?.user?.role === "EMPLOYER") {
        route.push("/e-dashboard");
      }
      setIsLoading(false);
    }

    if (status === 'authenticated') {
      callout();
    }
  }, [session, status])

  if (isLoading) {
    return <div><BouncingCirclesLoader /></div>;
  }

  return (
    <div className="flex">
      <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className='w-full'
        >
          <BlueHeader />
      <Multistepa />
      </motion.div>
    </div>
  )
}

export default Settings;