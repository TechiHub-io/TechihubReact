"use client";
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
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div
          className="w-full mx-auto bg-white rounded-lg shadow-lg text-center"
          style={{ maxWidth: "767px", padding: "2rem" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Sorry, we could not confirm your email. Please sign in again to
            receive a confirmation email.
          </h1>

          <a
            className="text-black text-base mb-8 underline hover:opacity-80"
            href="/sign-up"
          >
            Sign In here
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div
        className="w-full mx-auto bg-white rounded-lg shadow-lg text-center"
        style={{ maxWidth: "767px", padding: "2rem" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Successfully confirmed your email.
        </h1>

        <a
          className="text-black text-base mb-8 underline hover:opacity-80"
          href="/sign-in"
        >
          Login here
        </a>
      </div>
    </div>
  );
};

export default Confirm;
