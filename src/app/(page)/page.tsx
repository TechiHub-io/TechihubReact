'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
export default function TheHome() {
  const {data: session} = useSession({
    required: true,
    onUnauthenticated(){
      redirect("/home")
    }
  }
  );
  const callout = () => {
    // @ts-ignore
    if(session?.user?.role !== "EMPLOYER") {
     redirect('/e-dashboard');
    }
  }
  setTimeout(() => {
    callout();
  }, 2000)
  // @ts-ignore
  const employer = session?.user?.role
  return (
    <main className='flex min-h-screen flex-col items-center justify-between relative '>
      {
        employer === "EMPLOYEE" ? redirect('/dashboard') : redirect('/e-dashboard')
      }
    </main>
  );
}
