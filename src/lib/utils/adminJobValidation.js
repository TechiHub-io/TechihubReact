// src/lib/utils/adminJobValidation.js
import { validateApplicationMethodField } from './applicationMethodValidation';
import { APPLICATION_METHODS } from '@/components/admin/ApplicationMethodSelector';

/**
 * Validation utility for admin job posting forms
 * Extends standard job validation with admin-specific requirements
 */

// Character limits for job fields
export const CHARACTER_LIMITS = {
  title: { min: 3, max: 100 },
  description: { min: 50, max: 5000 },
  responsibilities: { min: 20, max: 3000 },
  requirements: { min: 20, max: 3000 },
  benefits: { min: 10, max: 2000 },
  location: { min: 2, max: 100 }
};

export const MAX_SKILLS = 15;

/**
 * Validate admin-specific fields
 */
export const validateAdminField = (fieldName, value, formData = {}, adminContext = {}) => {
  const errors = {};

  switch (fieldName) {
    case 'companyId':
      if (!value || value.trim() === '') {
        errors[fieldName] = 'Company selection is required for admin job posting';
      } else if (adminContext.hasCompanyAccess && !adminContext.hasCompanyAccess(value)) {
        errors[fieldName] = 'You do not have access to the selected company';
      } else if (adminContext.accessibleCompanies && !adminContext.accessibleCompanies.some(c => c.id === value)) {
        errors[fieldName] = 'Selected company is not in your accessible companies list';
      }
      break;

    case 'applicationMethods':
      if (!value || !Array.isArray(value) || value.length === 0) {
        errors[fieldName] = 'At least one application method must be selected';
      } else {
        // Validate that selected methods are valid
        const validMethods = Object.values(APPLICATION_METHODS);
        const invalidMethods = value.filter(method => !validMethods.includes(method));
        if (invalidMethods.length > 0) {
          errors[fieldName] = `Invalid application methods: ${invalidMethods.join(', ')}`;
        }
      }
      break;

    case 'applicationUrl':
      if (formData.applicationMethods && formData.applicationMethods.includes(APPLICATION_METHODS.EXTERNAL_URL)) {
        const urlError = validateApplicationMethodField('applicationUrl', value, formData.applicationMethods);
        if (urlError) {
          errors[fieldName] = urlError;
        }
      }
      break;

    case 'applicationEmail':
      if (formData.applicationMethods && formData.applicationMethods.includes(APPLICATION_METHODS.EMAIL)) {
        const emailError = validateApplicationMethodField('applicationEmail', value, formData.applicationMethods);
        if (emailError) {
          errors[fieldName] = emailError;
        }
      }
      break;

    default:
      // For non-admin fields, use standard validation
      break;
  }

  return errors;
};

/**
 * Validate standard job fields with admin context
 */
