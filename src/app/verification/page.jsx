import Link from 'next/link'
import React from 'react'

const verification = () => {
  return (
    <main>
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
          <div className="w-full mx-auto bg-white rounded-lg shadow-lg text-center" style={{maxWidth: '767px', padding:"2rem"}}>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Account Verification</h1>
            <p className="text-base mb-8">
              ✨ Almost There! ✨ We've just sent a verification link to your email address
              (example@gmail.com). Please click on the link to verify your email and activate your account.
            </p>
          </div>
        </div>
    </main>
  )
}

export default verification
