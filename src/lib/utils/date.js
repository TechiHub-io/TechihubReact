// src/lib/utils/date.js
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString();
    case 'datetime':
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    default:
      return dateObj.toLocaleDateString();
  }
};

export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const seconds = Math.floor((now - dateObj) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return '1 minute ago';
  
  if (seconds < 10) return 'just now';
  
  return `${Math.floor(seconds)} seconds ago`;
};

export const isDateExpired = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj < new Date();
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  const now = new Date();
  const diffTime = dateObj - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = formatDate(startDate, 'short');
  
  if (!endDate) return `${start} - Present`;
  
  const end = formatDate(endDate, 'short');
  return `${start} - ${end}`;
};