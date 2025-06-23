// src/app/auth/reset-password/[token]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/hooks/useZustandStore";
import { Check, X, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = ({ params }) => {
  const { resetPassword, loading, error, clearError } = useStore((state) => ({
    resetPassword: state.resetPassword,
    loading: state.loading,
    error: state.error,
    clearError: state.clearError,
  }));

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { token } = params;

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const passwordRequirements = [
    {
      check: formData.password.length >= 8,
      text: "At least 8 characters long",
    },
    {
      check: /[A-Z]/.test(formData.password),
      text: "Contains uppercase letter",
    },
    {
      check: /[a-z]/.test(formData.password),
      text: "Contains lowercase letter",
    },
    { check: /\d/.test(formData.password), text: "Contains number" },
    {
      check: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      text: "Contains special character",
    },
    {
      check: formData.password === formData.confirmPassword,
      text: "Passwords match",
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.check);

  const validateForm = () => {
    const errors = {};

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!allRequirementsMet) {
      errors.password = "Password does not meet all requirements";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear global error when user types
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(token, formData.password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      // Error is handled by the store and displayed below
      setSuccess(false);
    }
  };

  const PasswordRequirement = ({ isMet, text }) => (
    <div className="flex items-center space-x-2">
      {isMet ? (
        <Check className="text-green-500 h-4 w-4" />
      ) : (
        <X className="text-red-500 h-4 w-4" />
      )}
      <span className={`text-sm ${isMet ? "text-green-500" : "text-red-500"}`}>
        {text}
      </span>
    </div>
  );

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
            Create a new password for your account.
          </p>
        </div>

        {success && (
          <div className="mt-4 bg-green-50 p-4 rounded-md">
            <div className="flex justify-center mb-4">
              <div className="rounded-full h-16 w-16 flex items-center justify-center bg-green-100">
                <svg
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-700 text-center">
              Your password has been reset successfully!
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Redirecting to login page...
            </p>
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
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] sm:text-sm`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    validationErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] sm:text-sm`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Password Requirements:
              </h3>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <PasswordRequirement
                    key={index}
                    isMet={req.check}
                    text={req.text}
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#364187] focus:outline-none transition-colors duration-200 ease-in-out"
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
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}

        {!success && (
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
        )}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
