// src/components/layout/Navbar.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useZustandStore";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Bell,
  MessageSquare,
  Shield,
  Briefcase,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, isEmployer, user, logout } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer,
    user: state.user,
    logout: state.logout,
  }));

  const { isAdmin, hasAccessibleCompanies } = useAdminAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white shadow">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">TechHub</span>
            <img
              className="h-8 w-auto"
              src="/images/blogs/logoa.webp"
              alt="TechHub"
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/jobs"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
          >
            Find Jobs
          </Link>

          {isEmployer && (
            <Link
              href="/post-job"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
            >
              Post a Job
            </Link>
          )}

          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>

              {adminMenuOpen && (
                <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Admin Actions
                  </div>
                  
                  <Link
                    href="/admin/post-job"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <Briefcase className="mr-3 h-4 w-4" />
                    Post Job for Company
                  </Link>

                  <Link
                    href="/admin/manage-jobs"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Manage Posted Jobs
                  </Link>

                  {!hasAccessibleCompanies && (
                    <div className="px-4 py-2 text-xs text-amber-600 bg-amber-50 border-t border-amber-200">
                      No company access granted
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Link
            href="/companies"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
          >
            Companies
          </Link>

          <Link
            href="/resources"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
          >
            Resources
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/messages"
                className="text-gray-500 hover:text-[#0CCE68]"
              >
                <MessageSquare className="h-6 w-6" />
              </Link>

              <Link
                href="/notifications"
                className="text-gray-500 hover:text-[#0CCE68]"
              >
                <Bell className="h-6 w-6" />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <span>{user?.first_name || "Account"}</span>
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user?.email}
                      </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <Link
                      href={
                        isEmployer
                          ? "/dashboard/employer"
                          : "/dashboard/jobseeker"
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>

                    <div className="border-t border-gray-100"></div>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0CCE68]"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-[#0CCE68] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#364187] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0CCE68]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">TechHub</span>
                <img
                  className="h-8 w-auto"
                  src="/images/blogs/logoa.webp"
                  alt="TechHub"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    href="/jobs"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>

                  {isEmployer && (
                    <Link
                      href="/post-job"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post a Job
                    </Link>
                  )}

                  {isAdmin && (
                    <>
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Admin Actions
                      </div>
                      
                      <Link
                        href="/admin/post-job"
                        className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Briefcase className="mr-3 h-5 w-5" />
                        Post Job for Company
                      </Link>

                      <Link
                        href="/admin/manage-jobs"
                        className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Manage Posted Jobs
                      </Link>

                      {!hasAccessibleCompanies && (
                        <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 rounded-lg mx-3">
                          No company access granted
                        </div>
                      )}
                    </>
                  )}

                  <Link
                    href="/companies"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Companies
                  </Link>

                  <Link
                    href="/resources"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Resources
                  </Link>
                </div>

                <div className="py-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={
                          isEmployer
                            ? "/dashboard/employer"
                            : "/dashboard/jobseeker"
                        }
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/messages"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Messages
                      </Link>

                      <Link
                        href="/notifications"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Notifications
                      </Link>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>

                      <Link
                        href="/auth/register"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
