# TechHub Frontend

A modern, responsive frontend application for the TechHub recruitment platform built with Next.js 14, Tailwind CSS, and Zustand.

## Features

- 🔐 Authentication with JWT and Social Login
- 👤 User profiles (Job Seekers & Employers)
- 💼 Job posting and application management
- 🏢 Company profiles and management
- 💬 Real-time messaging system
- 📊 Analytics dashboard
- 🌙 Dark mode support
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand with slice pattern
- **API Client:** Axios
- **Authentication:** JWT with social login support

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API
├── store/              # Zustand store with slices
├── styles/             # Global styles and theme
└── types/              # JavaScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/techhub-frontend.git
cd techhub-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Key Features

### Authentication
- Email/password login
- Social login (Google, LinkedIn)
- Email verification
- Password reset

### Job Seeker Features
- Profile management
- Job search and filtering
- Job applications
- Application tracking
- Company reviews

### Employer Features
- Company profile management
- Job posting
- Application management
- Team member management
- Analytics dashboard

### Common Features
- Real-time messaging
- Notifications
- Dark mode
- Mobile-responsive design

## Folder Structure Details

### Store Structure
The application uses Zustand with a slice pattern:
- `authSlice` - Authentication state
- `profileSlice` - User profile management
- `jobsSlice` - Job listings and management
- `applicationsSlice` - Application tracking
- `companySlice` - Company management
- `messagesSlice` - Messaging system
- `uiSlice` - UI state (modals, notifications)
- `themeSlice` - Theme management (dark/light)

### API Structure
The `lib/api` directory contains modules for each API resource:
- `auth.js` - Authentication endpoints
- `profiles.js` - Profile management
- `jobs.js` - Job-related endpoints
- `companies.js` - Company management
- `applications.js` - Application handling
- `messages.js` - Messaging endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Zustand for simple yet powerful state management



# User stories

## User Authentication Flow

### User Registration
1. As a user, I want to choose between registering as a job seeker or an employer
2. As a job seeker, I want to create an account with my personal information to start applying for jobs
3. As an employer, I want to create an account with my business information to start posting jobs
4. As a user, I want to verify my email after registration
5. As a user, I want to reset my password if I forget it

### User Login
1. As a user, I want to log in to access my account
2. As a user, I want to use social authentication (Google, LinkedIn) to log in quickly
3. As a user, I want to stay logged in across sessions

## Job Seeker Flow

### Profile Management
1. As a job seeker, I want to create and edit my professional profile
2. As a job seeker, I want to add my work experience
3. As a job seeker, I want to add my education history
4. As a job seeker, I want to add my skills and proficiency levels
5. As a job seeker, I want to add certifications I've earned
6. As a job seeker, I want to add portfolio items to showcase my work
7. As a job seeker, I want to upload a profile picture

### Job Search & Application
1. As a job seeker, I want to search for jobs based on title, location, and other filters
2. As a job seeker, I want to see job recommendations based on my skills and profile
3. As a job seeker, I want to save jobs to apply to later
4. As a job seeker, I want to apply to jobs with my profile information
5. As a job seeker, I want to track my application status
6. As a job seeker, I want to withdraw applications if needed

### Dashboard
1. As a job seeker, I want to see a dashboard with my application statuses
2. As a job seeker, I want to see profile strength indicators and improvement tips
3. As a job seeker, I want to see which companies have viewed my profile
4. As a job seeker, I want to see job recommendations

## Employer Flow

### Company Setup
1. As an employer, I want to set up my company profile
2. As an employer, I want to add company benefits
3. As an employer, I want to upload a company logo
4. As an employer, I want to add company images to showcase our workplace
5. As an employer, I want to invite team members to manage our company account

### Job Management
1. As an employer, I want to post new job listings
2. As an employer, I want to specify job details like responsibilities, requirements, and benefits
3. As an employer, I want to add required skills for each job
4. As an employer, I want to activate/deactivate job listings
5. As an employer, I want to set up application questions for each job

