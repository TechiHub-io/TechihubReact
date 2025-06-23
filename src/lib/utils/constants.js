// src/lib/constants.js
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  COMMUNITY: "/community",
  TERMS: "/terms",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify/:token",
  DASHBOARD: "/dashboard",
  EMPLOYER_DASHBOARD: "/dashboard/employer",
  JOBSEEKER_DASHBOARD: "/dashboard/jobseeker",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_VIEW: "/profile/:id",
  COMPANY_CREATE: "/company/create",
  COMPANY_VIEW: "/company/:id",
  COMPANY_EDIT: "/company/:id/edit",
  COMPANY_PROFILE: "/company/profile",
  JOBS: "/jobs",
  JOB_CREATE: "/jobs/create",
  JOB_VIEW: "/jobs/:id",
  JOB_EDIT: "/jobs/:id/edit",
  JOB_APPLY: "/jobs/:id/apply",
  APPLICATIONS: "/applications",
  APPLICATION_VIEW: "/applications/:id",
  MESSAGES: "/messages",
  CONVERSATION: "/messages/:id",
  SETTINGS: "/settings",
};

export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "executive", label: "Executive Level" },
];

export const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "none", label: "No Education Requirement" },
];

export const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001+", label: "1001+ employees" },
];

export const APPLICATION_STATUSES = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "assessment", label: "Assessment" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const DEGREE_TYPES = [
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "masters", label: "Masters" },
  { value: "doctorate", label: "Doctorate" },
  { value: "other", label: "Other" },
];

export const NOTIFICATION_TYPES = [
  { value: "application_status", label: "Application Status Update" },
  { value: "new_application", label: "New Application" },
  { value: "profile_view", label: "Profile View" },
  { value: "new_message", label: "New Message" },
  { value: "job_recommendation", label: "Job Recommendation" },
  { value: "company_update", label: "Company Update" },
  { value: "job_expiry", label: "Job Expiry" },
  { value: "account_update", label: "Account Update" },
  { value: "system", label: "System Notification" },
];

export const CURRENCIES = [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "GBP", label: "GBP", symbol: "£" },
  { value: "JPY", label: "JPY", symbol: "¥" },
  { value: "AUD", label: "AUD", symbol: "A$" },
  { value: "CAD", label: "CAD", symbol: "C$" },
];

export const COLORS = {
  primary: "#0CCE68",
  secondary: "#364187",
  accent: "#88FF99",
  white: "#FFFFFF",
  black: "#000000",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const SETTINGS = {
  APP_NAME: "TechHub",
  APP_DESCRIPTION: "Your gateway to professional opportunities",
  API_URL:
    process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1",
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 1 * 1024 * 1024, // 1MB
  ALLOWED_FILE_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  TOKEN_KEY: "auth_token",
  THEME_KEY: "theme",
};
