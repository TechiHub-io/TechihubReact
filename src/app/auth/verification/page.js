// src/app/auth/verification/page.js
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/hooks/useZustandStore";

const VerificationPage = () => {
  const { verificationEmail, error, loading } = useStore((state) => ({
    verificationEmail: state.verificationEmail,
    error: state.error,
    loading: state.loading,
  }));

  const [resendStatus, setResendStatus] = useState("idle"); // idle, loading, success, error
  const [resendMessage, setResendMessage] = useState("");

  const handleResendVerification = async () => {
    if (loading || !verificationEmail) return;

    setResendStatus("loading");

    try {
      // We'll implement resend verification logic (API call)
      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/resend-verification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendStatus("success");
        setResendMessage(
          "Verification email has been resent. Please check your inbox."
        );
      } else {
        setResendStatus("error");
        setResendMessage(
          data.message ||
            "Failed to resend verification email. Please try again."
        );
      }
    } catch (error) {
      setResendStatus("error");
      setResendMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <img
            src="/images/blogs/logoa.webp"
            className="mx-auto w-[100px]"
            alt="TechHub Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-md text-gray-600">
            We've sent a verification link to{" "}
            {verificationEmail ? (
              <span className="font-semibold">{verificationEmail}</span>
            ) : (
              "your email address"
            )}
            . Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            <span className="font-bold">Note:</span> If you don't see the email
            in your inbox, please check your spam or junk folder.
          </p>
        </div>

        {resendStatus === "success" && (
          <div className="mt-4 bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-700">{resendMessage}</p>
          </div>
        )}

        {resendStatus === "error" && (
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{resendMessage}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm text-gray-500 text-center">
            Didn't receive an email?
            <button
              onClick={handleResendVerification}
              disabled={loading || resendStatus === "loading"}
              className="ml-1 text-[#0CCE68] hover:text-[#364187] font-medium focus:outline-none disabled:opacity-50"
            >
              {resendStatus === "loading"
                ? "Sending..."
                : "Resend verification email"}
            </button>
          </p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#364187] transition-colors duration-200 ease-in-out"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default VerificationPage;