### Application Management
1. As an employer, I want to view applications for my job postings
2. As an employer, I want to update application statuses
3. As an employer, I want to set up application stages for my company's hiring process
4. As an employer, I want to see application analytics

### Dashboard
1. As an employer, I want to see a dashboard with job performance metrics
2. As an employer, I want to see application statistics
3. As an employer, I want to see which job seekers have viewed my jobs

## Shared Flows

### Messaging
1. As a user, I want to send and receive messages
2. As a user, I want to be notified when I receive new messages
3. As a user, I want to mark messages as read

### Notifications
1. As a user, I want to receive notifications about important events
2. As a user, I want to control my notification preferences
3. As a user, I want to see unread notification counts
4. As a user, I want to mark notifications as read

### Settings
1. As a user, I want to change my password
2. As a user, I want to update my email address
3. As a user, I want to manage my account settings

Would you like me to elaborate on any specific flow or provide more detailed user stories for a particular section?

<!-- user stories and endpoints -->
I'll update the documentation to include example request bodies for the key endpoints in both user journeys. Due to the extensive number of endpoints, I'll focus on the most important ones for each feature.

# TechHub Platform Documentation

This documentation outlines the full user journeys and features available for both employers and job seekers on the TechHub recruitment platform, including example request bodies.

## 1. Employer User Journey & Features

### 1.1 Authentication & Account Management

#### Registration
Employers can register for an account, setting the `is_employer` flag to true.
- **Endpoint**: `/api/v1/auth/register/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "employer@example.com",
  "username": "employer",
  "password": "securepassword",
  "password2": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "is_employer": true
}
```

#### Login
- **Endpoint**: `/api/v1/auth/login/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "employer@example.com",
  "password": "securepassword"
}
```

#### Email Verification
After registration, employers need to verify their email.
- **Endpoint**: `/api/v1/auth/verify-email/`
- **Method**: POST
- **Request Body**:
```json
{
  "token": "verification-token-from-email"
}
```

#### Password Change
- **Endpoint**: `/api/v1/auth/password-change/`
- **Method**: POST
- **Request Body**:
```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword",
  "new_password2": "newpassword"
}
```

#### Password Reset Request
- **Endpoint**: `/api/v1/auth/password-reset/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "employer@example.com"
}
```

#### Password Reset Confirm
- **Endpoint**: `/api/v1/auth/password-reset/confirm/`
- **Method**: POST
- **Request Body**:
```json
{
  "token": "reset-token",
  "new_password": "newpassword",
  "new_password2": "newpassword"
}
```

#### Social Authentication
- **Endpoint**: `/api/v1/auth/social/`
- **Method**: POST
- **Request Body**:
```json
{
  "provider": "google-oauth2",
  "access_token": "oauth-token-from-provider"
}
```

### 1.2 Company Management

#### Create Company Profile
An employer can create their company profile to start posting jobs.
- **Endpoint**: `/api/v1/companies/`
- **Method**: POST
- **Request Body**:
```json
{
  "name": "Tech Solutions Inc",
  "description": "Leading software development company specializing in AI and machine learning solutions for enterprise clients.",
  "industry": "Software Development",
  "location": "San Francisco, CA",
  "size": "51-200",
  "website": "https://techsolutions.example.com",
  "email": "info@techsolutions.example.com",
  "phone": "+1-555-123-4567",
  "founding_date": "2010-03-15"
}
```

#### Update Company Profile
- **Endpoint**: `/api/v1/companies/{company_id}/`
- **Method**: PUT/PATCH
- **Request Body**:
```json
{
  "description": "Leading software development company specializing in AI, machine learning, and blockchain solutions for enterprise clients.",
  "size": "201-500",
  "linkedin": "https://linkedin.com/company/techsolutions",
  "twitter": "https://twitter.com/techsolutions"
}
```

#### Company Logo Upload
- **Endpoint**: `/api/v1/companies/{company_id}/upload_logo/`
- **Method**: POST
- **Request Body**: multipart/form-data
```
logo: [image file]
```

