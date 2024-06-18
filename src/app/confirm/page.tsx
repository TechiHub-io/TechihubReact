'use client'
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Swrgetdat } from "@/libs/hooks/Swrgetdat";

const Confirm = () => {
  // Wrap useSearchParams in Suspense
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ConfirmContent />
    </Suspense>
  );
};

const ConfirmContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const url = `/api/users/confirm?token=${token}`;
  const { data, error, isLoading } = Swrgetdat(url);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center flex-col gap-16 items-center">
        <h1 className="text-32 text-black">
          Sorry, we could not confirm your email. Please sign in again to receive a confirmation email.
        </h1>
        <a className="text-black text-18 underline hover:opacity-80" href="/sign-up">
          Sign In here
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col gap-16 items-center">
      <h1 className="text-32 text-black">
        Successfully confirmed your email.
      </h1>
      <a className="text-black text-18 underline hover:opacity-80" href="/sign-in">
        Login here
      </a>
    </div>
  );
};

export default Confirm;
