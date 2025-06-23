// src/app/auth/forgot-password/page.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/hooks/useZustandStore";

const ForgotPasswordPage = () => {
  const { requestPasswordReset, loading, error, clearError } = useStore(
    (state) => ({
      requestPasswordReset: state.requestPasswordReset,
      loading: state.loading,
      error: state.error,
      clearError: state.clearError,
    })
  );

  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateEmail = () => {
    if (!email) {
      setValidationError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Email is invalid");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);

    // Clear validation error when user types
    if (validationError) {
      setValidationError("");
    }

    // Clear global error when user types
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccess(true);
      setSuccessMessage(
        "Password reset link sent to your email! Please check your inbox."
      );
    } catch (error) {
      // Error is handled by the store and displayed below
      setSuccess(false);
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
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {success && (
          <div className="mt-4 bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {error && !success && (
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!success && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationError ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] sm:text-sm`}
                  placeholder="Enter your email"
                />
                {validationError && (
                  <p className="mt-1 text-sm text-red-600">{validationError}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#364187] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] transition-colors duration-200 ease-in-out"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            <Link
              href="/auth/login"
              className="font-medium text-[#0CCE68] hover:text-[#364187]"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
