// src/app/auth/register/jobseeker/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/hooks/useZustandStore";
import { Check, X, Eye, EyeOff, ArrowLeft, User, Briefcase, Target, TrendingUp, Code, Zap } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

const JobseekerRegisterPage = () => {
  const { register, loading, error, clearError, isDarkMode } = useStore((state) => ({
    register: state.register,
    loading: state.loading,
    error: state.error,
    clearError: state.clearError,
    isDarkMode: state.isDarkMode,
  }));

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const router = useRouter();

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
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!allRequirementsMet) {
      errors.password = "Password does not meet all requirements";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (!formTouched) setFormTouched(true);

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

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
      const userData = {
        ...formData,
        isEmployer: false,
      };
      await register(userData);
      router.push("/auth/verification");
    } catch (err) {
      if (err.message && err.message.includes("This field must be unique")) {
        setValidationErrors((prev) => ({
          ...prev,
          email:
            "This email is already registered. Please use a different email or try to login.",
        }));
      } else {
        console.error("Registration failed:", err);
      }
    }
  };

  const PasswordRequirement = ({ isMet, text }) => (
    <div className="flex items-center space-x-2">
      {isMet ? (
        <Check className="text-green-500 dark:text-green-400 h-4 w-4" />
      ) : (
        <X className="text-red-500 dark:text-red-400 h-4 w-4" />
      )}
      <span className={`text-sm ${isMet ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {text}
      </span>
    </div>
  );

  const handleSocialSuccess = () => {
  };

  const handleSocialError = (error) => {
    console.error("Social login error:", error);
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 right-1/2 w-80 h-80 bg-[#364187]/10 dark:bg-[#364187]/5 rounded-full blur-3xl"></div>
        </div>

        <main className="relative flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-6 lg:p-8">
            <Link href="/auth/register" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to options
            </Link>
            <img
              
              onClick={() => router.push('/')}
              src="/images/blogs/logoa.webp"
              className="w-16 lg:w-20 cursor-pointer"
              alt="TechHub Logo"
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-center justify-center px-6 lg:px-8">
            <div className="flex w-full max-w-6xl mx-auto gap-12">
              {/* Form Section */}
              <div className="flex-1 max-w-md mx-auto lg:mx-0">
                {/* Header */}
                <div className="text-center lg:text-left mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-[#0CCE68] rounded-2xl mb-4 lg:mx-0 mx-auto">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Launch Your Tech Career
                  </h1>
                </div>

                {/* Quick Start with Social Auth */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                    Quick Start - Sign up with:
                  </h3>
                  <SocialAuthButtons onSuccess={handleSocialSuccess} onError={handleSocialError} />
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-blue-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      Or create your account
                    </span>
                  </div>
                </div>

                {/* Global Error */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
                    <span className="block">{error}</span>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Personalized matches</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>Career growth</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span>Tech-focused</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Fast applications</span>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 ${
                          validationErrors.firstName
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                        placeholder="Alex"
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 ${
                          validationErrors.lastName
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                        placeholder="Johnson"
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 ${
                        validationErrors.email
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                      placeholder="alex@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 ${
                          validationErrors.password
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 ${
                          validationErrors.confirmPassword
                            ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  {formTouched && formData.password && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
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
                  )}

                  {/* Terms */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-500 hover:text-[#0CCE68] font-medium transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-500 hover:text-[#0CCE68] font-medium transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {validationErrors.agreeToTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {validationErrors.agreeToTerms}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-[#0CCE68] text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-[#0CCE68] hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Create Your Account"
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-semibold text-blue-500 hover:text-[#0CCE68] transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Image Section - Hidden on mobile */}
              <div className="hidden lg:flex flex-1 items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-[#0CCE68]/20 rounded-3xl transform -rotate-3"></div>
                  <img
                    src="/images/blogs/signc.webp"
                    className="relative w-full  max-w-lg h-auto object-cover rounded-3xl shadow-2xl"
                    alt="Job seeker success illustration"
                  />
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#0CCE68] rounded-full flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
};

export default JobseekerRegisterPage;