export const validateJobField = (fieldName, value, formData = {}) => {
  const errors = {};

  switch (fieldName) {
    case 'title':
      if (!value || !value.trim()) {
        errors[fieldName] = 'Job title is required';
      } else if (value.length < CHARACTER_LIMITS.title.min) {
        errors[fieldName] = `Title must be at least ${CHARACTER_LIMITS.title.min} characters`;
      } else if (value.length > CHARACTER_LIMITS.title.max) {
        errors[fieldName] = `Title must not exceed ${CHARACTER_LIMITS.title.max} characters`;
      }
      break;

    case 'description':
      const textContent = value ? value.replace(/<[^>]*>/g, '').trim() : '';
      if (!textContent) {
        errors[fieldName] = 'Job description is required';
      } else if (textContent.length < CHARACTER_LIMITS.description.min) {
        errors[fieldName] = `Description must be at least ${CHARACTER_LIMITS.description.min} characters`;
      } else if (textContent.length > CHARACTER_LIMITS.description.max) {
        errors[fieldName] = `Description must not exceed ${CHARACTER_LIMITS.description.max} characters`;
      }
      break;

    case 'responsibilities':
      if (value) {
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.responsibilities.min) {
          errors[fieldName] = `Responsibilities must be at least ${CHARACTER_LIMITS.responsibilities.min} characters`;
        } else if (textContent.length > CHARACTER_LIMITS.responsibilities.max) {
          errors[fieldName] = `Responsibilities must not exceed ${CHARACTER_LIMITS.responsibilities.max} characters`;
        }
      }
      break;

    case 'requirements':
      if (value) {
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.requirements.min) {
          errors[fieldName] = `Requirements must be at least ${CHARACTER_LIMITS.requirements.min} characters`;
        } else if (textContent.length > CHARACTER_LIMITS.requirements.max) {
          errors[fieldName] = `Requirements must not exceed ${CHARACTER_LIMITS.requirements.max} characters`;
        }
      }
      break;

    case 'benefits':
      if (value) {
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        if (textContent.length > 0 && textContent.length < CHARACTER_LIMITS.benefits.min) {
          errors[fieldName] = `Benefits must be at least ${CHARACTER_LIMITS.benefits.min} characters`;
        } else if (textContent.length > CHARACTER_LIMITS.benefits.max) {
          errors[fieldName] = `Benefits must not exceed ${CHARACTER_LIMITS.benefits.max} characters`;
        }
      }
      break;

    case 'category':
      if (!value || value.trim() === '') {
        errors[fieldName] = 'Job category is required';
      }
      break;

    case 'location':
      if (value && value.length < CHARACTER_LIMITS.location.min) {
        errors[fieldName] = `Location must be at least ${CHARACTER_LIMITS.location.min} characters`;
      } else if (value && value.length > CHARACTER_LIMITS.location.max) {
        errors[fieldName] = `Location must not exceed ${CHARACTER_LIMITS.location.max} characters`;
      }
      break;

    case 'min_salary':
      if (value) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
          errors[fieldName] = 'Minimum salary must be a positive number';
        }
        // Additional currency-specific validation can be added here
      }
      break;

    case 'max_salary':
      if (value) {
        const numValue = Number(value);
        const minSalary = Number(formData.min_salary);
        if (isNaN(numValue) || numValue < 0) {
          errors[fieldName] = 'Maximum salary must be a positive number';
        } else if (minSalary && numValue <= minSalary) {
          errors[fieldName] = 'Maximum salary must be greater than minimum salary';
        }
      }
      break;

    case 'application_deadline':
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          errors[fieldName] = 'Application deadline must be in the future';
        }
      }
      break;

    default:
      // No validation for unknown fields
      break;
  }

  return errors;
};

/**
 * Validate skills array
 */
export const validateSkills = (skills) => {
  const errors = {};

  if (!Array.isArray(skills)) {
    errors.skills = 'Skills must be an array';
    return errors;
  }

  if (skills.length === 0) {
    errors.skills = 'At least one skill is recommended';
  } else if (skills.length > MAX_SKILLS) {
    errors.skills = `Maximum ${MAX_SKILLS} skills allowed`;
  }

  // Validate individual skills
  const invalidSkills = skills.filter(skill => 
    !skill.name || 
    typeof skill.name !== 'string' || 
    skill.name.trim().length === 0 ||
    skill.name.length > 50
  );

  if (invalidSkills.length > 0) {
    errors.skills = 'All skills must have valid names (1-50 characters)';
  }

  // Check for duplicate skills
  const skillNames = skills.map(skill => skill.name.toLowerCase().trim());
  const duplicates = skillNames.filter((name, index) => skillNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    errors.skills = 'Duplicate skills are not allowed';
  }

  return errors;
};

/**
 * Comprehensive validation for admin job posting form
 */
