// src/app/companies/select/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useZustandStore";
import Cookies from "js-cookie";

export default function CompanySelectionPage() {
  const router = useRouter();
  const { companies, switchCompany, isAuthenticated } = useStore((state) => ({
    companies: state.companies || [],
    switchCompany: state.switchCompany,
    isAuthenticated: state.isAuthenticated,
  }));

  const [loading, setLoading] = useState(true);
  const [pageCompanies, setPageCompanies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchCompaniesIfNeeded = async () => {
      try {
        // Check if we have multiple companies
        const hasMultipleCompanies =
          Cookies.get("has_multiple_companies") === "true";
        const hasCompany = Cookies.get("has_company") === "true";
        const isEmployer = Cookies.get("user_role") === "employer";

        if (!isEmployer) {
          // Not an employer, redirect to jobseeker dashboard
          router.push("/dashboard/jobseeker");
          return;
        }

        if (!hasCompany) {
          // No company, redirect to setup
          router.push("/company/setup");
          return;
        }

        if (!hasMultipleCompanies) {
          // Only one company, redirect to dashboard
          router.push("/dashboard/employer");
          return;
        }

        // If we have companies in the store, use them
        if (companies && companies.length > 1) {
          setPageCompanies(companies);
          setLoading(false);
          return;
        }

        // Otherwise fetch directly from API
        const token = Cookies.get("auth_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const API_URL =
          process.env.NEXT_PUBLIC_API_FRONT_URL ||
          "http://localhost:8000/api/v1";
        const response = await fetch(`${API_URL}/companies/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const fetchedCompanies = await response.json();
        if (Array.isArray(fetchedCompanies) && fetchedCompanies.length > 0) {
          setPageCompanies(fetchedCompanies);

          // Also update the store
          if (switchCompany && typeof switchCompany === "function") {
            switchCompany(fetchedCompanies[0].id);
          }
        } else {
          // No companies found, redirect to setup
          Cookies.set("has_company", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
          router.push("/company/setup");
          return;
        }
      } catch (err) {
        console.error("Error in company selection:", err);
        setError(err.message || "Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesIfNeeded();
  }, [router, companies, switchCompany, isAuthenticated]);

  const handleSelectCompany = (companyId) => {
    // Set the selected company as active
    if (switchCompany && typeof switchCompany === "function") {
      switchCompany(companyId);
    }

    // Update cookie
    Cookies.set("company_id", companyId, {
      expires: 7,
      sameSite: "strict",
      path: "/",
    });

    // Redirect to employer dashboard
    router.push("/dashboard/employer");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 bg-[#0CCE68] text-white rounded-md"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Select a Company
      </h1>
      <p className="text-gray-600 text-center mb-12">
        You have multiple companies. Please select one to continue.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pageCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:border-[#0CCE68] transition-colors cursor-pointer"
            onClick={() => handleSelectCompany(company.id)}
          >
            <div className="flex justify-center p-4 h-32 bg-gray-50">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {company.name}
              </h3>
              <p className="text-sm text-gray-600">{company.industry}</p>
              <p className="text-sm text-gray-600">{company.location}</p>

              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-[#0CCE68] text-white rounded-md text-sm hover:bg-[#0BBE58]">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
