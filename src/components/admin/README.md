# Admin Job Posting Components

This directory contains the admin job posting functionality that allows super admin users to post jobs on behalf of companies they have access to.

## Components

### AdminJobPostingForm.jsx
The main form component for admin job posting. Extends the standard JobPostingForm with admin-specific functionality:

**Features:**
- Company selection for admin users
- Application method configuration (internal, external URL, email)
- Comprehensive form validation with real-time feedback
- Rich text editing for job descriptions, requirements, etc.
- Skills management
- Salary and compensation configuration
- Admin context preservation throughout the form

**Props:**
- `initialData` (object, optional): Initial job data for editing
- `isEdit` (boolean, optional): Whether the form is in edit mode

### CompanySelector.jsx
Dropdown component for selecting companies that admin has access to:

**Features:**
- Search and filter functionality
- Company information display (logo, name, location)
- Loading states and error handling
- Accessibility support

### ApplicationMethodSelector.jsx
Component for configuring job application methods:

**Features:**
- Multiple application method selection
- Conditional field display based on selected methods
- Real-time validation for URLs and emails
- Visual feedback for selected methods

## Hooks

### useAdminAuth.js
Authentication and authorization hook for admin users:

**Features:**
- Admin status detection
- Company access management
- Permission checking
- Accessible companies fetching

### useAdminJobs.js
Hook for admin job operations:

**Features:**
- Admin job creation and updating
- Form data transformation to API format
- Error handling and loading states
- Admin context validation

### useAdminJobValidation.js
Comprehensive validation hook for admin job forms:

**Features:**
- Real-time field validation
- Form-level validation
- Touch state management
- Error message formatting
- Validation state management

## Utilities

### adminJobValidation.js
Validation utility functions:

**Features:**
- Admin-specific field validation
- Standard job field validation
- Skills validation
- Cross-field validation
- Validation rules and constants

## Usage Example

```jsx
import AdminJobPostingForm from '@/components/admin/AdminJobPostingForm';

// For creating a new job
<AdminJobPostingForm />

// For editing an existing job
<AdminJobPostingForm 
  initialData={jobData} 
  isEdit={true} 
/>
```

## Admin Requirements

To use these components, the user must:
1. Be authenticated with `user_type='super_admin'`
2. Have access to at least one company via `CompanyAdminAccess`
3. Have the necessary permissions to post jobs

## Validation Rules

### Required Fields
- Company selection
- Job title (3-100 characters)
- Job description (50-5000 characters)
- Job category
- At least one application method

### Optional Fields
- Location
- Requirements, responsibilities, benefits
- Salary information
- Application deadline
- Skills (up to 15)

### Admin-Specific Validation
- Company access verification
- Application method configuration validation
- URL format validation for external applications
- Email format validation for email applications

## Error Handling

The components provide comprehensive error handling:
- Network errors with retry suggestions
- Validation errors with specific field feedback
- Permission errors with clear messaging
- Loading states for better UX

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Testing

Use `AdminJobPostingDemo.jsx` for development and testing purposes. This component provides a complete testing environment for the admin job posting functionality.