#### Add Company Benefit
- **Endpoint**: `/api/v1/companies/{company_id}/add_benefit/`
- **Method**: POST
- **Request Body**:
```json
{
  "title": "Remote Work Options",
  "description": "Flexible work arrangements with options to work from home 3 days per week.",
  "icon": "home"
}
```

#### Add Company Image
- **Endpoint**: `/api/v1/companies/{company_id}/add_image/`
- **Method**: POST
- **Request Body**: multipart/form-data
```
image: [image file]
caption: "Our San Francisco office"
display_order: 1
```

#### Add Company Member
- **Endpoint**: `/api/v1/companies/{company_id}/members/`
- **Method**: POST
- **Request Body**:
```json
{
  "user": "user-uuid",
  "role": "recruiter"
}
```

#### Update Member Role
- **Endpoint**: `/api/v1/companies/{company_id}/members/{member_id}/`
- **Method**: PATCH
- **Request Body**:
```json
{
  "role": "admin",
  "is_active": true
}
```

#### Send Team Invitation
- **Endpoint**: `/api/v1/companies/{company_id}/invitations/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "newrecruiter@example.com",
  "role": "recruiter"
}
```

### 1.3 Job Posting and Management

#### Create Job Posting
Employers can post new job openings.
- **Endpoint**: `/api/v1/jobs/`
- **Method**: POST
- **Request Body**:
```json
{
  "title": "Senior Software Engineer",
  "description": "We're looking for a senior software engineer to join our growing team...",
  "responsibilities": "Design and develop software applications; Lead small teams of developers; Implement CI/CD pipelines...",
  "requirements": "5+ years of experience in software development; Expertise in Python and JavaScript; Knowledge of cloud services...",
  "benefits": "Competitive salary, health insurance, flexible hours, remote work options...",
  "location": "San Francisco, CA",
  "is_remote": true,
  "is_hybrid": false,
  "category": "Software Development",
  "job_type": "full_time",
  "education_level": "bachelor",
  "experience_level": "senior",
  "min_salary": 120000,
  "max_salary": 150000,
  "salary_currency": "USD",
  "is_salary_visible": true,
  "application_deadline": "2025-06-30",
  "company_id": "company-uuid"
}
```

#### Update Job
- **Endpoint**: `/api/v1/jobs/{job_id}/`
- **Method**: PATCH
- **Request Body**:
```json
{
  "min_salary": 130000,
  "max_salary": 160000,
  "application_deadline": "2025-07-15"
}
```

#### Add Job Skill
- **Endpoint**: `/api/v1/jobs/{job_id}/add_skill/`
- **Method**: POST
- **Request Body**:
```json
{
  "skill": "React",
  "is_required": true
}
```

### 1.4 Application Management

#### Update Application Status
Employers can move applications through different stages (screening, interview, offer, hired, rejected).
- **Endpoint**: `/api/v1/applications/{application_id}/status/`
- **Method**: PATCH
- **Request Body**:
```json
{
  "status": "screening",
  "employer_notes": "Good candidate, move to interview phase",
  "notes": "Initial review completed, candidate has strong technical skills but needs further evaluation"
}
```

#### Create Application Question
- **Endpoint**: `/api/v1/applications/questions/{job_id}/`
- **Method**: POST
- **Request Body**:
```json
{
  "question": "Describe your experience with React and Redux",
  "description": "Please provide details about your past projects",
  "question_type": "textarea",
  "is_required": true,
  "display_order": 1
}
```

#### Create Application Stage
- **Endpoint**: `/api/v1/applications/stages/{company_id}/`
- **Method**: POST
- **Request Body**:
```json
{
  "name": "Technical Assessment",
  "description": "Candidates complete a coding challenge",
  "display_order": 2,
  "is_active": true
}
```

### 1.5 Communication

