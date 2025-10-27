// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get auth token and user info from cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;
  const userRole = request.cookies.get('user_role')?.value;
  const isEmployer = userRole === 'employer';
  const isJobSeeker = userRole === 'jobseeker';
  const isSuperAdmin = userRole === 'super_admin';
  

  
  // Profile setup status
  const hasCompletedProfile = request.cookies.get('has_completed_profile')?.value === 'true';
  const isInProfileSetup = request.nextUrl.pathname.startsWith('/profile/setup');
  

  
  // Company-related cookies (for employers)
  const hasCompany = request.cookies.get('has_company')?.value === 'true';
  const hasMultipleCompanies = request.cookies.get('has_multiple_companies')?.value === 'true';
  const companyId = request.cookies.get('company_id')?.value;
  const inSetupProcess = request.cookies.get('company_setup_step')?.value;
  
  // Get current path
  const { pathname } = request.nextUrl;
  
  // Helper function to check if path is a public job-related route
  const isPublicJobRoute = (path) => {
    // Basic jobs routes
    if (path === '/jobs' || path.startsWith('/jobs/')) {
      // Exclude protected employer routes
      if (path.startsWith('/jobs/create') || 
          path.startsWith('/jobs/manage') || 
          path.startsWith('/jobs/edit/')) {
        return false;
      }
      
      // Exclude job application routes for employers (these need auth)
      if (path.includes('/apply')) {
        return true; // Allow but will be handled by role-based checks later
      }
      
      return true; // All other /jobs/* routes are public
    }
    
    return false;
  };
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/jobs/*', // Basic jobs page
    '/services',
    '/terms',
    '/privacy',
    '/contact',
    '/auth/login', 
    '/auth/register',
    '/auth/register/employer',
    '/auth/register/jobseeker',
    '/auth/forgot-password',
    '/auth/verification',
    '/auth/verify'
  ];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(pathname) || isPublicJobRoute(pathname);
  
  // Check if the path is a password reset path
  const isPasswordResetPath = pathname === '/auth/reset-password' || 
                              pathname.startsWith('/auth/reset-password/');

  // Check if the path is an email verification path
  const isEmailVerificationPath = pathname === '/auth/verify' || 
                                  pathname.startsWith('/auth/verify/');

  // Session validation - if user has token but no role, force logout
  if (token && !userRole) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    
    // Clear all auth cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_role');
    response.cookies.delete('has_company');
    response.cookies.delete('company_id');
    response.cookies.delete('has_completed_profile');
    
    return response;
  }

  // Authentication checks - allow public routes and API routes
  if (!isAuthenticated && !isPublicRoute && 
      !pathname.startsWith('/api/') && !isPasswordResetPath && !isEmailVerificationPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If authenticated on pure auth routes, redirect to appropriate dashboard
  const pureAuthRoutes = [
    '/auth/login', 
    '/auth/register',
    '/auth/register/employer',
    '/auth/register/jobseeker'
  ];
  
  if (isAuthenticated && (pureAuthRoutes.includes(pathname) || isPasswordResetPath || isEmailVerificationPath)) {
    
    if (isSuperAdmin) {
      // Super admin users go directly to admin dashboard

      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (isEmployer) {
      // Special handling for company setup in progress
      if (inSetupProcess && pathname !== '/company/setup') {
        return NextResponse.redirect(new URL('/company/setup', request.url));
      }
      
      if (hasMultipleCompanies && pathname !== '/companies/select') {
        return NextResponse.redirect(new URL('/companies/select', request.url));
      } else if (hasCompany && companyId && !inSetupProcess) {
        return NextResponse.redirect(new URL('/dashboard/employer', request.url));
      } else if (!hasCompany && pathname !== '/company/setup') {
        return NextResponse.redirect(new URL('/company/setup', request.url));
      }
    } else if (isJobSeeker) {
      if (!hasCompletedProfile && !isInProfileSetup) {
        return NextResponse.redirect(new URL('/profile/setup', request.url));
      } else if (hasCompletedProfile) {
        return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
      }
    }
  }
  
  // Handle company selection for employers with multiple companies
  if (isAuthenticated && isEmployer && hasMultipleCompanies && 
      !pathname.startsWith('/companies/select') && 
      !pathname.startsWith('/api/') && 
      pathname !== '/company/setup') {
    
    // Allow access to dashboard pages, company edit pages, and other specific routes
    const allowedPaths = [
      pathname.startsWith('/dashboard/employer'),
      pathname.startsWith('/dashboard/admin'),
      pathname.startsWith('/company/') && pathname.includes('/edit'),
      pathname.startsWith('/jobs/') && (pathname.includes('/create') || pathname.includes('/manage') || pathname.includes('/edit')),
      pathname.startsWith('/applications/')
    ];
    
    // If path is allowed and user has selected a company, continue
    if (companyId && allowedPaths.some(allowed => allowed)) {
      return NextResponse.next();
    }
    
    // Otherwise redirect to company selection
    return NextResponse.redirect(new URL('/companies/select', request.url));
  }

  // Special handling for company setup in progress
  if (isAuthenticated && isEmployer && inSetupProcess && 
      pathname !== '/company/setup' && 
      !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/company/setup', request.url));
  }

  // Super admins should never be on profile setup - redirect them to admin dashboard
  if (isAuthenticated && isSuperAdmin && isInProfileSetup) {

    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  // Super admins should go to admin dashboard from root dashboard
  if (isAuthenticated && isSuperAdmin && pathname === '/dashboard') {

    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  // Enhanced job seeker profile setup check (skip for super admin)
  if (isAuthenticated && isJobSeeker && !isSuperAdmin && !hasCompletedProfile && 
      !isInProfileSetup && !pathname.startsWith('/api/') && !isPublicJobRoute(pathname)) {

    return NextResponse.redirect(new URL('/profile/setup', request.url));
  }

  // Prevent access to company/setup when the user has a company
  if (isAuthenticated && isEmployer && pathname === '/company/setup') {
    const hasCompany = request.cookies.get('has_company')?.value === 'true';
    const companyId = request.cookies.get('company_id')?.value;
    const setupStep = request.cookies.get('company_setup_step')?.value;
    
    if (hasCompany && companyId && setupStep === '1') {
      const response = NextResponse.redirect(new URL('/dashboard/employer', request.url));
      response.cookies.delete('company_setup_step');
      return response;
    }
  }

  // Company setup checking for employers
  if (isAuthenticated && isEmployer && !hasCompany && 
      pathname !== '/company/setup' && 
      !pathname.startsWith('/api/') &&
      !isPublicJobRoute(pathname)) {
    return NextResponse.redirect(new URL('/company/setup', request.url));
  }
  
  // Role-based access control
  if (isAuthenticated) {
    // Super admin has access to all routes
    if (isSuperAdmin) {

      return NextResponse.next();
    }
    
    // Restrict employer routes to employers
    if (pathname.startsWith('/dashboard/employer') && !isEmployer) {
      return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
    }
    
    // Restrict jobseeker routes to jobseekers  
    if (pathname.startsWith('/dashboard/jobseeker') && isEmployer) {
      return NextResponse.redirect(new URL('/dashboard/employer', request.url));
    }
    
    // Restrict company management routes to employers
    if ((pathname.startsWith('/company/') || pathname.startsWith('/companies/')) && !isEmployer) {
      return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
    }
    
    // Job creation/management routes
    if (pathname.startsWith('/jobs/create') || pathname.startsWith('/jobs/edit/')) {
      // These are for employers and super admins
      if (!isEmployer && !isSuperAdmin) {
        return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
      }
    }
    
    // /jobs/manage is specifically for employers only - redirect super admins to admin dashboard
    if (pathname.startsWith('/jobs/manage')) {
      if (isSuperAdmin) {

        return NextResponse.redirect(new URL('/dashboard/admin?tab=jobs', request.url));
      }
      if (!isEmployer) {
        return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
      }
    }
    
    // Job application is only for job seekers
    if (pathname.includes('/jobs/') && pathname.includes('/apply') && (isEmployer || isSuperAdmin)) {
      return NextResponse.redirect(new URL('/dashboard/employer', request.url));
    }
    
    // Admin routes are only for super admins
    if (pathname.startsWith('/admin/') && !isSuperAdmin) {

      if (isEmployer) {
        return NextResponse.redirect(new URL('/dashboard/employer', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
      }
    }
    
    // Admin dashboard is only for super admins
    if (pathname.startsWith('/dashboard/admin') && !isSuperAdmin) {

      if (isEmployer) {
        return NextResponse.redirect(new URL('/dashboard/employer', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/jobseeker', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.\\w+$|api/).*)',
  ],
};