export const validateAdminJobForm = (formData, adminContext = {}) => {
  const errors = {};

  // Validate admin-specific fields first
  const adminFields = ['companyId', 'applicationMethods', 'applicationUrl', 'applicationEmail'];
  adminFields.forEach(field => {
    const fieldErrors = validateAdminField(field, formData[field], formData, adminContext);
    Object.assign(errors, fieldErrors);
  });

  // Validate standard job fields
  const jobFields = [
    'title', 'description', 'responsibilities', 'requirements', 'benefits',
    'category', 'location', 'min_salary', 'max_salary', 'application_deadline'
  ];
  jobFields.forEach(field => {
    const fieldErrors = validateJobField(field, formData[field], formData);
    Object.assign(errors, fieldErrors);
  });

  // Validate skills
  const skillErrors = validateSkills(formData.skills || []);
  Object.assign(errors, skillErrors);

  // Cross-field validations
  if (formData.min_salary && formData.max_salary) {
    const minSalary = Number(formData.min_salary);
    const maxSalary = Number(formData.max_salary);
    if (!isNaN(minSalary) && !isNaN(maxSalary) && maxSalary <= minSalary) {
      errors.max_salary = 'Maximum salary must be greater than minimum salary';
    }
  }

  // Application method specific validations
  if (formData.applicationMethods && Array.isArray(formData.applicationMethods)) {
    if (formData.applicationMethods.includes(APPLICATION_METHODS.EXTERNAL_URL) && !formData.applicationUrl) {
      errors.applicationUrl = 'Application URL is required when external URL method is selected';
    }
    if (formData.applicationMethods.includes(APPLICATION_METHODS.EMAIL) && !formData.applicationEmail) {
      errors.applicationEmail = 'Application email is required when email method is selected';
    }
  }

  return errors;
};

/**
 * Validate a single field (used for real-time validation)
 */
export const validateSingleField = (fieldName, value, formData = {}, adminContext = {}) => {
  // Check if it's an admin field
  const adminFields = ['companyId', 'applicationMethods', 'applicationUrl', 'applicationEmail'];
  if (adminFields.includes(fieldName)) {
    return validateAdminField(fieldName, value, formData, adminContext);
  }

  // Check if it's a skills field
  if (fieldName === 'skills') {
    return validateSkills(value);
  }

  // Otherwise, validate as a standard job field
  return validateJobField(fieldName, value, formData);
};

/**
 * Check if form has any validation errors
 */
export const hasValidationErrors = (errors) => {
  return Object.keys(errors).some(key => errors[key] !== undefined && errors[key] !== null && errors[key] !== '');
};

/**
 * Get the first field with an error (for scrolling to first error)
 */
export const getFirstErrorField = (errors) => {
  const errorFields = Object.keys(errors).filter(key => errors[key]);
  return errorFields.length > 0 ? errorFields[0] : null;
};

/**
 * Format validation errors for display
 */
export const formatValidationError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  if (Array.isArray(error)) {
    return error.join(', ');
  }
  if (typeof error === 'object' && error.message) {
    return error.message;
  }
  return 'Invalid input';
};

/**
 * Admin-specific validation rules summary
 */
export const ADMIN_VALIDATION_RULES = {
  companyId: {
    required: true,
    description: 'Admin must select a company they have access to'
  },
  applicationMethods: {
    required: true,
    minItems: 1,
    description: 'At least one application method must be selected'
  },
  applicationUrl: {
    conditionallyRequired: true,
    condition: 'when external URL method is selected',
    format: 'valid URL',
    description: 'Required when external URL application method is selected'
  },
  applicationEmail: {
    conditionallyRequired: true,
    condition: 'when email method is selected',
    format: 'valid email address',
    description: 'Required when email application method is selected'
  }
};

export default {
  validateAdminField,
  validateJobField,
  validateSkills,
  validateAdminJobForm,
  validateSingleField,
  hasValidationErrors,
  getFirstErrorField,
  formatValidationError,
  CHARACTER_LIMITS,
  MAX_SKILLS,
  ADMIN_VALIDATION_RULES
};