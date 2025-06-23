// src/lib/utils/formatting.js
export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return '';
  
  const defaultOptions = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  
  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(number);
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

export const formatSalaryRange = (min, max, currency = 'USD') => {
  if (!min && !max) return 'Salary not specified';
  if (!min) return `Up to ${formatCurrency(max, currency)}`;
  if (!max) return `From ${formatCurrency(min, currency)}`;
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export const formatCompanySize = (size) => {
  const sizeMap = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1001+': '1001+ employees',
  };
  
  return sizeMap[size] || size;
};

export const formatJobType = (type) => {
  const typeMap = {
    'full_time': 'Full Time',
    'part_time': 'Part Time',
    'contract': 'Contract',
    'temporary': 'Temporary',
    'internship': 'Internship',
    'remote': 'Remote',
  };
  
  return typeMap[type] || type;
};

export const formatExperienceLevel = (level) => {
  const levelMap = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive Level',
  };
  
  return levelMap[level] || level;
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};