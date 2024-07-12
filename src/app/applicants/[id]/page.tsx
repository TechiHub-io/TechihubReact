'use client';
import Bgbutton from '@/(components)/shared/Bgbutton';
import { Skeleton } from '@/(components)/ui/skeleton';
import axios from 'axios';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Applicants({ params }: Readonly<{ params: { id: number } }>) {
 
  const url = `/api/applications/job/${params.id}`;
  const {data: session} = useSession({
    required: true
  });

  // const route = useRouter()
  // useEffect(() => {
  //   const callout = () => {
  //     // @ts-ignore
  //     if(session?.user?.role === "EMPLOYER") {
  //     route.push("/e-dashboard");
  //     //  redirect("/e-dashboard'");
  //     }
  //   }
  //   callout();
  // })

  const { data, error, isLoading } = Swrgetdat3(url);
  if (isLoading) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className='max-w-[1330px] mx-auto w-[90%]'>
        <h1 className='text-xl lg:text-2xl text-center'>Coming Soon</h1>
    </main>
  );
}

export default Applicants;

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.data.Applications);
const baseUrl = 'https://techihubjobsproject.azurewebsites.net';
function Swrgetdat3(url: string) {
  const { data, error, isLoading } = useSWR(`${baseUrl}${url}`, fetcher); //, {refreshInterval: 3000}
  return {
    data: data,
    isLoading,
    error: error,
  };
}