#### Create Conversation
- **Endpoint**: `/api/v1/conversations/`
- **Method**: POST
- **Request Body**:
```json
{
  "participant_ids": ["user-uuid-1", "user-uuid-2"],
  "subject": "Interview Scheduling",
  "initial_message": "Hello, I'd like to schedule an interview for the Senior Software Engineer position.",
  "conversation_type": "job_application",
  "job": "job-uuid",
  "application": "application-uuid"
}
```

#### Send Message
- **Endpoint**: `/api/v1/conversations/{conversation_id}/messages/`
- **Method**: POST
- **Request Body**:
```json
{
  "content": "Are you available for an interview next Tuesday at 2 PM?"
}
```

#### Mark All Notifications as Read
- **Endpoint**: `/api/v1/notifications/read-all/`
- **Method**: POST
- **Request Body**:
```json
{
  "notification_ids": ["notification-uuid-1", "notification-uuid-2"]
}
```

## 2. Job Seeker User Journey & Features

### 2.1 Authentication & Account Management

#### Registration
Job seekers can register for an account with `is_employer` set to false (default).
- **Endpoint**: `/api/v1/auth/register/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "jobseeker@example.com",
  "username": "jobseeker",
  "password": "securepassword",
  "password2": "securepassword",
  "first_name": "Jane",
  "last_name": "Smith",
  "is_employer": false
}
```

#### Login
- **Endpoint**: `/api/v1/auth/login/`
- **Method**: POST
- **Request Body**:
```json
{
  "email": "jobseeker@example.com",
  "password": "securepassword"
}
```

# 2.2 Profile Management


## Endpoints

### Get Current User's Profile ID
- **Endpoint**: `/api/v1/user/profile-id/`
- **Method**: GET
- **Response**:
```json
{
  "profile_id": "dde17981-4b05-413d-9563-d498cf75c158"
}
```

### Update Profile
- **Endpoint**: `/api/v1/profiles/{profile_id}/`
- **Method**: PATCH
- **Request Body**:
```json
{
  "bio": "Experienced software developer with a focus on web technologies and 5 years of experience in React, Node.js, and AWS.",
  "job_title": "Senior Frontend Developer",
  "years_experience": 5,
  "country": "United States",
  "salary_min": 90000,
  "salary_max": 120000,
  "salary_currency": "USD"
}
```

### Upload Profile Picture
- **Endpoint**: `/api/v1/profiles/{profile_id}/upload-profile-picture/`
- **Method**: POST
- **Request Body**: multipart/form-data
```
profile_picture: [image file]
```

### Add Experience
- **Endpoint**: `/api/v1/profiles/{profile_id}/experiences/`
- **Method**: POST
- **Request Body**:
```json
{
  "company_name": "Tech Innovators",
  "job_title": "Frontend Developer",
  "location": "Remote",
  "start_date": "2020-01-15",
  "end_date": "2022-06-30",
  "current_job": false,
  "description": "Developed web applications using React, Redux, and TypeScript. Led the migration from class components to functional components with hooks. Implemented CI/CD pipelines using GitHub Actions.",
  "portfolio_link": "https://github.com/janedoe/tech-innovators-project"
}
```

### Add Education
- **Endpoint**: `/api/v1/profiles/{profile_id}/education/`
- **Method**: POST
- **Request Body**:
```json
{
  "institution": "University of Technology",
  "degree": "undergraduate",
  "field_of_study": "Computer Science",
  "start_date": "2015-09-01",
  "end_date": "2019-05-30",
  "current": false
}
```

### Add Skill
- **Endpoint**: `/api/v1/profiles/{profile_id}/skills/`
- **Method**: POST
- **Request Body**:
```json
{
  "name": "React",
  "level": "expert"
}
```

### Add Certification
- **Endpoint**: `/api/v1/profiles/{profile_id}/certifications/`
- **Method**: POST
- **Request Body**:
```json
{
  "name": "AWS Certified Solutions Architect",
  "institution": "Amazon Web Services",
  "year_awarded": 2022,
  "credential_url": "https://www.youracclaim.com/badges/aws-certified-solutions-architect"
}
```

