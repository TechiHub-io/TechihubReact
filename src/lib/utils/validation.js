// src/lib/utils/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const validateRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return value !== null && value !== undefined;
};

export const validateMinLength = (value, minLength) => {
  if (typeof value === 'string') return value.length >= minLength;
  if (Array.isArray(value)) return value.length >= minLength;
  return false;
};

export const validateMaxLength = (value, maxLength) => {
  if (typeof value === 'string') return value.length <= maxLength;
  if (Array.isArray(value)) return value.length <= maxLength;
  return false;
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.message || 'This field is required';
    }
    
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = fieldRules.message || 'Invalid email address';
    }
    
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.message || `Minimum length is ${fieldRules.minLength}`;
    }
    
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.message || `Maximum length is ${fieldRules.maxLength}`;
    }
    
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || 'Invalid format';
    }
    
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const result = fieldRules.custom(value, values);
      if (result !== true) {
        errors[field] = result || 'Invalid value';
      }
    }
  });
  
  return errors;
};