### Add Portfolio Item
- **Endpoint**: `/api/v1/profiles/{profile_id}/portfolio/`
- **Method**: POST
- **Request Body**: multipart/form-data
```
title: "E-commerce Website Redesign"
description: "Complete redesign of an e-commerce platform using React, Redux, and Node.js."
url: "https://example-project.com"
image: [image file]
```

## Integration Guide

When implementing these endpoints in your frontend application:

1. After login, make a GET request to `/api/v1/user/profile-id/` to retrieve the user's profile ID
2. Store this profile ID in your application state (Redux, Zustand, etc.)
3. Use this ID in all subsequent profile-related requests
4. If the profile doesn't exist yet, the `/api/v1/user/profile-id/` endpoint will create one and return its ID

All profile-related endpoints now use `{profile_id}` in the URL path instead of `me`. This approach provides better RESTful design and avoids the issues with the `/profiles/me/` endpoint.

## Security Notes

All endpoints include security checks to ensure users can only access and modify their own profiles. If a user attempts to access another user's profile, they will receive a 403 Forbidden response or an empty result set depending on the endpoint.

### 2.3 Job Search & Application

#### Search Jobs
Job seekers can search for jobs using various filters.
- **Endpoint**: `/api/v1/jobs/search/`
- **Method**: GET
- **Query Parameters**:
  - `q=frontend developer`
  - `location=San Francisco`
  - `remote=true`
  - `type=full_time`
  - `experience=senior`
  - `min_salary=100000`
  - `skills=React,TypeScript,Redux`

#### Save a Job
- **Endpoint**: `/api/v1/favorites/jobs/`
- **Method**: POST
- **Request Body**:
```json
{
  "job": "job-uuid",
  "notes": "Interesting opportunity, apply by next week"
}
```

#### Apply for Jobs
- **Endpoint**: `/api/v1/applications/`
- **Method**: POST
- **Request Body**: multipart/form-data
```
job: "job-uuid"
resume: [resume file]
cover_letter: "I am writing to apply for the position of Senior Frontend Developer at Tech Solutions Inc. With over 5 years of experience developing web applications using React and related technologies, I believe I would be a strong addition to your team..."
answers: "[{\"question\":\"question-uuid\",\"answer\":\"My experience with React includes 5 years of professional work building large-scale applications...\"}]"
```

#### Withdraw Application
- **Endpoint**: `/api/v1/applications/{application_id}/withdraw/`
- **Method**: POST
- **Request Body**: No body needed

### 2.4 Communication

#### Create Conversation
- **Endpoint**: `/api/v1/conversations/`
- **Method**: POST
- **Request Body**:
```json
{
  "participant_ids": ["employer-uuid"],
  "subject": "Question about Senior Frontend Developer position",
  "initial_message": "Hello, I'm interested in the Senior Frontend Developer position and had a question about the required skills. Could you please clarify if experience with GraphQL is required?",
  "conversation_type": "job_inquiry",
  "job": "job-uuid"
}
```

#### Send Message
- **Endpoint**: `/api/v1/conversations/{conversation_id}/messages/`
- **Method**: POST
- **Request Body**:
```json
{
  "content": "Thank you for the information. I look forward to hearing more about the position."
}
```

### 2.5 Company Reviews

#### Submit Company Review
- **Endpoint**: `/api/v1/companies/{company_id}/add_review/`
- **Method**: POST
- **Request Body**:
```json
{
  "rating": 4,
  "title": "Great place to work",
  "content": "I had a positive experience working here. The company culture is collaborative and there are many opportunities for professional growth.",
  "pros": "Great work-life balance, good benefits, collaborative team environment",
  "cons": "Limited advancement opportunities, occasional communication issues between departments",
  "employment_status": "former",
  "is_anonymous": true
}
```

---

This documentation provides a comprehensive overview of the user journeys and features available for both employers and job seekers on the TechHub platform, with API endpoints and example request bodies. The platform is deployed and these endpoints are accessible for integration with frontend applications.